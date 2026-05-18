/**
 * v86-runtime.js
 * Encapsulates all interaction with the v86 x86 emulator.
 *
 * Exposes:
 *   V86Runtime.bootVm()    — async; validates assets and starts the VM
 *   V86Runtime.resetVm()   — reboots the running VM
 *   V86Runtime.saveState() — serialises VM memory to IndexedDB
 *   V86Runtime.restoreState() — deserialises VM memory from IndexedDB
 *   V86Runtime.sendCommand(command, options) — sends text to the VM console
 */

(function() {
    "use strict";

    // The active V86 emulator instance. Null until bootVm() succeeds.
    var emulator = null;

    // Accumulated serial output buffer for scanning milestone strings.
    var serialBuffer = "";

    // Cap buffer size so we never leak unbounded memory.
    var MAX_SERIAL_BUFFER = 8000;

    // Gate to prevent double-boot clicks.
    var bootInProgress = false;

    var STATE_DB_NAME = "browser_linux_lab_vm_state";
    var STATE_DB_VERSION = 1;
    var STATE_STORE_NAME = "snapshots";
    var STATE_KEY = "latest";

    /**
     * bootVm()
     * Asynchronously validates prerequisites, fetches the filesystem manifest,
     * and constructs the V86 emulator with the Alpine Linux configuration.
     */
    async function bootVm() {
        // Prevent concurrent or duplicate boot attempts.
        if (emulator) {
            window.LabState.addLog("VM is already active. Use Reset if you need a fresh boot.");
            return;
        }
        if (bootInProgress) {
            window.LabState.addLog("Boot is already in progress.");
            return;
        }

        bootInProgress = true;
        window.LabState.setState("booting");
        window.LabState.addLog("--- Starting boot sequence ---");

        // ------------------------------------------------------------------
        // 1. Capability sanity check
        // ------------------------------------------------------------------
        var capReport = window.CapabilityChecks.runChecks();
        if (!capReport.passed) {
            window.LabState.setState("error");
            window.LabState.addLog("Capability checks failed. Boot aborted.");
            bootInProgress = false;
            return;
        }

        // ------------------------------------------------------------------
        // 2. Asset reachability check
        //    The filesystem manifest is the single source of truth for the
        //    Alpine rootfs. If it is missing, v86 will hang silently later.
        // ------------------------------------------------------------------
        try {
            var headResp = await fetch("images/alpine-fs.json", { method: "HEAD" });
            if (!headResp.ok) {
                throw new Error("HTTP status " + headResp.status);
            }
            window.LabState.addLog("Asset OK: images/alpine-fs.json is reachable.");
        } catch (err) {
            window.LabState.setState("error");
            window.LabState.addLog("Asset FAIL: images/alpine-fs.json unreachable (" + err.message + ").");
            bootInProgress = false;
            return;
        }

        // ------------------------------------------------------------------
        // 3. Build v86 configuration
        // ------------------------------------------------------------------
        var config = {
            // Path to the v86 WebAssembly core.
            // This is the x86 CPU emulator compiled to .wasm; without it no
            // instruction emulation can occur.
            wasm_path: "v86/build/v86.wasm",

            // Guest RAM: 512 MB.
            // Enough headroom for Alpine Linux, Docker daemon, and small containers.
            memory_size: 512 * 1024 * 1024,

            // VGA VRAM: 8 MB.
            // Provides a comfortable framebuffer for the text console.
            vga_memory_size: 8 * 1024 * 1024,

            // The DOM node where v86 injects its <canvas> screen output.
            screen_container: document.getElementById("screen_container"),

            // SeaBIOS — open-source x86 firmware that handles early boot.
            bios: { url: "v86/bios/seabios.bin" },

            // VGA BIOS — initialises the virtual graphics adapter.
            vga_bios: { url: "v86/bios/vgabios.bin" },

            // 9p (Plan 9) filesystem mount.
            // basefs   = JSON manifest describing every file, permission, and symlink.
            // baseurl  = directory containing the zstd-compressed, sha256-named chunks.
            filesystem: {
                baseurl: "images/alpine-rootfs-flat",
                basefs: "images/alpine-fs.json",
            },

            // autostart tells v86 to begin CPU execution as soon as all
            // asynchronous assets (BIOS, WASM, filesystem chunks) have loaded.
            autostart: true,

            // Instead of manually specifying bzImage and initrd URLs, we let
            // v86 discover them automatically inside the 9p filesystem manifest.
            // This decouples the HTML from the exact paths chosen by the image builder.
            bzimage_initrd_from_filesystem: true,

            // Kernel command line passed to the Linux boot loader.
            //   rw                         — mount root read-write
            //   root=host9p                — use the 9p filesystem as /
            //   rootfstype=9p              — explicit root filesystem type
            //   rootflags=trans=virtio,cache=loose
            //                              — virtio transport with loose coherency
            //   modules=virtio_pci         — ensure virtio_pci is loaded early
            //   tsc=reliable               — avoid clocksource fallback delays
            cmdline: "rw root=host9p rootfstype=9p rootflags=trans=virtio,cache=loose modules=virtio_pci tsc=reliable",

            // Network relay for outbound internet access via virtio-net.
            // The relay must speak the v86 websocket protocol.
            // A local websockproxy relay is proxied through nginx at /ws/v86/.
            // Match the current page origin, including non-default ports such
            // as :9998 or the SSO gateway port. HTTPS pages must use wss://.
            net_device: {
                type: "virtio",
                relay_url: (window.location.protocol === "https:" ? "wss://" : "ws://") +
                    window.location.host + "/ws/v86/",
            },
        };

        // ------------------------------------------------------------------
        // 4. Instantiate the emulator
        // ------------------------------------------------------------------
        try {
            emulator = new V86(config);
            window.LabState.addLog("V86 instance created. Loading assets...");
        } catch (e) {
            window.LabState.setState("error");
            window.LabState.addLog("V86 constructor threw: " + e.message);
            bootInProgress = false;
            return;
        }

        // ------------------------------------------------------------------
        // 5. Wire emulator lifecycle events
        // ------------------------------------------------------------------

        // emulator-ready: SeaBIOS has finished and control has been transferred
        // to the bootloader / kernel. The guest OS is now executing.
        emulator.add_listener("emulator-ready", function() {
            window.LabState.addLog("Event: emulator-ready — CPU running, kernel loading.");
            window.LabState.setState("alpine_ready");
        });

        // emulator-stopped: CPU halted (triple fault, shutdown instruction, etc.)
        emulator.add_listener("emulator-stopped", function() {
            window.LabState.addLog("Event: emulator-stopped — CPU halted.");
            window.LabState.setState("error");
        });

        // serial0-output-char: every character emitted by the guest on COM1.
        // Alpine's inittab / kernel console is assumed to direct output here.
        // We accumulate characters so we can scan for multi-word milestone strings.
        emulator.add_listener("serial0-output-char", function(ch) {
            serialBuffer += ch;
            if (serialBuffer.length > MAX_SERIAL_BUFFER) {
                serialBuffer = serialBuffer.slice(serialBuffer.length - MAX_SERIAL_BUFFER);
            }

            // -- Docker milestone --
            // The VM image builder arranges for dockerd startup to emit:
            //   "Docker: daemon is running"
            // on the serial line once the daemon is accepting API calls.
            if (serialBuffer.indexOf("Docker: daemon is running") !== -1) {
                var st = window.LabState.getState();
                if (st !== "docker_ready" && st !== "network_online") {
                    window.LabState.setState("docker_ready");
                    window.LabState.addLog("Milestone: Docker daemon is running.");
                }
            }

            // -- Network milestone --
            // We look for several common Alpine / BusyBox DHCP and link-up strings:
            //   "udhcpc: lease of"  — DHCP ACK received
            //   "eth0: link up"     — virtio-net link state up
            //   "bound to"          — udhcpc has bound an address
            if (serialBuffer.indexOf("udhcpc: lease of") !== -1 ||
                serialBuffer.indexOf("eth0: link up") !== -1 ||
                serialBuffer.indexOf("bound to") !== -1) {
                if (window.LabState.getState() !== "network_online") {
                    window.LabState.setState("network_online");
                    window.LabState.addLog("Milestone: Network interface configured.");
                }
            }
        });

        // download-progress: feedback for large file fetches (BIOS, WASM, rootfs chunks).
        emulator.add_listener("download-progress", function(e) {
            if (e.total > 0) {
                var pct = Math.round((e.loaded / e.total) * 100);
                window.LabState.addLog("Download " + e.file + ": " + pct + "%");
            }
        });

        bootInProgress = false;
    }

    /**
     * resetVm()
     * Performs a hard CPU restart. The VM re-runs SeaBIOS and reboots Alpine.
     */
    function resetVm() {
        if (!emulator) {
            window.LabState.addLog("No VM instance exists. Boot first.");
            return;
        }
        window.LabState.addLog("Resetting VM (CPU restart)...");
        serialBuffer = "";
        emulator.restart();
        window.LabState.setState("booting");
    }

    /**
     * saveState()
     * Captures the full VM state (RAM, CPU registers, devices) and stores it
     * in IndexedDB. Full VM snapshots are far too large for localStorage.
     */
    function saveState() {
        if (!emulator) {
            window.LabState.addLog("No VM running; nothing to save.");
            return;
        }
        if (!window.indexedDB) {
            window.LabState.addLog("State save failed: IndexedDB is not available in this browser.");
            return;
        }
        window.LabState.addLog("Saving VM state...");
        emulator.save_state(function(error, stateArrayBuffer) {
            if (error) {
                window.LabState.addLog("Save state error: " + error);
                return;
            }
            saveStateToDb(stateArrayBuffer).then(function() {
                var sizeMb = Math.round((stateArrayBuffer.byteLength / 1024 / 1024) * 10) / 10;
                window.LabState.addLog("State saved to IndexedDB (" + sizeMb + " MB).");
            }).catch(function(e) {
                window.LabState.addLog("State save failed: " + e.message);
            });
        });
    }

    /**
     * restoreState()
     * Loads a previously saved VM state from IndexedDB back into the
     * active emulator instance. The guest resumes exactly where it left off.
     */
    function restoreState() {
        if (!emulator) {
            window.LabState.addLog("No VM running; cannot restore state.");
            return;
        }
        if (!window.indexedDB) {
            window.LabState.addLog("State restore failed: IndexedDB is not available in this browser.");
            return;
        }
        window.LabState.addLog("Restoring VM state...");
        loadStateFromDb().then(function(stateArrayBuffer) {
            if (!stateArrayBuffer) {
                window.LabState.addLog("No saved state found in IndexedDB.");
                return;
            }
            emulator.restore_state(stateArrayBuffer);
            window.LabState.addLog("State restored successfully.");
            // After a restore we assume at least Alpine was up when saved.
            window.LabState.setState("alpine_ready");
        }).catch(function(e) {
            window.LabState.addLog("State restore failed: " + e.message);
        });
    }

    function openStateDb() {
        return new Promise(function(resolve, reject) {
            var request = indexedDB.open(STATE_DB_NAME, STATE_DB_VERSION);
            request.onupgradeneeded = function(event) {
                var db = event.target.result;
                if (!db.objectStoreNames.contains(STATE_STORE_NAME)) {
                    db.createObjectStore(STATE_STORE_NAME);
                }
            };
            request.onsuccess = function(event) {
                resolve(event.target.result);
            };
            request.onerror = function(event) {
                reject(event.target.error || new Error("IndexedDB open failed"));
            };
            request.onblocked = function() {
                reject(new Error("IndexedDB upgrade is blocked by another open tab"));
            };
        });
    }

    function saveStateToDb(stateArrayBuffer) {
        return withStateStore("readwrite", function(store) {
            return store.put(stateArrayBuffer, STATE_KEY);
        });
    }

    function loadStateFromDb() {
        return withStateStore("readonly", function(store) {
            return store.get(STATE_KEY);
        });
    }

    function withStateStore(mode, operation) {
        return openStateDb().then(function(db) {
            return new Promise(function(resolve, reject) {
                var tx = db.transaction(STATE_STORE_NAME, mode);
                var store = tx.objectStore(STATE_STORE_NAME);
                var request = operation(store);

                request.onsuccess = function(event) {
                    resolve(event.target.result || null);
                };
                request.onerror = function(event) {
                    reject(event.target.error || new Error("IndexedDB operation failed"));
                };
                tx.oncomplete = function() {
                    db.close();
                };
                tx.onabort = function(event) {
                    db.close();
                    reject(event.target.error || new Error("IndexedDB transaction aborted"));
                };
                tx.onerror = function(event) {
                    db.close();
                    reject(event.target.error || new Error("IndexedDB transaction failed"));
                };
            });
        });
    }

    /**
     * getEmulator()
     * Returns the active V86 instance, or null.
     */
    function getEmulator() {
        return emulator;
    }

    /**
     * sendCommand(command, options)
     * Sends text to the guest console. Alpine exposes a login shell on serial0
     * in this image, so serial input is the most reliable way to drive lesson
     * command blocks.
     *
     * @returns {{ok: boolean, reason?: string}}
     */
    function sendCommand(command, options) {
        options = options || {};
        if (!emulator) {
            window.LabState.addLog("No VM running; boot the VM before sending commands.");
            return { ok: false, reason: "not_booted" };
        }
        if (!command || !String(command).trim()) {
            return { ok: false, reason: "empty_command" };
        }

        var text = String(command);
        if (options.enter && text.charAt(text.length - 1) !== "\n") {
            text += "\n";
        }

        if (typeof emulator.serial0_send === "function") {
            emulator.serial0_send(text);
        } else if (typeof emulator.keyboard_send_text === "function") {
            emulator.keyboard_send_text(text);
        } else {
            window.LabState.addLog("VM input API is unavailable in this v86 build.");
            return { ok: false, reason: "input_unavailable" };
        }

        window.LabState.addLog("Sent command block to VM console.");
        return { ok: true };
    }

    /**
     * verifyCommand(command, expectedOutput, timeoutMs)
     * Sends a command silently and waits for a specific string in the serial buffer.
     * Useful for automated lab validation.
     */
    function verifyCommand(command, expectedOutput, timeoutMs) {
        timeoutMs = timeoutMs || 5000;
        if (!emulator) return Promise.reject(new Error("VM not running"));

        return new Promise(function(resolve, reject) {
            var timeout = setTimeout(function() {
                emulator.remove_listener("serial0-output-char", listener);
                reject(new Error("Verification timed out"));
            }, timeoutMs);

            var listener = function() {
                if (serialBuffer.indexOf(expectedOutput) !== -1) {
                    clearTimeout(timeout);
                    emulator.remove_listener("serial0-output-char", listener);
                    resolve(true);
                }
            };

            emulator.add_listener("serial0-output-char", listener);
            
            // Send command with a trailing newline to execute
            var text = String(command);
            if (text.charAt(text.length - 1) !== "\n") text += "\n";
            
            if (typeof emulator.serial0_send === "function") {
                emulator.serial0_send(text);
            } else {
                emulator.keyboard_send_text(text);
            }
        });
    }

    // Expose public API on the global window object.
    window.V86Runtime = {
        bootVm: bootVm,
        resetVm: resetVm,
        saveState: saveState,
        restoreState: restoreState,
        getEmulator: getEmulator,
        sendCommand: sendCommand,
        verifyCommand: verifyCommand
    };
})();

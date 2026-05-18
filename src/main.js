/**
 * main.js
 * Application entry point. Wires together:
 *   - CapabilityChecks (browser feature validation)
 *   - LabState         (persistent state machine + logging)
 *   - V86Runtime       (emulator lifecycle)
 *
 * No ES modules are used; all dependencies are loaded via <script> tags
 * and attached to `window`.
 */

(function() {
    "use strict";

    /**
     * Initialise the UI, run checks, bind buttons, and restore prior logs.
     */
    function init() {
        // ------------------------------------------------------------------
        // 1. Capability checks on page load
        // ------------------------------------------------------------------
        var capReport = window.CapabilityChecks.runChecks();
        var warningContainer = document.getElementById("capability-warnings");
        window.CapabilityChecks.renderWarnings(warningContainer, capReport);

        if (capReport.passed) {
            window.LabState.addLog("Capability checks passed.");
        } else {
            window.LabState.addLog("ERROR: Capability checks failed — see banner above.");
        }

        // ------------------------------------------------------------------
        // 2. Bind button click handlers
        // ------------------------------------------------------------------
        var btnBoot = document.getElementById("btn-boot");
        var btnReset = document.getElementById("btn-reset");
        var btnSave = document.getElementById("btn-save");
        var btnRestore = document.getElementById("btn-restore");

        if (btnBoot) {
            btnBoot.addEventListener("click", function() {
                window.V86Runtime.bootVm();
            });
        }
        if (btnReset) {
            btnReset.addEventListener("click", function() {
                window.V86Runtime.resetVm();
            });
        }
        if (btnSave) {
            btnSave.addEventListener("click", function() {
                window.V86Runtime.saveState();
            });
        }
        if (btnRestore) {
            btnRestore.addEventListener("click", function() {
                window.V86Runtime.restoreState();
            });
        }

        // ------------------------------------------------------------------
        // Sidebar Toggle Logic
        // ------------------------------------------------------------------
        var btnToggle = document.getElementById("sidebar-toggle");
        var layout = document.querySelector(".layout");
        if (btnToggle && layout) {
            btnToggle.addEventListener("click", function() {
                layout.classList.toggle("sidebar-collapsed");
                // Trigger resize to fix terminal layout
                setTimeout(onWindowResize, 350);
            });
        }

        // ------------------------------------------------------------------
        // 3. Register reactive UI updaters
        // ------------------------------------------------------------------
        window.LabState.onStateChange(updateUiForState);

        resetStaleRuntimeState();

        window.LabState.onLog(appendLogEntry);

        // Replay any logs that survived a page refresh
        var previousLogs = window.LabState.getLogs();
        for (var i = 0; i < previousLogs.length; i++) {
            appendLogEntry(previousLogs[i]);
        }

        // Set the initial visual state (could be restored from localStorage)
        updateUiForState(window.LabState.getState());

        if (window.CoursePlayer && typeof window.CoursePlayer.init === "function") {
            window.CoursePlayer.init();
        }

        // ------------------------------------------------------------------
        // 4. Window resize handling
        // ------------------------------------------------------------------
        window.addEventListener("resize", onWindowResize);

        window.LabState.addLog("Application ready. Click 'Boot VM' to start Alpine Linux.");
    }

    function resetStaleRuntimeState() {
        var state = window.LabState.getState();
        var emulator = window.V86Runtime && window.V86Runtime.getEmulator &&
            window.V86Runtime.getEmulator();
        var staleRunningState = state === "booting" ||
            state === "alpine_ready" ||
            state === "docker_ready" ||
            state === "network_online";

        if (!emulator && staleRunningState) {
            window.LabState.setState("not_booted");
            window.LabState.addLog("Previous VM session ended; ready for a fresh boot.");
        }
    }

    /**
     * updateUiForState(state)
     * Updates the status pill text + color, and enables/disables action buttons
     * based on what makes sense for the current lifecycle stage.
     */
    function updateUiForState(state) {
        var pill = document.getElementById("status-pill");
        if (!pill) return;

        var labelMap = {
            not_booted: "Not booted",
            booting: "Booting",
            alpine_ready: "Alpine ready",
            docker_ready: "Docker ready",
            network_online: "Network online",
            error: "Error"
        };
        pill.textContent = labelMap[state] || state;
        pill.className = "status-pill state-" + state;

        var btnBoot = document.getElementById("btn-boot");
        var btnReset = document.getElementById("btn-reset");
        var btnSave = document.getElementById("btn-save");
        var btnRestore = document.getElementById("btn-restore");

        var hasEmulator = window.V86Runtime && window.V86Runtime.getEmulator &&
            !!window.V86Runtime.getEmulator();

        // Boot is only useful when there is no active VM.
        if (btnBoot) {
            var isRunning = hasEmulator && (state === "booting" ||
                                            state === "alpine_ready" ||
                                            state === "docker_ready" ||
                                            state === "network_online");
            btnBoot.disabled = isRunning;
        }

        // Reset needs a running VM.
        if (btnReset) {
            btnReset.disabled = !hasEmulator || state === "booting";
        }

        // Save state only makes sense once the VM has reached a stable milestone.
        if (btnSave) {
            btnSave.disabled = !hasEmulator || state === "not_booted" || state === "booting" || state === "error";
        }

        // Restore requires a running emulator instance to feed state into.
        if (btnRestore) {
            btnRestore.disabled = !hasEmulator || state === "booting";
        }
    }

    /**
     * appendLogEntry(entry)
     * Adds a single timestamped line to the Boot Log panel and auto-scrolls.
     */
    function appendLogEntry(entry) {
        var container = document.getElementById("boot-log");
        if (!container) return;

        var div = document.createElement("div");
        div.className = "log-entry";

        // Format HH:MM:SS from ISO timestamp
        var time = "?";
        if (entry.time) {
            var parts = entry.time.split("T");
            if (parts.length === 2) {
                time = parts[1].split(".")[0];
            }
        }

        div.textContent = "[" + time + "] " + entry.text;
        container.appendChild(div);
        container.scrollTop = container.scrollHeight;
    }

    /**
     * onWindowResize()
     * v86 manages its own canvas size, but we force a layout reflow on the
     * screen container to ensure CSS flex adjustments propagate immediately.
     */
    function onWindowResize() {
        var container = document.getElementById("screen_container");
        if (!container) return;

        // Temporarily hide and read offsetHeight to force the browser to
        // recalculate layout, then restore visibility.
        var originalDisplay = container.style.display;
        container.style.display = "none";
        container.offsetHeight; // eslint-disable-line no-unused-expressions
        container.style.display = originalDisplay || "block";
    }

    // ------------------------------------------------------------------
    // Kick off once the DOM is fully parsed
    // ------------------------------------------------------------------
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();

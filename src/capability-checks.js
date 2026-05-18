/**
 * capability-checks.js
 * Validates that the browser has the required APIs and features
 * to run the v86 emulator and Alpine filesystem.
 */

(function() {
    "use strict";

    /**
     * Run all capability checks and return a structured report.
     *
     * @returns {Object} Report with:
     *   - passed {boolean}: true only if all *required* checks pass.
     *   - messages {Array}: human-readable strings for each check result.
     */
    function runChecks() {
        var passed = true;
        var messages = [];

        // 1. WebAssembly (required)
        if (typeof WebAssembly === "object" &&
            typeof WebAssembly.instantiate === "function") {
            messages.push("PASS: WebAssembly is supported.");
        } else {
            passed = false;
            messages.push("FAIL: WebAssembly is not supported. A modern browser is required.");
        }

        // 2. fetch (required — used to load BIOS, kernel, and filesystem metadata)
        if (typeof fetch === "function") {
            messages.push("PASS: fetch API is available.");
        } else {
            passed = false;
            messages.push("FAIL: fetch API is missing. Required to load VM assets.");
        }

        // 3. URL constructor (required — v86 uses it internally)
        try {
            var testUrl = new URL("http://example.com");
            if (testUrl.hostname === "example.com") {
                messages.push("PASS: URL API is available.");
            } else {
                throw new Error("URL parsing mismatch");
            }
        } catch (e) {
            passed = false;
            messages.push("FAIL: URL API is missing or broken.");
        }

        // 4. TextDecoder (required — v86 decodes serial/BIOS strings)
        if (typeof TextDecoder === "function") {
            messages.push("PASS: TextDecoder is available.");
        } else {
            passed = false;
            messages.push("FAIL: TextDecoder is missing.");
        }

        // 5. SharedArrayBuffer (optional — enables faster worker-based emulation)
        if (typeof SharedArrayBuffer === "function") {
            messages.push("PASS: SharedArrayBuffer is available (optimal performance).");
        } else {
            messages.push("WARN: SharedArrayBuffer is not available. Performance may be reduced. Ensure cross-origin isolation headers are set if you need maximum speed.");
        }

        // 6. localStorage (optional — state persistence)
        try {
            var testKey = "_v86_cap_test";
            localStorage.setItem(testKey, "1");
            localStorage.removeItem(testKey);
            messages.push("PASS: localStorage is writable.");
        } catch (e) {
            messages.push("WARN: localStorage is not available. State will not persist across refreshes.");
        }

        // 7. IndexedDB (optional — large VM state snapshots)
        if (typeof indexedDB === "object") {
            messages.push("PASS: IndexedDB is available for VM state snapshots.");
        } else {
            messages.push("WARN: IndexedDB is not available. Save State and Restore State will not work.");
        }

        // 8. Canvas 2D context (required for v86 screen output)
        var canvas = document.createElement("canvas");
        if (canvas.getContext && canvas.getContext("2d")) {
            messages.push("PASS: Canvas 2D context is supported.");
        } else {
            passed = false;
            messages.push("FAIL: Canvas 2D context is missing. The VM display will not work.");
        }

        return {
            passed: passed,
            messages: messages
        };
    }

    /**
     * Render capability warnings into a target DOM element.
     *
     * @param {HTMLElement} container - The element to inject warnings into.
     * @param {Object} report - The report object from runChecks().
     */
    function renderWarnings(container, report) {
        if (!container) return;
        container.innerHTML = "";

        if (report.passed && report.messages.length === 0) {
            return;
        }

        var hasFail = false;
        for (var i = 0; i < report.messages.length; i++) {
            if (report.messages[i].indexOf("FAIL:") === 0) {
                hasFail = true;
                break;
            }
        }

        // Only show banner if there are failures or warnings
        if (!hasFail && report.passed) {
            // All required passed, only optional warnings — still show a compact note
            var compact = document.createElement("div");
            compact.className = "capability-warning";
            compact.style.background = "#1e3a8a";
            compact.style.color = "#93c5fd";
            compact.textContent = "Capability check passed with optional notes. See console for details.";
            container.appendChild(compact);
            return;
        }

        var banner = document.createElement("div");
        banner.className = "capability-warning";

        var title = document.createElement("strong");
        title.textContent = hasFail ? "Capability Check Failed" : "Capability Warnings";
        banner.appendChild(title);

        var ul = document.createElement("ul");
        ul.style.margin = "6px 0 0 0";
        ul.style.paddingLeft = "20px";

        for (var j = 0; j < report.messages.length; j++) {
            var msg = report.messages[j];
            if (msg.indexOf("FAIL:") !== 0 && msg.indexOf("WARN:") !== 0) {
                continue; // skip PASS lines in the banner
            }
            var li = document.createElement("li");
            li.textContent = msg;
            ul.appendChild(li);
        }

        banner.appendChild(ul);
        container.appendChild(banner);
    }

    // Expose global API
    window.CapabilityChecks = {
        runChecks: runChecks,
        renderWarnings: renderWarnings
    };
})();

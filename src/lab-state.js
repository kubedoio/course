/**
 * lab-state.js
 * Manages the global state of the Browser Linux + Docker Lab.
 * Persists state to localStorage so the user sees the last known
 * state after a page refresh.
 */

(function() {
    "use strict";

    // Valid state machine values
    var VALID_STATES = [
        "not_booted",
        "booting",
        "alpine_ready",
        "docker_ready",
        "network_online",
        "error"
    ];

    // Keys used in localStorage
    var STORAGE_KEY_STATE = "v86_lab_state";
    var STORAGE_KEY_LOGS = "v86_lab_logs";

    // In-memory current state (defaults to not_booted)
    var currentState = "not_booted";

    // In-memory log buffer
    var logs = [];

    // Maximum number of log lines to keep in memory / storage
    var MAX_LOGS = 200;

    var storageAvailable = true;

    function storageGet(key) {
        if (!storageAvailable) return null;
        try {
            return window.localStorage.getItem(key);
        } catch (e) {
            storageAvailable = false;
            return null;
        }
    }

    function storageSet(key, value) {
        if (!storageAvailable) return;
        try {
            window.localStorage.setItem(key, value);
        } catch (e) {
            storageAvailable = false;
        }
    }

    function storageRemove(key) {
        if (!storageAvailable) return;
        try {
            window.localStorage.removeItem(key);
        } catch (e) {
            storageAvailable = false;
        }
    }

    /**
     * Initialize state from localStorage on script load.
     */
    function init() {
        var savedState = storageGet(STORAGE_KEY_STATE);
        if (savedState && VALID_STATES.indexOf(savedState) !== -1) {
            currentState = savedState;
        }

        var savedLogs = storageGet(STORAGE_KEY_LOGS);
        if (savedLogs) {
            try {
                var parsed = JSON.parse(savedLogs);
                if (Array.isArray(parsed)) {
                    logs = parsed;
                }
            } catch (e) {
                // Ignore corrupt log storage
            }
        }
    }

    /**
     * Get the current lab state.
     * @returns {string} One of the VALID_STATES values.
     */
    function getState() {
        return currentState;
    }

    /**
     * Set a new lab state and persist it.
     * @param {string} newState - Must be one of the VALID_STATES values.
     */
    function setState(newState) {
        if (VALID_STATES.indexOf(newState) === -1) {
            console.warn("[lab-state] Ignoring invalid state:", newState);
            return;
        }
        currentState = newState;
        storageSet(STORAGE_KEY_STATE, newState);

        // Notify any registered listeners
        notifyListeners(newState);
    }

    // Simple observer pattern for UI updates
    var listeners = [];

    /**
     * Register a callback to be called whenever the state changes.
     * @param {Function} callback - Receives the new state string.
     */
    function onStateChange(callback) {
        if (typeof callback === "function") {
            listeners.push(callback);
        }
    }

    /**
     * Notify all registered listeners.
     */
    function notifyListeners(newState) {
        for (var i = 0; i < listeners.length; i++) {
            try {
                listeners[i](newState);
            } catch (e) {
                console.error("[lab-state] State listener error:", e);
            }
        }
    }

    /**
     * Add a timestamped log message.
     * @param {string} message - The log text to record.
     */
    function addLog(message) {
        if (!message) return;

        var entry = {
            time: new Date().toISOString(),
            text: String(message)
        };

        logs.push(entry);

        // Trim to max size
        if (logs.length > MAX_LOGS) {
            logs = logs.slice(logs.length - MAX_LOGS);
        }

        // Persist and notify
        storageSet(STORAGE_KEY_LOGS, JSON.stringify(logs));
        notifyLogListeners(entry);
    }

    // Log listeners
    var logListeners = [];

    /**
     * Register a callback for new log entries.
     * @param {Function} callback - Receives the log entry object {time, text}.
     */
    function onLog(callback) {
        if (typeof callback === "function") {
            logListeners.push(callback);
        }
    }

    function notifyLogListeners(entry) {
        for (var i = 0; i < logListeners.length; i++) {
            try {
                logListeners[i](entry);
            } catch (e) {
                console.error("[lab-state] Log listener error:", e);
            }
        }
    }

    /**
     * Retrieve all stored log entries.
     * @returns {Array} Array of {time, text} objects.
     */
    function getLogs() {
        return logs.slice();
    }

    /**
     * Clear persisted state and logs (useful for hard reset).
     */
    function clear() {
        currentState = "not_booted";
        logs = [];
        storageRemove(STORAGE_KEY_STATE);
        storageRemove(STORAGE_KEY_LOGS);
        notifyListeners(currentState);
    }

    // Run init immediately
    init();

    // Expose global API
    window.LabState = {
        getState: getState,
        setState: setState,
        onStateChange: onStateChange,
        addLog: addLog,
        onLog: onLog,
        getLogs: getLogs,
        clear: clear,
        VALID_STATES: VALID_STATES
    };
})();

/**
 * Shared Debug Logging Utility
 * Provides consistent debug logging across the application.
 * Only logs when window.__TP_DEBUG__ === true.
 */

/**
 * Creates a debug log function with a custom prefix.
 * @param {string} prefix - Prefix to prepend to all log messages (e.g., '📚 ')
 * @returns {Function} Debug log function
 */
export function createDebugLog(prefix = '') {
  return (emoji, message, ...args) => {
    if (typeof window !== 'undefined' && window.__TP_DEBUG__ === true) {
      console.log(`${prefix}${emoji} ${message}`, ...args);
    }
  };
}


/**
 * Simple debug log function - passes through all arguments.
 * Use this for general-purpose debug logging.
 * Only logs when window.__TP_DEBUG__ === true.
 * @param {...any} args - Arguments to log
 */
export function debug(...args) {
    if (typeof window !== 'undefined' && window.__TP_DEBUG__ === true) {
        console.log(...args);
    }
}

/**
 * Default debug log instance (no prefix).
 * Use this for general-purpose debugging.
 */
export const debugLog = createDebugLog();
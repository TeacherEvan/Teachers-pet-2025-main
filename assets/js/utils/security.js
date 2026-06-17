/**
 * Security Utilities
 * XSS prevention and input sanitization
 * @module Security
 * @version 1.0.0
 */

const escapeHtmlMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;'
};

/**
 * Escape HTML special characters to prevent XSS
 * @param {string} text - Text to escape
 * @returns {string} Escaped text safe for HTML insertion
 */
export function escapeHtml(text) {
    if (!text) return '';
    return String(text).replace(/[&<>"'/]/g, char => escapeHtmlMap[char]);
}

/**
 * Sanitize a string for safe use as HTML attribute value
 * @param {string} text - Text to sanitize
 * @returns {string} Sanitized text
 */
export function escapeAttribute(text) {
    if (!text) return '';
    return String(text).replace(/["']/g, char => escapeHtmlMap[char]);
}

/**
 * Validate that a string contains only safe characters for a given context
 * @param {string} text - Text to validate
 * @param {'html'|'attribute'|'url'} context - Usage context
 * @returns {boolean} True if safe
 */
export function isSafe(text, context = 'html') {
    if (!text) return true;
    const str = String(text);
    
    switch (context) {
        case 'html':
            return !/[<>&"']/.test(str) || str === escapeHtml(str);
        case 'attribute':
            return !/["'`<>=]/.test(str);
        case 'url':
            try {
                new URL(str);
                return true;
            } catch {
                return false;
            }
        default:
            return true;
    }
}
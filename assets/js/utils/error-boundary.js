/**
 * Error Boundary & Error Handling Utilities
 * Provides comprehensive error handling, logging, and user-friendly error messages
 * @module ErrorBoundary
 */

/* eslint-env browser */
/* global window, document */

class ErrorBoundary {
    constructor() {
        this.errors = [];
        this.maxErrors = 50; // Limit error storage
        this.isProduction = !window.location.hostname.includes('localhost');
        this.init();
    }

    /**
     * Initialize global error handlers
     */
    init() {
        // Catch unhandled errors
        window.addEventListener('error', (event) => {
            this.handleError(event.error || event.message, {
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                type: 'runtime'
            });
        });

        // Catch unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            this.handleError(event.reason, {
                type: 'promise',
                promise: event.promise
            });
        });

        console.log('🛡️ Error Boundary initialized');
    }

    /**
     * Handle and log errors with context
     * @param {Error|string} error - The error object or message
     * @param {Object} context - Additional context about the error
     */
    handleError(error, context = {}) {
        const errorInfo = {
            message: error.message || error,
            stack: error.stack || '',
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href,
            ...context
        };

        // Store error for debugging
        this.errors.push(errorInfo);
        if (this.errors.length > this.maxErrors) {
            this.errors.shift(); // Remove oldest error
        }

        // Log to console in development
        if (!this.isProduction) {
            console.error('❌ Error caught by ErrorBoundary:', errorInfo);
        }

        // Show user-friendly error message
        this.displayUserFriendlyError(errorInfo);

        // TODO: [OPTIMIZATION] Send errors to monitoring service (e.g., Sentry, LogRocket)
        // this.sendToMonitoringService(errorInfo);
    }

    /**
     * Display user-friendly error notification
     * @param {Object} errorInfo - Error information
     */
    displayUserFriendlyError(errorInfo) {
        // Don't show errors for network issues in production
        if (this.isProduction && errorInfo.message.includes('net::ERR')) {
            return;
        }

        const errorContainer = this.createErrorNotification(errorInfo);
        document.body.appendChild(errorContainer);

        // Auto-dismiss after 10 seconds
        setTimeout(() => {
            this.dismissErrorNotification(errorContainer);
        }, 10000);
    }

    /**
     * Create error notification element
     * @param {Object} errorInfo - Error information
     * @returns {HTMLElement} Error notification element
     */
    createErrorNotification(errorInfo) {
        const container = document.createElement('div');
        container.className = 'error-notification';
        container.setAttribute('role', 'alert');
        container.setAttribute('aria-live', 'assertive');
        
        const isNetworkError = errorInfo.message.includes('Failed to fetch') || 
                               errorInfo.message.includes('Network');
        
        const errorTitle = isNetworkError ? 'Connection Issue' : 'Something went wrong';
        const errorMessage = isNetworkError 
            ? 'Please check your internet connection and try again.'
            : 'We encountered an unexpected error. Please refresh the page or try again.';

        container.innerHTML = `
            <div class="error-content">
                <div class="error-icon">⚠️</div>
                <div class="error-text">
                    <h4>${errorTitle}</h4>
                    <p>${errorMessage}</p>
                    ${!this.isProduction ? `<small class="error-debug">${errorInfo.message}</small>` : ''}
                </div>
                <button class="error-dismiss" onclick="this.parentElement.parentElement.remove()">
                    ✕
                </button>
            </div>
        `;

        // Add styles
        this.injectErrorStyles();

        return container;
    }

    /**
     * Dismiss error notification with animation
     * @param {HTMLElement} element - Error notification element
     */
    dismissErrorNotification(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(-20px)';
        
        setTimeout(() => {
            element.remove();
        }, 300);
    }

    /**
     * Inject error notification styles
     */
    injectErrorStyles() {
        if (!document.querySelector('#error-boundary-styles')) {
            const style = document.createElement('style');
            style.id = 'error-boundary-styles';
            style.textContent = `
                .error-notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    max-width: 400px;
                    background: rgba(231, 76, 60, 0.95);
                    backdrop-filter: blur(10px);
                    border-radius: 12px;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
                    z-index: 10000;
                    animation: slide-in 0.3s ease-out;
                    transition: opacity 0.3s ease, transform 0.3s ease;
                }

                @keyframes slide-in {
                    from {
                        opacity: 0;
                        transform: translateY(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .error-content {
                    display: flex;
                    align-items: flex-start;
                    padding: 16px;
                    gap: 12px;
                }

                .error-icon {
                    font-size: 24px;
                    flex-shrink: 0;
                }

                .error-text {
                    flex: 1;
                    color: white;
                }

                .error-text h4 {
                    margin: 0 0 4px 0;
                    font-size: 16px;
                    font-weight: 600;
                }

                .error-text p {
                    margin: 0;
                    font-size: 14px;
                    line-height: 1.4;
                }

                .error-debug {
                    display: block;
                    margin-top: 8px;
                    font-size: 12px;
                    opacity: 0.8;
                    font-family: monospace;
                }

                .error-dismiss {
                    background: transparent;
                    border: none;
                    color: white;
                    font-size: 20px;
                    cursor: pointer;
                    padding: 0;
                    width: 24px;
                    height: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 4px;
                    transition: background 0.2s ease;
                }

                .error-dismiss:hover {
                    background: rgba(255, 255, 255, 0.2);
                }

                @media (max-width: 768px) {
                    .error-notification {
                        left: 20px;
                        right: 20px;
                        max-width: none;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    /**
     * Wrap async function with error boundary
     * @param {Function} asyncFunction - Async function to wrap
     * @param {string} functionName - Name for error context
     * @returns {Function} Wrapped function
     */
    wrapAsyncFunction(asyncFunction, functionName = 'anonymous') {
        return async (...args) => {
            try {
                return await asyncFunction(...args);
            } catch (error) {
                this.handleError(error, {
                    type: 'async',
                    function: functionName
                });
                throw error; // Re-throw for caller to handle if needed
            }
        };
    }

    /**
     * Try/catch wrapper for synchronous operations
     * @param {Function} operation - Function to execute
     * @param {Function} fallback - Fallback function on error
     * @param {string} operationName - Name for error context
     * @returns {*} Result of operation or fallback
     */
    try(operation, fallback = () => null, operationName = 'operation') {
        try {
            return operation();
        } catch (error) {
            this.handleError(error, {
                type: 'sync',
                operation: operationName
            });
            return fallback();
        }
    }

    /**
     * Get all logged errors
     * @returns {Array} Array of error objects
     */
    getErrors() {
        return [...this.errors];
    }

    /**
     * Clear all logged errors
     */
    clearErrors() {
        this.errors = [];
        console.log('🗑️ Error log cleared');
    }

    /**
     * Export errors for debugging
     * @returns {string} JSON string of errors
     */
    exportErrors() {
        return JSON.stringify(this.errors, null, 2);
    }
}

// Initialize global error boundary
if (typeof window !== 'undefined') {
    window.errorBoundary = new ErrorBoundary();
    
    // Add helper method to window for easy access
    window.safeExecute = (fn, fallback) => {
        return window.errorBoundary.try(fn, fallback);
    };
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ErrorBoundary;
}

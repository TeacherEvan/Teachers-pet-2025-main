/**
 * LocalStorage Monitor - Debugging and monitoring localStorage operations
 * Provides comprehensive monitoring, validation, and debugging for localStorage
 */

class LocalStorageMonitor {
    constructor() {
        this.isEnabled = true;
        this.logLevel = 'info'; // 'debug', 'info', 'warn', 'error'
        this.validationRules = {
            studentData: {
                required: ['studentName', 'gender'],
                optional: ['strengths', 'weaknesses', 'overallAttributes'],
                types: {
                    studentName: 'string',
                    gender: 'string',
                    strengths: 'string',
                    weaknesses: 'string',
                    overallAttributes: 'string'
                }
            },
            selectedSubjects: {
                type: 'array'
            },
            selectedSubjectTitles: {
                type: 'array'
            }
        };
        
        this.init();
    }
    
    init() {
        if (!this.isEnabled) return;
        
        this.wrapLocalStorageMethods();
        this.startPeriodicCheck();
        this.logInfo('LocalStorage Monitor initialized');
        
        // Initial data validation
        this.validateAllData();
    }
    
    wrapLocalStorageMethods() {
        const originalSetItem = localStorage.setItem;
        const originalGetItem = localStorage.getItem;
        const originalRemoveItem = localStorage.removeItem;
        const originalClear = localStorage.clear;
        
        const monitor = this;
        
        // Wrap setItem
        localStorage.setItem = function(key, value) {
            monitor.logDebug(`Setting localStorage item: ${key}`, value);
            
            try {
                originalSetItem.call(this, key, value);
                monitor.validateStoredData(key, value);
                monitor.logInfo(`✅ Successfully stored: ${key}`);
            } catch (error) {
                monitor.logError(`❌ Failed to store ${key}:`, error);
                throw error;
            }
        };
        
        // Wrap getItem
        localStorage.getItem = function(key) {
            const value = originalGetItem.call(this, key);
            monitor.logDebug(`Getting localStorage item: ${key}`, value);
            
            if (value !== null) {
                monitor.validateRetrievedData(key, value);
            }
            
            return value;
        };
        
        // Wrap removeItem
        localStorage.removeItem = function(key) {
            monitor.logInfo(`Removing localStorage item: ${key}`);
            originalRemoveItem.call(this, key);
        };
        
        // Wrap clear
        localStorage.clear = function() {
            monitor.logWarn('Clearing all localStorage data');
            originalClear.call(this);
        };
    }
    
    validateStoredData(key, value) {
        if (!this.validationRules[key]) {
            this.logDebug(`No validation rules for key: ${key}`);
            return true;
        }
        
        try {
            const parsedValue = JSON.parse(value);
            return this.validateDataStructure(key, parsedValue);
        } catch (error) {
            this.logWarn(`Invalid JSON for key ${key}:`, error);
            return false;
        }
    }
    
    validateRetrievedData(key, value) {
        if (!value) return true;
        
        try {
            const parsedValue = JSON.parse(value);
            return this.validateDataStructure(key, parsedValue);
        } catch (error) {
            this.logWarn(`Retrieved invalid JSON for key ${key}:`, error);
            return false;
        }
    }
    
    validateDataStructure(key, data) {
        const rules = this.validationRules[key];
        if (!rules) return true;
        
        // Check if it's an array type
        if (rules.type === 'array') {
            if (!Array.isArray(data)) {
                this.logWarn(`Expected array for ${key}, got:`, typeof data);
                return false;
            }
            return true;
        }
        
        // Check required fields
        if (rules.required) {
            for (const field of rules.required) {
                if (!data.hasOwnProperty(field) || data[field] === null || data[field] === undefined) {
                    this.logWarn(`Missing required field '${field}' in ${key}`);
                    return false;
                }
                
                // Check empty strings for critical fields
                if (typeof data[field] === 'string' && data[field].trim() === '') {
                    this.logWarn(`Empty required field '${field}' in ${key}`);
                    return false;
                }
            }
        }
        
        // Check field types
        if (rules.types) {
            for (const [field, expectedType] of Object.entries(rules.types)) {
                if (data.hasOwnProperty(field) && data[field] !== null) {
                    const actualType = typeof data[field];
                    if (actualType !== expectedType) {
                        this.logWarn(`Type mismatch for ${key}.${field}: expected ${expectedType}, got ${actualType}`);
                    }
                }
            }
        }
        
        return true;
    }
    
    validateAllData() {
        this.logInfo('🔍 Validating all localStorage data...');
        
        for (const key of Object.keys(this.validationRules)) {
            const value = localStorage.getItem(key);
            if (value) {
                this.validateRetrievedData(key, value);
            }
        }
    }
    
    startPeriodicCheck() {
        // Check data integrity every 30 seconds
        setInterval(() => {
            this.checkDataIntegrity();
        }, 30000);
    }
    
    checkDataIntegrity() {
        const studentData = localStorage.getItem('studentData');
        
        if (studentData) {
            try {
                const parsed = JSON.parse(studentData);
                
                // Check for data corruption
                if (parsed.studentName && parsed.studentName !== parsed.studentName.trim()) {
                    this.logWarn('Detected whitespace in student name, cleaning...');
                    parsed.studentName = parsed.studentName.trim();
                    localStorage.setItem('studentData', JSON.stringify(parsed));
                }
                
                // Check for missing critical data
                if (!parsed.studentName || !parsed.gender) {
                    this.logError('Critical student data missing!', parsed);
                }
                
            } catch (error) {
                this.logError('Corrupted student data detected:', error);
            }
        }
    }
    
    getStorageReport() {
        const report = {
            timestamp: new Date().toISOString(),
            totalKeys: localStorage.length,
            data: {},
            issues: []
        };
        
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            const value = localStorage.getItem(key);
            
            try {
                const parsed = JSON.parse(value);
                report.data[key] = {
                    type: Array.isArray(parsed) ? 'array' : typeof parsed,
                    size: value.length,
                    valid: this.validateDataStructure(key, parsed)
                };
            } catch (error) {
                report.data[key] = {
                    type: 'invalid_json',
                    size: value.length,
                    valid: false,
                    error: error.message
                };
                report.issues.push(`Invalid JSON in ${key}: ${error.message}`);
            }
        }
        
        return report;
    }
    
    debugDataFlow() {
        this.logInfo('🔍 Current localStorage state:');
        
        const studentData = localStorage.getItem('studentData');
        if (studentData) {
            try {
                const parsed = JSON.parse(studentData);
                this.logInfo('Student Data:', parsed);
                
                // Specific checks for common issues
                if (parsed.studentName) {
                    this.logInfo(`Student name: "${parsed.studentName}" (length: ${parsed.studentName.length})`);
                }
                if (parsed.gender) {
                    this.logInfo(`Gender: "${parsed.gender}"`);
                }
            } catch (error) {
                this.logError('Failed to parse student data:', error);
            }
        } else {
            this.logWarn('No student data found in localStorage');
        }
        
        const subjects = localStorage.getItem('selectedSubjects');
        if (subjects) {
            try {
                const parsed = JSON.parse(subjects);
                this.logInfo('Selected subjects:', parsed);
            } catch (error) {
                this.logError('Failed to parse subjects data:', error);
            }
        }
    }
    
    clearCorruptedData() {
        this.logWarn('Clearing potentially corrupted data...');
        
        const keysToCheck = Object.keys(this.validationRules);
        
        for (const key of keysToCheck) {
            const value = localStorage.getItem(key);
            if (value) {
                try {
                    const parsed = JSON.parse(value);
                    if (!this.validateDataStructure(key, parsed)) {
                        this.logWarn(`Removing invalid data for key: ${key}`);
                        localStorage.removeItem(key);
                    }
                } catch (error) {
                    this.logWarn(`Removing corrupted data for key: ${key}`);
                    localStorage.removeItem(key);
                }
            }
        }
    }
    
    // Logging methods
    logDebug(message, data = null) {
        if (this.logLevel === 'debug') {
            console.log(`[LSMonitor DEBUG] ${message}`, data || '');
        }
    }
    
    logInfo(message, data = null) {
        if (['debug', 'info'].includes(this.logLevel)) {
            console.log(`[LSMonitor INFO] ${message}`, data || '');
        }
    }
    
    logWarn(message, data = null) {
        if (['debug', 'info', 'warn'].includes(this.logLevel)) {
            console.warn(`[LSMonitor WARN] ${message}`, data || '');
        }
    }
    
    logError(message, data = null) {
        console.error(`[LSMonitor ERROR] ${message}`, data || '');
    }
}

// Global functions for debugging
window.debugLocalStorage = function() {
    if (window.lsMonitor) {
        window.lsMonitor.debugDataFlow();
        return window.lsMonitor.getStorageReport();
    } else {
        console.warn('LocalStorage monitor not initialized');
    }
};

window.clearCorruptedData = function() {
    if (window.lsMonitor) {
        window.lsMonitor.clearCorruptedData();
    } else {
        console.warn('LocalStorage monitor not initialized');
    }
};

window.getStorageReport = function() {
    if (window.lsMonitor) {
        const report = window.lsMonitor.getStorageReport();
        console.table(report.data);
        return report;
    } else {
        console.warn('LocalStorage monitor not initialized');
    }
};

// Initialize monitor when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.lsMonitor = new LocalStorageMonitor();
    
    // Add debugging buttons in development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        const debugPanel = document.createElement('div');
        debugPanel.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 10px;
            border-radius: 5px;
            font-size: 12px;
            z-index: 10000;
            display: none;
        `;
        debugPanel.innerHTML = `
            <div>LocalStorage Debug Panel</div>
            <button onclick="debugLocalStorage()" style="margin: 2px; padding: 2px 5px;">Debug</button>
            <button onclick="getStorageReport()" style="margin: 2px; padding: 2px 5px;">Report</button>
            <button onclick="clearCorruptedData()" style="margin: 2px; padding: 2px 5px;">Clean</button>
        `;
        document.body.appendChild(debugPanel);
        
        // Show debug panel with Ctrl+Shift+D
        document.addEventListener('keydown', function(e) {
            if (e.ctrlKey && e.shiftKey && e.key === 'D') {
                debugPanel.style.display = debugPanel.style.display === 'none' ? 'block' : 'none';
            }
        });
    }
});

console.log('LocalStorage Monitor loaded successfully');
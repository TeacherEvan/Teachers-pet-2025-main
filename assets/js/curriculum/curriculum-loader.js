/**
 * Curriculum Loader Utility
 * Teachers Pet - Dynamic Curriculum Loading System
 * 
 * Loads curriculum data based on selected grade and month.
 * Handles missing curriculum files with graceful fallbacks.
 * @class CurriculumLoader
 */

/* eslint-disable no-unused-vars */
class CurriculumLoader {
    constructor() {
        this.loadedCurriculum = null;
        this.currentGrade = '';
        this.currentMonth = '';
    }

    /**
     * Load curriculum for a specific grade and month
     * @param {string} grade - Grade level (K1, K2, K3)
     * @param {string} month - Month name (August, September, etc.)
     * @returns {Promise} Resolves with curriculum data or rejects with error
     */
    async load(grade, month) {
        return new Promise((resolve, reject) => {
            if (!grade || !month) {
                reject(new Error('Grade and month are required'));
                return;
            }

            this.currentGrade = grade;
            this.currentMonth = month;

            // Construct curriculum file path
            const gradeFolder = grade.toLowerCase();
            const monthFile = month.toLowerCase();
            const curriculumPath = `assets/js/curriculum/${gradeFolder}/${monthFile}.js`;

            console.log(`📚 Loading curriculum: ${grade} - ${month}`);
            console.log(`📂 Path: ${curriculumPath}`);

            // Create script element to load curriculum
            const script = document.createElement('script');
            script.src = curriculumPath;
            script.async = true;

            script.onload = () => {
                // Check if curriculum data was loaded
                if (window.CurriculumData &&
                    window.CurriculumData[grade] &&
                    window.CurriculumData[grade][month]) {

                    this.loadedCurriculum = window.CurriculumData[grade][month];
                    console.log(`✅ Curriculum loaded: ${this.loadedCurriculum.subjects.length} subjects`);
                    resolve(this.loadedCurriculum);
                } else {
                    const error = new Error(`Curriculum data structure not found for ${grade} ${month}`);
                    console.error('❌', error.message);
                    reject(error);
                }
            };

            script.onerror = (error) => {
                const errorMsg = `Failed to load curriculum file: ${curriculumPath}`;
                console.error('❌', errorMsg);
                reject(new Error(errorMsg));
            };

            // Add script to document
            document.head.appendChild(script);
        });
    }

    /**
     * Get the currently loaded curriculum
     * @returns {Object|null} Current curriculum data or null if not loaded
     */
    getCurrent() {
        return this.loadedCurriculum;
    }

    /**
     * Check if a curriculum is available (file exists)
     * Note: This is a basic check - actual availability should be managed in availableMonths config
     * @param {string} grade - Grade level
     * @param {string} month - Month name
     * @returns {boolean} True if curriculum is available
     */
    isAvailable(grade, month) {
        const availableList = {
            'K1': ['August', 'November', 'December'],
            'K2': ['November'],
            'K3': []
        };

        return availableList[grade]?.includes(month) || false;
    }

    /**
     * Get list of available months for a grade
     * @param {string} grade - Grade level
     * @returns {Array} Array of available month names
     */
    getAvailableMonths(grade) {
        const availableList = {
            'K1': ['August', 'November', 'December'],
            'K2': ['November'],
            'K3': []
        };

        return availableList[grade] || [];
    }

    /**
     * Clear loaded curriculum data
     */
    clear() {
        this.loadedCurriculum = null;
        this.currentGrade = '';
        this.currentMonth = '';
        console.log('🧹 Curriculum data cleared');
    }
}

// Create global instance
window.curriculumLoader = new CurriculumLoader();

console.log('✅ Curriculum Loader initialized');

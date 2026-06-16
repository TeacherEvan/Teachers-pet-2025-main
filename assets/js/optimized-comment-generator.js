/**
 * Optimized Comment Generator - Compatibility bridge to PremiumCommentEngine
 * Provides backward compatibility and enhanced integration with existing systems
 */

import { EnhancedCommentEngine } from './engine/core.js';
import { TeachersPetUtils } from './engine/utils.js';

/**
 * Debug logging helper - only logs when window.__TP_DEBUG__ === true
 */
function debugLog(...args) {
    if (typeof window !== 'undefined' && window.__TP_DEBUG__ === true) {
        console.log(...args);
    }
}

// Re-export for backward compatibility
export { TeachersPetUtils };

export class OptimizedCommentGenerator {
    constructor() {
        this.engine = null;
        this.isInitialized = false;
        this.fallbackMode = false;

        this.init();
    }

    init() {
        try {
            // Check if EnhancedCommentEngine is available (preferred)
            if (EnhancedCommentEngine) {
                this.engine = new EnhancedCommentEngine();
                this.isInitialized = true;
                debugLog('OptimizedCommentGenerator initialized with EnhancedCommentEngine');
            } else {
                debugLog('⚠️', 'No comment engines available, using fallback mode');
                this.fallbackMode = true;
                this.initializeFallback();
            }
        } catch (error) {
            debugLog('❌', 'Failed to initialize OptimizedCommentGenerator:', error);
            this.fallbackMode = true;
            this.initializeFallback();
        }
    }

    initializeFallback() {
        this.isInitialized = true;
        debugLog('OptimizedCommentGenerator initialized in fallback mode');
    }

    /**
     * Generate comments from localStorage data
     * Now returns a Promise to support async engines
     */
    async generateFromStorage() {
        try {
            const sessionData = this.collectSessionData();
            return await this.generateComments(sessionData);
        } catch (error) {
            debugLog('❌', 'Failed to generate comments from storage:', error);
            return this.generateErrorComments(error.message);
        }
    }

    /**
     * Generate comments from provided session data
     * Now returns a Promise to support async engines
     */
    async generateComments(sessionData) {
        if (!this.isInitialized) {
            throw new Error('OptimizedCommentGenerator not initialized');
        }

        let validatedData;

        try {
            validatedData = this.validateAndCleanSessionData(sessionData);
        } catch (error) {
            debugLog('❌', 'Session data validation failed, using fallback:', error);
            return this.generateFallbackComments(this.buildFallbackSessionData(sessionData));
        }

        if (this.fallbackMode) {
            return this.generateFallbackComments(validatedData);
        }

        try {
            // Both engines now return Promises
            return await this.engine.generateComments(validatedData);
        } catch (error) {
            debugLog('❌', 'Engine failed, using fallback:', error);
            return this.generateFallbackComments(validatedData);
        }
    }

    /**
     * Collect session data from localStorage and form elements
     */
    collectSessionData() {
        // Get student data from localStorage
        const studentDataStr = localStorage.getItem('studentData');
        debugLog('Raw localStorage studentData:', studentDataStr);

        const studentData = studentDataStr ? JSON.parse(studentDataStr) : {};
        debugLog('Parsed studentData:', studentData);
        debugLog('studentData.studentName:', studentData.studentName);
        debugLog('studentData.gender:', studentData.gender);

        // Get selected subjects
        const selectedSubjects = this.getSelectedSubjects();
        const topicRatings = this.getTopicRatings();

        // Combine all data
        debugLog('Raw overallAttributes from localStorage:', studentData.overallAttributes, 'Type:', typeof studentData.overallAttributes);
        const parsedRating = parseInt(studentData.overallAttributes);
        debugLog('After parseInt:', parsedRating, 'Type:', typeof parsedRating, 'isNaN:', isNaN(parsedRating));
        // Use parsed rating if it's a valid number, otherwise default to 5
        const finalRating = (isNaN(parsedRating) || parsedRating < 1 || parsedRating > 10) ? 5 : parsedRating;
        debugLog('Final rating (validated, defaults to 5 if invalid):', finalRating);
        
        const sessionData = {
            studentName: studentData.studentName || '',
            gender: studentData.gender || 'they',
            overallRating: finalRating,
            strengths: studentData.strengths || '',
            weaknesses: studentData.weaknesses || '',
            subjects: selectedSubjects,
            topicRatings: topicRatings
        };

        debugLog('Collected session data:', sessionData);
        debugLog('Final studentName value:', sessionData.studentName);
        debugLog('Final overallRating value:', sessionData.overallRating);
        return sessionData;
    }

    /**
     * Get selected subjects from form
     */
    getSelectedSubjects() {
        const subjects = [];
        const subjectCheckboxes = document.querySelectorAll('.subject-checkbox:checked');

        subjectCheckboxes.forEach(checkbox => {
            if (checkbox.value) {
                subjects.push(checkbox.value);
            }
        });

        // Fallback to localStorage if no form elements found
        if (subjects.length === 0) {
            const storedSubjects = localStorage.getItem('selectedSubjects');
            if (storedSubjects) {
                try {
                    return JSON.parse(storedSubjects);
                } catch (error) {
                    console.warn('Failed to parse stored subjects:', error);
                }
            }
        }

        return subjects;
    }

    /**
     * Get topic ratings from form
     */
    getTopicRatings() {
        const ratings = {};
        const topicCheckboxes = document.querySelectorAll('.topic-checkbox:checked');

        topicCheckboxes.forEach(checkbox => {
            if (checkbox.value) {
                // Default rating of 5 for selected topics
                ratings[checkbox.value] = 5;
            }
        });

        return ratings;
    }

    /**
     * Validate session data - throws on invalid input
     */
    validateSessionData(sessionData) {
        const rawData = sessionData && typeof sessionData === 'object' ? sessionData : {};
        debugLog('validateSessionData - INPUT:', sessionData);

        // Ensure required fields
        if (!rawData.studentName || String(rawData.studentName).trim() === '') {
            throw new Error('Student name is required for comment generation');
        }

        return rawData;
    }

    /**
     * Coerce rating to valid range (1-10), defaulting to 5
     */
    coerceRating(rating) {
        const numRating = Number(rating);
        debugLog('coerceRating - input:', rating, 'parsed:', numRating);

        if (isNaN(numRating) || numRating < 1 || numRating > 10) {
            debugLog('⚠️', 'Invalid rating detected! Value:', rating, '- Defaulting to 5');
            return 5;
        }

        debugLog('Rating validation PASSED - using value:', numRating);
        return numRating;
    }

    /**
     * Validate and clean session data
     */
    validateAndCleanSessionData(sessionData) {
        const rawData = this.validateSessionData(sessionData);
        const cleaned = this.buildFallbackSessionData(rawData);
        cleaned.overallRating = this.coerceRating(cleaned.overallRating);
        return cleaned;
    }

    buildFallbackSessionData(sessionData) {
        const safeData = sessionData && typeof sessionData === 'object' ? sessionData : {};
        const validGenders = ['he', 'she', 'they'];
        const normalizedGender = typeof safeData.gender === 'string'
            ? safeData.gender.toLowerCase()
            : 'they';
        const rating = Number(safeData.overallRating);
        const normalizeTextList = (value) => {
            if (Array.isArray(value)) {
                return value
                    .map((item) => String(item).trim())
                    .filter(Boolean);
            }

            return typeof value === 'string' ? value.trim() : '';
        };

        return {
            studentName: typeof safeData.studentName === 'string' && safeData.studentName.trim() !== ''
                ? safeData.studentName.trim()
                : 'Student',
            gender: validGenders.includes(normalizedGender) ? normalizedGender : 'they',
            overallRating: Number.isFinite(rating) ? rating : 5,
            strengths: normalizeTextList(safeData.strengths),
            weaknesses: normalizeTextList(safeData.weaknesses),
            subjects: Array.isArray(safeData.subjects) ? safeData.subjects : [],
            topicRatings: safeData.topicRatings && typeof safeData.topicRatings === 'object'
                ? safeData.topicRatings
                : {},
        };
    }

    /**
     * Generate fallback comments when main engine is unavailable
     */
    generateFallbackComments(sessionData) {
        const safeData = this.buildFallbackSessionData(sessionData);
        const name = safeData.studentName;
        const pronoun = TeachersPetUtils.getPronounSet(safeData.gender);
        const performance = TeachersPetUtils.getPerformanceDescriptor(safeData.overallRating);

        const maleComment = this.generateMaleFallbackComment(name, pronoun, performance, safeData);
        const femaleComment = this.generateFemaleFallbackComment(name, pronoun, performance, safeData);

        return {
            male: maleComment,
            female: femaleComment,
            wordCount: {
                male: TeachersPetUtils.getWordCount(maleComment),
                female: TeachersPetUtils.getWordCount(femaleComment)
            }
        };
    }

    generateMaleFallbackComment(name, pronoun, performance, data) {
        let comment = `${name} has demonstrated ${performance.level} performance this term, showing consistent progress across multiple learning areas. `;

        if (data.strengths) {
            const strengths = TeachersPetUtils.processTextList(data.strengths);
            comment += `${pronoun.subject} particularly excels in ${TeachersPetUtils.naturalJoin(strengths)}, displaying strong understanding. `;
        }

        if (data.subjects && data.subjects.length > 0) {
            comment += `In ${TeachersPetUtils.naturalJoin(data.subjects)}, ${name} has shown steady progress and engagement with the curriculum. `;
        }

        comment += `${pronoun.subject} maintains positive behavior in the classroom and works well with peers. `;
        if (data.weaknesses) {
            const weaknesses = TeachersPetUtils.processTextList(data.weaknesses);
            comment += `With continued support in ${TeachersPetUtils.naturalJoin(weaknesses)}, ${name} will continue to develop these important skills. `;
        }

        comment += `${name} is well-prepared for continued academic growth and shows potential for future success.`;

        return comment;
    }

    generateFemaleFallbackComment(name, pronoun, performance, data) {
        let comment = `${name} has demonstrated ${performance.level} performance this term, bringing enthusiasm to our classroom community. `;

        if (data.strengths) {
            const strengths = TeachersPetUtils.processTextList(data.strengths);
            comment += `${pronoun.subject} particularly excels in ${TeachersPetUtils.naturalJoin(strengths)}, displaying strong abilities. `;
        }

        if (data.subjects && data.subjects.length > 0) {
            comment += `In ${TeachersPetUtils.naturalJoin(data.subjects)}, ${name} has shown consistent progress and curiosity. `;
        }

        comment += `${pronoun.subject} brings positive energy to classroom interactions and is a valued member of our learning community. `;
        if (data.weaknesses) {
            const weaknesses = TeachersPetUtils.processTextList(data.weaknesses);
            comment += `With gentle encouragement in ${TeachersPetUtils.naturalJoin(weaknesses)}, ${name} will continue to develop these important skills. `;
        }

        comment += `${name} is ready for continued learning adventures and shows potential for future success.`;

        return comment;
    }

    /**
     * Generate error comments when generation fails
     */
    generateErrorComments(errorMessage) {
        const errorComment = `Unable to generate personalized comments due to a technical issue: ${errorMessage}. Please ensure all required information is provided and try again.`;

        return {
            male: errorComment,
            female: errorComment,
            wordCount: {
                male: TeachersPetUtils.getWordCount(errorComment),
                female: TeachersPetUtils.getWordCount(errorComment)
            }
        };
    }

    /**
     * Test comment generation with sample data
     */
    async testGeneration() {
        const testData = {
            studentName: 'Test Student',
            gender: 'they',
            overallRating: 7,
            strengths: 'creative thinking, problem solving',
            weaknesses: 'fine motor skills',
            subjects: ['Mathematics', 'English'],
            topicRatings: {
                'counting to 10': 5,
                'letter recognition': 4
            }
        };

        // Always log test results (test helper)
        console.log('Testing comment generation with sample data...');
        const result = await this.generateComments(testData);
        console.log('Test result:', result);
        return result;
    }
}

// Initialize and expose globally
window.OptimizedCommentGenerator = OptimizedCommentGenerator;

// Create global instance
window.commentGenerator = new OptimizedCommentGenerator();

// Backward compatibility functions
window.generateCommentsFromStorage = function () {
    return window.commentGenerator.generateFromStorage();
};

window.testCommentGeneration = function () {
    return window.commentGenerator.testGeneration();
};

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    // Ensure the generator is ready
    if (!window.commentGenerator.isInitialized) {
        window.commentGenerator.init();
    }

    debugLog('OptimizedCommentGenerator ready for use');
});

debugLog('Optimized Comment Generator loaded successfully');
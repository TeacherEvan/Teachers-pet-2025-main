/**
 * Optimized Comment Generator - Compatibility bridge to PremiumCommentEngine
 * Provides backward compatibility and enhanced integration with existing systems
 */

import { EnhancedCommentEngine } from './assets/js/engine/core.js';

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
                console.log('OptimizedCommentGenerator initialized with EnhancedCommentEngine');
            } else if (typeof window.PremiumCommentEngine !== 'undefined') {
                // Fallback to PremiumCommentEngine if Enhanced is not available
                this.engine = new window.PremiumCommentEngine();
                this.isInitialized = true;
                console.log('OptimizedCommentGenerator initialized with PremiumCommentEngine (fallback)');
            } else {
                console.warn('No comment engines available, using fallback mode');
                this.fallbackMode = true;
                this.initializeFallback();
            }
        } catch (error) {
            console.error('Failed to initialize OptimizedCommentGenerator:', error);
            this.fallbackMode = true;
            this.initializeFallback();
        }
    }

    initializeFallback() {
        this.isInitialized = true;
        console.log('OptimizedCommentGenerator initialized in fallback mode');
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
            console.error('Failed to generate comments from storage:', error);
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
            console.error('Session data validation failed, using fallback:', error);
            return this.generateFallbackComments(this.buildFallbackSessionData(sessionData));
        }

        if (this.fallbackMode) {
            return this.generateFallbackComments(validatedData);
        }

        try {
            // Both engines now return Promises
            return await this.engine.generateComments(validatedData);
        } catch (error) {
            console.error('Engine failed, using fallback:', error);
            return this.generateFallbackComments(validatedData);
        }
    }

    /**
     * Collect session data from localStorage and form elements
     */
    collectSessionData() {
        // Get student data from localStorage
        const studentDataStr = localStorage.getItem('studentData');
        console.log('📦 Raw localStorage studentData:', studentDataStr);

        const studentData = studentDataStr ? JSON.parse(studentDataStr) : {};
        console.log('📊 Parsed studentData:', studentData);
        console.log('📊 studentData.studentName:', studentData.studentName);
        console.log('📊 studentData.gender:', studentData.gender);

        // Get selected subjects
        const selectedSubjects = this.getSelectedSubjects();
        const topicRatings = this.getTopicRatings();

        // Combine all data
        console.log('📊 ⭐ Raw overallAttributes from localStorage:', studentData.overallAttributes, 'Type:', typeof studentData.overallAttributes);
        const parsedRating = parseInt(studentData.overallAttributes);
        console.log('📊 ⭐ After parseInt:', parsedRating, 'Type:', typeof parsedRating, 'isNaN:', isNaN(parsedRating));
        // Use parsed rating if it's a valid number, otherwise default to 5
        const finalRating = (isNaN(parsedRating) || parsedRating < 1 || parsedRating > 10) ? 5 : parsedRating;
        console.log('📊 ⭐ Final rating (validated, defaults to 5 if invalid):', finalRating);
        
        const sessionData = {
            studentName: studentData.studentName || '',
            gender: studentData.gender || 'they',
            overallRating: finalRating,
            strengths: studentData.strengths || '',
            weaknesses: studentData.weaknesses || '',
            subjects: selectedSubjects,
            topicRatings: topicRatings
        };

        console.log('✅ Collected session data:', sessionData);
        console.log('✅ Final studentName value:', sessionData.studentName);
        console.log('✅ ⭐ Final overallRating value:', sessionData.overallRating);
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
     * Validate and clean session data
     */
    validateAndCleanSessionData(sessionData) {
        const rawData = sessionData && typeof sessionData === 'object' ? sessionData : {};
        console.log('🔍 ⭐ validateAndCleanSessionData - INPUT:', sessionData);
        console.log('🔍 ⭐ Input overallRating:', rawData.overallRating, 'Type:', typeof rawData.overallRating);

        const cleaned = this.buildFallbackSessionData(rawData);

        // Ensure required fields
        if (!rawData.studentName || String(rawData.studentName).trim() === '') {
            throw new Error('Student name is required for comment generation');
        }

        // Ensure rating is within valid range
        console.log('🔍 ⭐ Rating validation - value:', cleaned.overallRating, 'Type:', typeof cleaned.overallRating);
        console.log('🔍 ⭐ Is < 1?', cleaned.overallRating < 1, 'Is > 10?', cleaned.overallRating > 10);
        console.log('🔍 ⭐ Is NaN?', isNaN(cleaned.overallRating), 'Is undefined?', cleaned.overallRating === undefined);
        
        if (isNaN(cleaned.overallRating) || cleaned.overallRating < 1 || cleaned.overallRating > 10) {
            console.warn('⚠️ ⭐ Invalid rating detected! Value:', cleaned.overallRating, '- Defaulting to 5');
            cleaned.overallRating = 5;
        } else {
            console.log('✅ ⭐ Rating validation PASSED - using value:', cleaned.overallRating);
        }

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
        const pronoun = this.getPronounSet(safeData.gender);
        const performance = this.getPerformanceDescriptor(safeData.overallRating);

        const maleComment = this.generateMaleFallbackComment(name, pronoun, performance, safeData);
        const femaleComment = this.generateFemaleFallbackComment(name, pronoun, performance, safeData);

        return {
            male: maleComment,
            female: femaleComment,
            wordCount: {
                male: this.getWordCount(maleComment),
                female: this.getWordCount(femaleComment)
            }
        };
    }

    generateMaleFallbackComment(name, pronoun, performance, data) {
        let comment = `${name} has demonstrated ${performance.level} performance this term, showing consistent progress across multiple learning areas. `;

        if (data.strengths) {
            const strengths = this.processTextList(data.strengths);
            comment += `${pronoun.subject} particularly excels in ${this.naturalJoin(strengths)}, displaying strong understanding. `;
        }

        if (data.subjects && data.subjects.length > 0) {
            comment += `In ${this.naturalJoin(data.subjects)}, ${name} has shown steady progress and engagement with the curriculum. `;
        }

        comment += `${pronoun.subject} maintains positive behavior in the classroom and works well with peers. `;

        if (data.weaknesses) {
            const weaknesses = this.processTextList(data.weaknesses);
            comment += `With continued support in ${this.naturalJoin(weaknesses)}, ${name} will continue to develop these important skills. `;
        }

        comment += `${name} is well-prepared for continued academic growth and shows potential for future success.`;

        return comment;
    }

    generateFemaleFallbackComment(name, pronoun, performance, data) {
        let comment = `${name} has demonstrated ${performance.level} performance this term, bringing enthusiasm to our classroom community. `;

        if (data.strengths) {
            const strengths = this.processTextList(data.strengths);
            comment += `${pronoun.subject} particularly excels in ${this.naturalJoin(strengths)}, displaying strong abilities. `;
        }

        if (data.subjects && data.subjects.length > 0) {
            comment += `In ${this.naturalJoin(data.subjects)}, ${name} has shown consistent progress and curiosity. `;
        }

        comment += `${pronoun.subject} brings positive energy to classroom interactions and is a valued member of our learning community. `;

        if (data.weaknesses) {
            const weaknesses = this.processTextList(data.weaknesses);
            comment += `With gentle encouragement in ${this.naturalJoin(weaknesses)}, ${name} will continue to develop these important skills. `;
        }

        comment += `${name} is ready for continued learning adventures and shows potential for future success.`;

        return comment;
    }

    /**
     * Get pronoun set for gender
     */
    getPronounSet(gender) {
        const pronouns = {
            he: { subject: 'He', object: 'him', possessive: 'his' },
            she: { subject: 'She', object: 'her', possessive: 'her' },
            they: { subject: 'They', object: 'them', possessive: 'their' }
        };

        const normalizedGender = typeof gender === 'string' ? gender.toLowerCase() : 'they';
        return pronouns[normalizedGender] || pronouns.they;
    }

    /**
     * Get performance descriptor
     */
    getPerformanceDescriptor(rating) {
        const descriptors = {
            10: { level: 'exceptional', attitude: 'outstanding' },
            9: { level: 'excellent', attitude: 'exemplary' },
            8: { level: 'very strong', attitude: 'enthusiastic' },
            7: { level: 'strong', attitude: 'positive' },
            6: { level: 'good', attitude: 'cooperative' },
            5: { level: 'satisfactory', attitude: 'willing' },
            4: { level: 'developing', attitude: 'engaged' },
            3: { level: 'basic', attitude: 'participative' },
            2: { level: 'beginning', attitude: 'responsive' },
            1: { level: 'emerging', attitude: 'guided' }
        };

        return descriptors[rating] || descriptors[5];
    }

    /**
     * Process text list from comma-separated string
     */
    processTextList(text) {
        if (!text) return [];
        if (Array.isArray(text)) {
            return text.map(item => String(item).trim()).filter(Boolean);
        }
        if (typeof text !== 'string') return [];
        return text.split(',').map(item => item.trim()).filter(Boolean);
    }

    /**
     * Natural language joining
     */
    naturalJoin(arr, conjunction = 'and') {
        if (!arr || arr.length === 0) return '';
        if (arr.length === 1) return arr[0];
        if (arr.length === 2) return `${arr[0]} ${conjunction} ${arr[1]}`;
        return `${arr.slice(0, -1).join(', ')}, ${conjunction} ${arr.slice(-1)}`;
    }

    /**
     * Get word count
     */
    getWordCount(text) {
        if (!text) return 0;
        return text.trim().split(/\s+/).filter(word => word.length > 0).length;
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
                male: this.getWordCount(errorComment),
                female: this.getWordCount(errorComment)
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

    console.log('OptimizedCommentGenerator ready for use');
});

console.log('Optimized Comment Generator loaded successfully');
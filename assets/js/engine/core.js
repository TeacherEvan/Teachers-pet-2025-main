/* eslint-env es6 */
/* global window, TeachersPetProcessor, TeachersPetTemplates, TeachersPetUtils */

/**
 * Enhanced Comment Generation Engine (Core)
 * Orchestrates the generation process by coordinating data processing and template generation.
 * @class EnhancedCommentEngine
 */
class EnhancedCommentEngine {
    constructor() {
        // Load data from global namespace (extracted to assets/js/data/engine-data.js)
        this.data = window.TeachersPetData || {};

        // Fallback if data is missing (should not happen if script loaded correctly)
        if (Object.keys(this.data).length === 0) {
            console.error('❌ TeachersPetData not loaded! Check script tags.');
        }
    }

    /**
     * Main entry point - generates both male and female teacher comments
     */
    async generateComments(sessionData) {
        try {
            console.log('🎯 Enhanced Engine: Processing session data', sessionData);

            if (!sessionData || !sessionData.studentName) {
                throw new Error('Invalid session data: missing student name');
            }

            // 1. Process Data
            const processedData = TeachersPetProcessor.processSessionData(sessionData, this.data);
            console.log('📊 Processed data structure:', processedData);

            // 2. Generate Comments using Templates
            let maleComment = await TeachersPetTemplates.generateStyleComment('male', processedData);
            let femaleComment = await TeachersPetTemplates.generateStyleComment('female', processedData);

            // 3. Apply Synonym Replacement
            if (typeof window !== 'undefined' && window.synonymManager) {
                console.log('📚 Applying synonym replacement to male comment...');
                maleComment = await window.synonymManager.replaceOverused(maleComment, 2);

                console.log('📚 Applying synonym replacement to female comment...');
                femaleComment = await window.synonymManager.replaceOverused(femaleComment, 2);
            } else {
                console.warn('⚠️ SynonymManager not available, skipping synonym replacement');
            }

            return {
                male: maleComment,
                female: femaleComment,
                wordCount: {
                    male: TeachersPetUtils.getWordCount(maleComment),
                    female: TeachersPetUtils.getWordCount(femaleComment)
                }
            };
        } catch (error) {
            console.error('❌ Enhanced comment generation failed:', error);
            return await TeachersPetTemplates.generateFallbackComments(sessionData.studentName || 'Student');
        }
    }
}

// Export for global use
if (typeof window !== 'undefined') {
    window.EnhancedCommentEngine = EnhancedCommentEngine;
}

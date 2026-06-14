/* eslint-env es6 */
import { TeachersPetData } from '../data/engine-data.js';
import { synonymManager } from '../synonym-manager.js';
import { TeachersPetProcessor } from './processor.js';
import { TeachersPetTemplates } from './templates.js';
import { TeachersPetUtils } from './utils.js';
import { debugLog } from '../utils/debug.js';

/**
 * Enhanced Comment Generation Engine (Core)
 * Orchestrates the generation process by coordinating data processing and template generation.
 * @class EnhancedCommentEngine
 */
export class EnhancedCommentEngine {
    constructor() {
        // Load data from imported module
        this.data = TeachersPetData || {};

        // Fallback if data is missing (should not happen if script loaded correctly)
        if (Object.keys(this.data).length === 0) {
            debugLog('❌', 'TeachersPetData not loaded! Check script tags.');
        }
    }

    /**
     * Main entry point - generates both male and female teacher comments
     */
    async generateComments(sessionData) {
        try {
            debugLog('🎯', 'Enhanced Engine: Processing session data', sessionData);

            if (!sessionData || !sessionData.studentName) {
                throw new Error('Invalid session data: missing student name');
            }

            // 1. Process Data
            const processedData = TeachersPetProcessor.processSessionData(sessionData, this.data);
            debugLog('📊', 'Processed data structure:', processedData);

            // 2. Generate Comments using Templates
            let maleComment = await TeachersPetTemplates.generateStyleComment('male', processedData);
            let femaleComment = await TeachersPetTemplates.generateStyleComment('female', processedData);

            // 3. Apply Synonym Replacement
            if (synonymManager) {
                debugLog('📚', 'Applying synonym replacement to male comment...');
                maleComment = await synonymManager.replaceOverused(maleComment, 2);

                debugLog('📚', 'Applying synonym replacement to female comment...');
                femaleComment = await synonymManager.replaceOverused(femaleComment, 2);
            } else {
                debugLog('⚠️', 'SynonymManager not available, skipping synonym replacement');
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
            debugLog('❌', 'Enhanced comment generation failed:', error);
            return await TeachersPetTemplates.generateFallbackComments(sessionData.studentName || 'Student');
        }
    }
}

// Export for global use
// if (typeof window !== 'undefined') {
//     window.EnhancedCommentEngine = EnhancedCommentEngine;
// }

/* eslint-env es6 */
/* global window */
import { TeachersPetUtils } from './utils.js';

/**
 * Teachers Pet Data Processor
 * Handles data normalization, validation, and grouping.
 */
export const TeachersPetProcessor = {
    /**
     * Process and structure session data for comment generation
     * @param {Object} sessionData - The raw session data
     * @param {Object} engineData - The engine configuration (pools, maps, rules)
     */
    processSessionData: function (sessionData, engineData) {
        console.log('🔍 Processing session data:', sessionData);

        // Validate student name
        if (!sessionData.studentName || sessionData.studentName.trim() === '') {
            console.error('❌ Missing student name in session data!');
            throw new Error('Student name is required for comment generation');
        }

        // CRITICAL: Track rating value through entire pipeline
        // Use rating if valid (1-10), otherwise default to 5
        const rating = (sessionData.overallRating >= 1 && sessionData.overallRating <= 10) ? sessionData.overallRating : 5;

        const performance = engineData.performanceMap[rating] || engineData.performanceMap[5];

        const genderKey = sessionData.gender.toLowerCase();
        const pronouns = engineData.grammarRules.pronouns[genderKey] || engineData.grammarRules.pronouns.he;

        // Get randomized descriptors/verbs/adverbs from pools
        const descriptor = TeachersPetUtils.getRandomFromPool(engineData.descriptorPools[rating]);
        const verb = TeachersPetUtils.getRandomFromPool(engineData.verbPools[rating]);
        const adverb = TeachersPetUtils.getRandomFromPool(engineData.adverbPools[rating]);

        // Group topics by their parent subjects
        const topicsBySubject = this.groupTopicsBySubject(
            sessionData.subjects || [],
            sessionData.topicRatings || {},
            engineData.subjectTopicMap
        );

        const studentName = sessionData.studentName.trim();

        return {
            name: studentName,
            grade: sessionData.grade || 'K1',
            month: sessionData.month || 'August',
            level: performance.level,
            descriptor: descriptor,
            verb: verb,
            adverb: adverb,
            subjects: sessionData.subjects || [],
            topicsBySubject: topicsBySubject,
            allTopics: Object.keys(sessionData.topicRatings || {}),
            strengths: TeachersPetUtils.processTextArray(sessionData.strengths || ''),
            weaknesses: TeachersPetUtils.processTextArray(sessionData.weaknesses || ''),
            overallRating: sessionData.overallRating,
            pronoun_subject: pronouns.subject,
            pronoun_subject_lower: pronouns.subject_lower,
            pronoun_object: pronouns.object,
            pronoun_possessive: pronouns.possessive,
            pronoun_possessive_cap: pronouns.possessive_cap,
            pronoun_verb: pronouns.verb,
            pronoun_isAre: pronouns.isAre
        };
    },

    /**
     * Group topics under their parent subjects for better organization
     */
    groupTopicsBySubject: function (subjects, topicRatings, subjectTopicMap) {
        const grouped = {};
        const topicList = Object.keys(topicRatings);

        // Initialize with empty arrays for selected subjects
        subjects.forEach(subject => {
            grouped[subject] = [];
        });

        // Assign topics to subjects based on keyword matching
        topicList.forEach(topic => {
            const topicLower = topic.toLowerCase();
            let assigned = false;

            for (const subject of subjects) {
                const keywords = subjectTopicMap[subject] || [];
                if (keywords.some(keyword => topicLower.includes(keyword.toLowerCase()))) {
                    grouped[subject].push(topic);
                    assigned = true;
                    break;
                }
            }

            // If not assigned, try case-insensitive subject name matching
            if (!assigned) {
                for (const subject of subjects) {
                    if (topicLower.includes(subject.toLowerCase())) {
                        grouped[subject].push(topic);
                        assigned = true;
                        break;
                    }
                }
            }

            // Still not assigned? Add to first subject as fallback
            if (!assigned && subjects.length > 0) {
                console.warn(`⚠️ Topic "${topic}" could not be matched to any subject - assigning to first subject "${subjects[0]}" as fallback`);
                grouped[subjects[0]].push(topic);
            } else if (!assigned) {
                console.warn(`⚠️ Topic "${topic}" could not be matched to any subject and no subjects selected - ORPHANED TOPIC`);
            }
        });

        return grouped;
    }
};

/* eslint-env es6 */
/* eslint-disable no-unused-vars */
/* global window */
/**
 * Enhanced Comment Generation Engine
 * Ensures ALL user selections (subjects, topics, strengths, weaknesses) are mentioned
 * Improved integration of specific activities and curriculum-aligned content
 * @class EnhancedCommentEngine
 */

/**
 * Debug logging helper - only logs when window.__TP_DEBUG__ === true
 * @param {string} emoji - Emoji prefix for the log message
 * @param {string} message - Main log message
 * @param {...any} args - Additional arguments to log
 */
function debugLog(emoji, message, ...args) {
    if (typeof window !== 'undefined' && window.__TP_DEBUG__ === true) {
        console.log(emoji + ' ' + message, ...args);
    }
}

class EnhancedCommentEngine {
    constructor() {
        // Load data from global namespace (extracted to assets/js/data/engine-data.js)
        const data = window.TeachersPetData || {};

        this.descriptorPools = data.descriptorPools || {};
        this.verbPools = data.verbPools || {};
        this.adverbPools = data.adverbPools || {};
        this.performanceMap = data.performanceMap || {};
        this.grammarRules = data.grammarRules || {};
        this.subjectTopicMap = data.subjectTopicMap || {};

        // Fallback if data is missing (should not happen if script loaded correctly)
        if (Object.keys(this.descriptorPools).length === 0) {
            console.error('❌ TeachersPetData not loaded! Check script tags.');
        }
    }

    /**
     * Get random item from array pool to prevent repetition
     */
    getRandomFromPool(pool) {
        if (!pool || pool.length === 0) return "";
        return pool[Math.floor(Math.random() * pool.length)];
    }

    /**
     * Main entry point - generates both male and female teacher comments
     * Now returns a Promise to support async synonym replacement
     */
    async generateComments(sessionData) {
        try {
            debugLog('🎯', 'Enhanced Engine: Processing session data', sessionData);

            if (!sessionData || !sessionData.studentName) {
                throw new Error('Invalid session data: missing student name');
            }

            const processedData = this.processSessionData(sessionData);
            debugLog('📊', 'Processed data structure:', processedData);

            let maleComment = await this.generateStyleComment('male', processedData);
            let femaleComment = await this.generateStyleComment('female', processedData);

            // Apply synonym replacement if SynonymManager is available
            if (typeof window !== 'undefined' && window.synonymManager) {
                debugLog('📚', 'Applying synonym replacement to male comment...');
                maleComment = await window.synonymManager.replaceOverused(maleComment, 2);

                debugLog('📚', 'Applying synonym replacement to female comment...');
                femaleComment = await window.synonymManager.replaceOverused(femaleComment, 2);
            } else {
                console.warn('⚠️ SynonymManager not available, skipping synonym replacement');
            }

            return {
                male: maleComment,
                female: femaleComment,
                wordCount: {
                    male: this.getWordCount(maleComment),
                    female: this.getWordCount(femaleComment)
                }
            };
        } catch (error) {
            console.error('❌ Enhanced comment generation failed:', error);
            return await this.generateFallbackComments(sessionData.studentName || 'Student');
        }
    }

    /**
     * Process and structure session data for comment generation
     */
    processSessionData(sessionData) {
        debugLog('🔍', 'Processing session data:', sessionData);
        debugLog('📊', 'sessionData.studentName:', sessionData.studentName);
        debugLog('📊', 'sessionData.gender:', sessionData.gender);
        debugLog('📊', 'sessionData.subjects:', sessionData.subjects);
        debugLog('📊', 'sessionData.topicRatings:', sessionData.topicRatings);
        debugLog('📊', '⭐ sessionData.overallRating (RAW):', sessionData.overallRating, 'Type:', typeof sessionData.overallRating);

        // Validate student name
        if (!sessionData.studentName || sessionData.studentName.trim() === '') {
            console.error('❌ Missing student name in session data!');
            throw new Error('Student name is required for comment generation');
        }

        // CRITICAL: Track rating value through entire pipeline
        // Use rating if valid (1-10), otherwise default to 5
        const rating = (sessionData.overallRating >= 1 && sessionData.overallRating <= 10) ? sessionData.overallRating : 5;
        debugLog('📊', '⭐ RATING VALUE BEING USED:', rating, 'Type:', typeof rating);
        debugLog('📊', '⭐ Available rating pools:', Object.keys(this.performanceMap).join(', '));

        const performance = this.performanceMap[rating] || this.performanceMap[5];
        debugLog('📊', '⭐ Performance level selected:', performance.level);

        const genderKey = sessionData.gender.toLowerCase();
        const pronouns = this.grammarRules.pronouns[genderKey] || this.grammarRules.pronouns.he;

        // Get randomized descriptors/verbs/adverbs from pools
        const descriptor = this.getRandomFromPool(this.descriptorPools[rating]);
        const verb = this.getRandomFromPool(this.verbPools[rating]);
        const adverb = this.getRandomFromPool(this.adverbPools[rating]);

        debugLog('📊', `⭐ Selected from pools for rating ${rating}:`);
        debugLog('   -', 'descriptor:', descriptor);
        debugLog('   -', 'verb:', verb);
        debugLog('   -', 'adverb:', adverb);

        // Group topics by their parent subjects
        const topicsBySubject = this.groupTopicsBySubject(sessionData.subjects || [], sessionData.topicRatings || {});
        debugLog('📦', 'Topics grouped by subject:', topicsBySubject);

        // Log each subject and its topics for clarity
        if (window.__TP_DEBUG__ === true) {
            Object.entries(topicsBySubject).forEach(([subject, topics]) => {
                debugLog('  ✓', `${subject}: ${topics.length} topics`, topics);
            });
        }

        const studentName = sessionData.studentName.trim();
        debugLog('✅', 'Using student name:', studentName);

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
            strengths: this.processTextArray(sessionData.strengths || ''),
            weaknesses: this.processTextArray(sessionData.weaknesses || ''),
            overallRating: sessionData.overallRating,
            pronoun_subject: pronouns.subject,
            pronoun_subject_lower: pronouns.subject_lower,
            pronoun_object: pronouns.object,
            pronoun_possessive: pronouns.possessive,
            pronoun_possessive_cap: pronouns.possessive_cap,
            pronoun_verb: pronouns.verb,
            pronoun_isAre: pronouns.isAre
        };
    }

    /**
     * Group topics under their parent subjects for better organization
     */
    groupTopicsBySubject(subjects, topicRatings) {
        const grouped = {};
        const unmappedTopics = [];
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
                const keywords = this.subjectTopicMap[subject] || [];
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

            // Track unmapped topics separately (removed fallback to first subject)
            if (!assigned) {
                console.warn(`⚠️ Topic "${topic}" could not be matched to any subject - will be mentioned generically`);
                unmappedTopics.push(topic);
            }
        });

        // Store unmapped topics for generic reference
        if (unmappedTopics.length > 0) {
            grouped['__unmapped__'] = unmappedTopics;
        }

        return grouped;
    }

    /**
     * Generate comment in specific teacher style (male/female)
     * Now async to support future enhancements
     */
    async generateStyleComment(style, data) {
        const isMale = style === 'male';
        const sections = [];

        // 1. Opening with student name and overall performance
        sections.push(this.generateOpening(data, isMale));

        // 2. Strengths (if provided)
        if (data.strengths && data.strengths.length > 0) {
            sections.push(this.generateStrengthsSection(data, isMale));
        }

        // 3. Subject-specific progress with topics
        if (data.subjects && data.subjects.length > 0) {
            sections.push(this.generateSubjectSection(data, isMale));
        }

        // 4. Weaknesses/development areas (if provided)
        if (data.weaknesses && data.weaknesses.length > 0) {
            sections.push(this.generateWeaknessesSection(data, isMale));
        }

        // 5. Positive conclusion
        sections.push(this.generateConclusion(data, isMale));

        // Join and clean up
        let comment = sections.join(' ');
        comment = this.improveGrammar(comment);
        comment = this.ensureNameUsage(comment, data.name);

        return comment;
    }

    /**
     * Generate opening sentence
     */
    generateOpening(data, isMale) {
        // REVERTED 2025-11-21: Removed grade/month display (logic only)

        const templates = isMale ? [
            `${data.name} demonstrated ${data.level} performance this term, achieving ${data.descriptor} across multiple developmental areas.`,
            `${data.name} has shown ${data.level} academic development throughout the term, displaying ${data.descriptor} in learning objectives.`,
            `${data.name} ${data.verb} during this term, establishing foundational competencies with ${data.descriptor} in essential educational areas.`,
            `Throughout the term, ${data.name} exhibited ${data.level} performance, demonstrating ${data.descriptor} in key developmental domains.`,
            `${data.name} has met ${data.level} benchmarks this term through systematic approach and focused application to learning activities.`,
            `In class, ${data.name} attained ${data.level} results through methodical engagement with course objectives.`,
            `${data.name}'s performance this term reflects ${data.level} achievement with measurable advancement across competency areas.`,
            `The academic record shows ${data.name} accomplished ${data.level} standards this term through dedicated focus on learning goals.`
        ] : [
            `${data.name} has had an enriching time this term, bringing energy and enthusiastic participation to our classroom community.`,
            `It has been a pleasure watching ${data.name} grow and develop ${data.adverb} throughout the term, making ${data.level} progress.`,
            `${data.name} has developed into a confident learner this term, embracing each day with curiosity and ${data.level} engagement.`,
            `${data.name} has shown ${data.level} development with ${data.descriptor} enthusiasm throughout the term.`,
            `${data.name} has engaged positively in class activities, bringing warmth and energy to learning activities.`,
            `It has been rewarding to watch ${data.name} develop as a learner throughout the term, showing enthusiasm and ${data.level} spirit each day.`,
            `${data.name} has contributed meaningfully this term, approaching activities with genuine curiosity and interest.`,
            `${data.name} has grown considerably throughout the term, exploring with interest and achieving ${data.level} milestones.`
        ];

        return this.selectRandom(templates);
    }

    /**
     * Generate strengths section with ALL provided strengths
     */
    generateStrengthsSection(data, isMale) {
        const strengthsList = this.naturalJoin(data.strengths);

        const templates = isMale ? [
            `${data.pronoun_subject} demonstrates strong capabilities in ${strengthsList}, achieving measurable proficiency ${data.adverb}.`,
            `Notable strengths include ${data.pronoun_possessive} abilities in ${strengthsList}, reflecting ${data.descriptor} and sustained dedication.`,
            `${data.name} excels particularly in ${strengthsList}, displaying ${data.descriptor} throughout the term.`,
            `${data.pronoun_possessive_cap} proficiency in ${strengthsList} demonstrates ${data.descriptor} competence this term.`,
            `Analysis of ${data.pronoun_possessive} work reveals distinct aptitude in ${strengthsList}, with ${data.descriptor} evident throughout.`,
            `${data.name} maintains performance standards in ${strengthsList}, evidencing systematic development ${data.adverb}.`,
            `Assessment data confirms ${data.pronoun_possessive} strength areas as ${strengthsList}, showing ${data.descriptor} gains.`,
            `${data.pronoun_subject} exhibits skills in ${strengthsList}, achieving targeted objectives ${data.adverb}.`
        ] : [
            `${data.pronoun_possessive_cap} talents in ${strengthsList} are evident, inspiring others in our classroom.`,
            `${data.pronoun_subject} shows developing strengths in ${strengthsList}, progressing well each day.`,
            `${data.name} demonstrates natural abilities in ${strengthsList}, contributing meaningfully to our classroom.`,
            `${data.pronoun_possessive_cap} strengths in ${strengthsList} bring ${data.descriptor} to our learning environment.`,
            `${data.name}'s engagement with ${strengthsList} encourages peers around ${data.pronoun_object}.`,
            `${data.name} shares skills through ${strengthsList}, enriching our learning community.`,
            `${data.pronoun_subject} engages thoughtfully with ${strengthsList}, creating meaningful moments for classmates.`,
            `${data.name}'s approach to ${strengthsList} supports a collaborative atmosphere in our class.`
        ];

        return this.selectRandom(templates);
    }

    /**
     * Generate subject-specific section mentioning TOPICS
     * UPDATED: Mention ALL subjects, not just 3
     * FIXED: Ensure ALL checked subjects appear in comment, even without topics
     */
    generateSubjectSection(data, isMale) {
        debugLog('🎯', 'generateSubjectSection called with data:', {
            subjects: data.subjects,
            topicsBySubject: data.topicsBySubject
        });

        const parts = [];
        const subjectsWithTopics = Object.entries(data.topicsBySubject)
            .filter(([subject, topics]) => subject !== '__unmapped__' && topics.length > 0);

        debugLog('📦', 'Subjects with topics:', subjectsWithTopics);

        // Detailed subject mentions with topics - mention ALL subjects with topics
        subjectsWithTopics.forEach(([subject, topics], index) => {
            // FIXED 2025-11-21: Mention ALL topics, not just 3 - ensures complete data integration
            const topicsText = this.naturalJoin(topics);

            if (isMale) {
                const templates = [
                    `In ${subject}, ${data.pronoun_subject_lower} showed ${data.descriptor} progress with ${topicsText}, demonstrating proficient understanding.`,
                    `${data.name} demonstrated ${data.level} competency in ${subject}, particularly excelling with ${topicsText}.`,
                    `${data.pronoun_possessive_cap} work in ${subject} was ${data.descriptor}, especially notable in ${topicsText}.`,
                    `${data.pronoun_subject} achieved ${data.level} results in ${subject}, displaying skillful engagement with ${topicsText}.`
                ];
                parts.push(this.selectRandom(templates));
            } else {
                const templates = [
                    `In ${subject}, ${data.pronoun_subject_lower} showed ${data.descriptor} engagement with ${topicsText}.`,
                    `${data.name} demonstrated positive learning in ${subject}, particularly with ${topicsText}.`,
                    `${data.pronoun_possessive_cap} progress in ${subject} was encouraging, especially exploring ${topicsText}.`,
                    `${data.name} engaged well with ${subject}, showing interest in ${topicsText}.`
                ];
                parts.push(this.selectRandom(templates));
            }
        });

        // Handle unmapped topics generically (without attributing to a subject)
        const unmappedTopics = data.topicsBySubject['__unmapped__'];
        if (unmappedTopics && unmappedTopics.length > 0) {
            const unmappedText = this.naturalJoin(unmappedTopics);
            if (isMale) {
                const templates = [
                    `${data.pronoun_subject} also engaged with selected activities including ${unmappedText}, showing versatility.`,
                    `${data.name} participated in ${unmappedText}, demonstrating adaptability across learning areas.`,
                    `Additional work with ${unmappedText} showed ${data.descriptor} engagement.`
                ];
                parts.push(this.selectRandom(templates));
            } else {
                const templates = [
                    `${data.pronoun_subject} also participated in ${unmappedText}, showing enthusiasm.`,
                    `${data.name} engaged with ${unmappedText}, bringing curiosity to each activity.`,
                    `Additional activities including ${unmappedText} were met with positive engagement.`
                ];
                parts.push(this.selectRandom(templates));
            }
        }

        // Find remaining subjects (those without specific topics selected)
        // FIX: Use case-insensitive comparison to ensure all subjects are found
        const subjectsWithTopicsNames = subjectsWithTopics.map(([s]) => s);
        const remainingSubjects = data.subjects.filter(subj => {
            // Check if this subject is NOT in the subjectsWithTopics list
            const found = subjectsWithTopicsNames.some(name =>
                name.toLowerCase() === subj.toLowerCase()
            );
            return !found;
        });

        debugLog('📋', 'Remaining subjects (without topics):', remainingSubjects);

        if (remainingSubjects.length > 0) {
            const subjectsList = this.naturalJoin(remainingSubjects);
            if (isMale) {
                parts.push(`${data.pronoun_subject} also demonstrated ${data.descriptor} in ${subjectsList}, showing versatile aptitude.`);
            } else {
                parts.push(`${data.pronoun_subject} also engaged well with ${subjectsList}, progressing in each activity.`);
            }
        }

        // SAFETY CHECK: If NO subjects mentioned at all, add generic statement
        if (parts.length === 0 && data.subjects.length > 0) {
            console.warn('⚠️ No subject parts generated, adding fallback');
            const allSubjectsList = this.naturalJoin(data.subjects);
            if (isMale) {
                parts.push(`${data.name} made ${data.descriptor} progress across ${allSubjectsList}, showing versatile development.`);
            } else {
                parts.push(`${data.name} showed positive growth in ${allSubjectsList}, embracing each learning opportunity.`);
            }
        }

        const result = parts.join(' ');
        debugLog('✅', 'Generated subject section:', result);
        return result;
    }

    /**
     * Generate weaknesses/development section with ALL provided areas
     */
    generateWeaknessesSection(data, isMale) {
        const weaknessesList = this.naturalJoin(data.weaknesses);

        const templates = isMale ? [
            `With continued practice and focused attention in ${weaknessesList}, ${data.name} will further strengthen foundational skills and achieve greater mastery.`,
            `Areas for development include ${weaknessesList}, where additional support and structured guidance will foster meaningful growth.`,
            `Ongoing focus on ${weaknessesList} will help build greater confidence, mastery, and proficiency in these essential areas.`,
            `${data.pronoun_subject} would benefit from enhanced practice in ${weaknessesList} to develop more robust capabilities.`,
            `Targeted intervention in ${weaknessesList} will accelerate skill acquisition and build stronger competency foundations.`,
            `Strategic reinforcement of ${weaknessesList} through structured exercises will yield measurable improvement outcomes.`,
            `Development priorities include ${weaknessesList}, requiring systematic practice and consistent application for optimal gains.`,
            `Recommended focus areas are ${weaknessesList}, where increased repetition and guided instruction will strengthen performance.`
        ] : [
            `With encouragement and support in ${weaknessesList}, ${data.name} will continue to develop with growing confidence.`,
            `Through guidance in ${weaknessesList}, ${data.pronoun_subject_lower} will discover ${data.pronoun_possessive} potential and progress further.`,
            `Areas where ${data.name} will benefit from support include ${weaknessesList}, where ${data.pronoun_subject_lower} can grow with practice.`,
            `With patient encouragement in ${weaknessesList}, ${data.pronoun_subject_lower} will develop in confidence and capability.`,
            `Continued practice in ${weaknessesList} will support progress, building on current foundations.`,
            `${data.name} will develop further in ${weaknessesList} with support, guidance, and regular practice.`,
            `Through consistent teaching in ${weaknessesList}, ${data.pronoun_subject_lower} will discover new strengths and make gains.`,
            `With support and regular practice in ${weaknessesList}, ${data.name} will grow in confidence and ability.`
        ];

        return this.selectRandom(templates);
    }

    /**
     * Generate positive conclusion
     */
    generateConclusion(data, isMale) {
        const templates = isMale ? [
            `${data.name} is well-prepared for continued advancement and demonstrates strong potential for sustained future success.`,
            `With ongoing support, ${data.name} will continue to thrive academically and achieve ambitious learning goals.`,
            `${data.name} shows readiness for new challenges and demonstrates promising capability for continued educational growth.`,
            `${data.pronoun_subject} has established a solid foundation for future learning and exhibits promise for academic achievement.`,
            `Looking forward, ${data.name} possesses the requisite skills to advance successfully to the next grade level.`,
            `${data.name}'s current trajectory indicates preparedness for upcoming academic challenges and curriculum demands.`,
            `Based on demonstrated competencies, ${data.name} is positioned well for continued progress and future learning success.`,
            `${data.pronoun_subject} has met grade-level expectations and shows readiness to tackle more complex learning objectives.`
        ] : [
            `${data.name} is ready for new experiences and shows potential for continued success and learning.`,
            `With guidance, ${data.name} will continue to progress and grow in all developmental areas.`,
            `${data.name} brings positive energy to learning and is prepared for future growth.`,
            `${data.name} is ready to embrace new challenges with enthusiasm and growing confidence.`,
            `${data.name} will carry this term's achievements forward, continuing to develop and learn.`,
            `Looking ahead, ${data.name} has the foundation to succeed and grow in future learning.`,
            `${data.name} shows readiness and capability to advance confidently into new learning opportunities.`,
            `It has been rewarding supporting ${data.name}'s growth; ${data.pronoun_subject_lower} is ready to progress and thrive.`
        ];

        return this.selectRandom(templates);
    }

    /**
     * Ensure student name appears appropriately throughout comment
     */
    ensureNameUsage(text, studentName) {
        if (!studentName || !text) return text;

        const sentences = text.split(/(?<=[.!?])\s+/);
        let nameCount = (text.match(new RegExp(studentName, 'gi')) || []).length;
        const targetNameUsage = Math.max(3, Math.floor(sentences.length / 3));

        if (nameCount < targetNameUsage) {
            for (let i = 1; i < sentences.length && nameCount < targetNameUsage; i += 2) {
                if (!sentences[i].includes(studentName)) {
                    sentences[i] = sentences[i].replace(/^(He|She|They)\s/, `${studentName} `);
                    nameCount++;
                }
            }
        }

        return sentences.join(' ');
    }

    /**
     * Improve grammar and formatting
     */
    improveGrammar(text) {
        if (!text) return '';

        // Fix capitalization after punctuation
        text = text.replace(/([.!?]\s+)([a-z])/g, (match, punct, letter) => punct + letter.toUpperCase());

        // Capitalize first letter
        text = text.replace(/^([a-z])/, (match, letter) => letter.toUpperCase());

        // Fix spacing
        text = text.replace(/\s+/g, ' ');

        // Ensure proper ending
        if (!/[.!?]$/.test(text.trim())) {
            text = text.trim() + '.';
        }

        return text.trim();
    }

    /**
     * Natural language joining with Oxford comma
     */
    naturalJoin(arr, conjunction = "and") {
        if (!arr || arr.length === 0) return "";
        if (arr.length === 1) return arr[0];
        if (arr.length === 2) return `${arr[0]} ${conjunction} ${arr[1]}`;
        return `${arr.slice(0, -1).join(", ")}, ${conjunction} ${arr.slice(-1)}`;
    }

    /**
     * Process text input into array
     */
    processTextArray(text, maxItems = 5) {
        if (!text || typeof text !== "string") return [];
        return text.split(",").map(item => item.trim()).filter(Boolean).slice(0, maxItems);
    }

    /**
     * Select random item from array
     */
    selectRandom(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    /**
     * Get word count
     */
    getWordCount(text) {
        if (!text) return 0;
        return text.trim().split(/\s+/).filter(word => word.length > 0).length;
    }

    /**
     * Fallback comments when generation fails
     * Now async to support synonym replacement
     */
    async generateFallbackComments(studentName) {
        let maleComment = `${studentName} has demonstrated satisfactory academic progress this term, showing appropriate developmental growth across learning areas. ${studentName} exhibits positive engagement and maintains cooperative behavior. With continued support, ${studentName} will achieve academic success.`;

        let femaleComment = `${studentName} has progressed well this term, contributing positively to our classroom. ${studentName} shows steady development and a cooperative nature. With continued support, ${studentName} will grow in all areas.`;

        // Apply synonym replacement if available
        if (typeof window !== 'undefined' && window.synonymManager) {
            maleComment = await window.synonymManager.replaceOverused(maleComment, 2);
            femaleComment = await window.synonymManager.replaceOverused(femaleComment, 2);
        }

        return {
            male: maleComment,
            female: femaleComment,
            wordCount: { male: this.getWordCount(maleComment), female: this.getWordCount(femaleComment) }
        };
    }
}

// Export for global use
if (typeof window !== 'undefined') {
    window.EnhancedCommentEngine = EnhancedCommentEngine;
}

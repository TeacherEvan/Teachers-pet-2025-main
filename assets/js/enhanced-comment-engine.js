/* eslint-env es6 */
/* eslint-disable no-unused-vars */
/* global window */
/**
 * Enhanced Comment Generation Engine
 * Ensures ALL user selections (subjects, topics, strengths, weaknesses) are mentioned
 * Improved integration of specific activities and curriculum-aligned content
 * @class EnhancedCommentEngine
 */

class EnhancedCommentEngine {
    constructor() {
        this.performanceMap = {
            10: { level: "exceptional", descriptor: "outstanding", verb: "excelled" },
            9: { level: "excellent", descriptor: "impressive", verb: "demonstrated excellence" },
            8: { level: "very strong", descriptor: "commendable", verb: "performed admirably" },
            7: { level: "strong", descriptor: "noteworthy", verb: "achieved well" },
            6: { level: "good", descriptor: "positive", verb: "progressed steadily" },
            5: { level: "satisfactory", descriptor: "appropriate", verb: "developed consistently" },
            4: { level: "developing", descriptor: "emerging", verb: "showed growth" },
            3: { level: "basic", descriptor: "foundational", verb: "made progress" },
            2: { level: "beginning", descriptor: "initial", verb: "began developing" },
            1: { level: "emerging", descriptor: "starting", verb: "explored" }
        };

        this.grammarRules = {
            pronouns: {
                he: { subject: "He", subject_lower: "he", object: "him", possessive: "his", possessive_cap: "His", verb: "has", isAre: "is" },
                she: { subject: "She", subject_lower: "she", object: "her", possessive: "her", possessive_cap: "Her", verb: "has", isAre: "is" },
                they: { subject: "They", subject_lower: "they", object: "them", possessive: "their", possessive_cap: "Their", verb: "have", isAre: "are" }
            },
            subjectCapitalization: {
                english: "English", mathematics: "Mathematics", science: "Science",
                "social studies": "Social Studies", "i.q": "I.Q",
                "physical education": "Physical Education", cooking: "Cooking",
                "conversation 1": "Conversation 1", "conversation 2": "Conversation 2",
                arts: "Arts", "puppet show": "Puppet Show",
                "super safari": "Super Safari", "story time": "Story Time"
            }
        };

        // Subject-to-topic mapping for intelligent grouping
        this.subjectTopicMap = {
            "English": ["draw lines", "trace", "match", "circle", "letter"],
            "Mathematics": ["count", "number", "match", "trace", "dotted"],
            "I.Q": ["color", "same", "fatter", "taller", "hot", "cold", "shape"],
            "Social Studies": ["identify", "animal", "sounds", "habits", "hygiene", "gestures"],
            "Science": ["tissue", "lava", "magnet", "volcano", "experiment"],
            "Cooking": ["look chop", "sugar", "bean", "salt", "coconut"],
            "Conversation 1": ["pet", "feel", "lunch", "want to be", "like to go"],
            "Conversation 2": ["drink", "going", "school"],
            "Arts": ["finger painting", "ladybug", "play dough", "sponge", "origami"],
            "Physical Education": ["football", "balance", "ball", "ring", "jump", "zigzag", "hurdle"],
            "Puppet Show": ["noond", "vegetables", "panicked rabbit"],
            "Super Safari": ["listen", "colour", "numbers", "circle", "pets", "food", "maze", "train", "mask"],
            "Story Time": ["harry frog", "bird", "lovely animals", "ox and the frog"]
        };
    }

    /**
     * Main entry point - generates both male and female teacher comments
     */
    generateComments(sessionData) {
        try {
            console.log('🎯 Enhanced Engine: Processing session data', sessionData);

            if (!sessionData || !sessionData.studentName) {
                throw new Error('Invalid session data: missing student name');
            }

            const processedData = this.processSessionData(sessionData);
            console.log('📊 Processed data structure:', processedData);

            const maleComment = this.generateStyleComment('male', processedData);
            const femaleComment = this.generateStyleComment('female', processedData);

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
            return this.generateFallbackComments(sessionData.studentName || 'Student');
        }
    }

    /**
     * Process and structure session data for comment generation
     */
    processSessionData(sessionData) {
        console.log('🔍 Processing session data:', sessionData);
        console.log('📊 sessionData.subjects:', sessionData.subjects);
        console.log('📊 sessionData.topicRatings:', sessionData.topicRatings);

        const performance = this.performanceMap[sessionData.overallRating] || this.performanceMap[5];
        const pronouns = this.grammarRules.pronouns[sessionData.gender.toLowerCase()] || this.grammarRules.pronouns.they;

        // Group topics by their parent subjects
        const topicsBySubject = this.groupTopicsBySubject(sessionData.subjects || [], sessionData.topicRatings || {});
        console.log('📦 Topics grouped by subject:', topicsBySubject);

        // Log each subject and its topics for clarity
        Object.entries(topicsBySubject).forEach(([subject, topics]) => {
            console.log(`  ✓ ${subject}: ${topics.length} topics`, topics);
        });

        return {
            name: sessionData.studentName.trim(),
            level: performance.level,
            descriptor: performance.descriptor,
            verb: performance.verb,
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

            // Still not assigned? Add to first subject as fallback
            if (!assigned && subjects.length > 0) {
                grouped[subjects[0]].push(topic);
            }
        });

        return grouped;
    }

    /**
     * Generate comment in specific teacher style (male/female)
     */
    generateStyleComment(style, data) {
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
        const templates = isMale ? [
            `${data.name} demonstrated ${data.level} performance this term, achieving consistent progress across multiple developmental areas.`,
            `${data.name} has shown ${data.level} academic development throughout this period, displaying structured engagement with learning objectives.`,
            `${data.name} ${data.verb} this term, establishing strong foundational competencies in essential educational areas.`
        ] : [
            `${data.name} has flourished beautifully this term, bringing such joy and enthusiasm to our classroom community.`,
            `It has been wonderful watching ${data.name} blossom and grow, making ${data.level} progress throughout this learning journey.`,
            `${data.name} has bloomed into a confident learner, embracing each moment with curiosity and ${data.level} engagement.`
        ];

        return this.selectRandom(templates);
    }

    /**
     * Generate strengths section with ALL provided strengths
     */
    generateStrengthsSection(data, isMale) {
        const strengthsList = this.naturalJoin(data.strengths);

        const templates = isMale ? [
            `${data.pronoun_subject} consistently demonstrates strong capabilities in ${strengthsList}, achieving measurable proficiency.`,
            `Notable strengths include ${data.pronoun_possessive} abilities in ${strengthsList}, reflecting sustained achievement.`,
            `${data.name} excels particularly in ${strengthsList}, displaying consistent performance excellence.`
        ] : [
            `${data.pronoun_possessive_cap} beautiful talents in ${strengthsList} truly shine and inspire everyone.`,
            `We celebrate ${data.pronoun_possessive} wonderful gifts in ${strengthsList}, which blossom each day.`,
            `${data.name} brings radiant joy through ${data.pronoun_possessive} exceptional abilities in ${strengthsList}.`
        ];

        return this.selectRandom(templates);
    }

    /**
     * Generate subject-specific section mentioning TOPICS
     * UPDATED: Mention ALL subjects, not just 3
     * FIXED: Ensure ALL checked subjects appear in comment, even without topics
     */
    generateSubjectSection(data, isMale) {
        console.log('🎯 generateSubjectSection called with data:', {
            subjects: data.subjects,
            topicsBySubject: data.topicsBySubject
        });

        const parts = [];
        const subjectsWithTopics = Object.entries(data.topicsBySubject)
            .filter(([subject, topics]) => topics.length > 0);

        console.log('📦 Subjects with topics:', subjectsWithTopics);

        // Detailed subject mentions with topics - mention ALL subjects with topics
        subjectsWithTopics.forEach(([subject, topics], index) => {
            const topicSample = topics.slice(0, 3); // Mention up to 3 topics per subject
            const topicsText = this.naturalJoin(topicSample);

            if (isMale) {
                const templates = [
                    `In ${subject}, ${data.pronoun_subject_lower} showed solid progress with ${topicsText}.`,
                    `${data.name} demonstrated competency in ${subject}, particularly with ${topicsText}.`,
                    `${data.pronoun_possessive_cap} work in ${subject} was ${data.descriptor}, especially in ${topicsText}.`
                ];
                parts.push(this.selectRandom(templates));
            } else {
                const templates = [
                    `In ${subject}, ${data.pronoun_subject_lower} delighted us with ${topicsText}.`,
                    `${data.name} showed wonderful enthusiasm in ${subject}, particularly enjoying ${topicsText}.`,
                    `${data.pronoun_possessive_cap} progress in ${subject} was beautiful, especially with ${topicsText}.`
                ];
                parts.push(this.selectRandom(templates));
            }
        });

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

        console.log('📋 Remaining subjects (without topics):', remainingSubjects);

        if (remainingSubjects.length > 0) {
            const subjectsList = this.naturalJoin(remainingSubjects);
            if (isMale) {
                parts.push(`${data.pronoun_subject} also made consistent progress in ${subjectsList}.`);
            } else {
                parts.push(`${data.pronoun_subject} also flourished in ${subjectsList}.`);
            }
        }

        // SAFETY CHECK: If NO subjects mentioned at all, add generic statement
        if (parts.length === 0 && data.subjects.length > 0) {
            console.warn('⚠️ No subject parts generated, adding fallback');
            const allSubjectsList = this.naturalJoin(data.subjects);
            if (isMale) {
                parts.push(`${data.name} made progress across ${allSubjectsList}.`);
            } else {
                parts.push(`${data.name} showed growth in ${allSubjectsList}.`);
            }
        }

        const result = parts.join(' ');
        console.log('✅ Generated subject section:', result);
        return result;
    }

    /**
     * Generate weaknesses/development section with ALL provided areas
     */
    generateWeaknessesSection(data, isMale) {
        const weaknessesList = this.naturalJoin(data.weaknesses);

        const templates = isMale ? [
            `With continued practice in ${weaknessesList}, ${data.name} will further strengthen foundational skills.`,
            `Areas for development include ${weaknessesList}, where additional support will foster growth.`,
            `Ongoing focus on ${weaknessesList} will help build greater mastery and confidence.`
        ] : [
            `With gentle encouragement in ${weaknessesList}, ${data.name} will continue to blossom beautifully.`,
            `Through nurturing support in ${weaknessesList}, ${data.pronoun_subject_lower} will discover ${data.pronoun_possessive} wonderful potential.`,
            `Areas where ${data.name} will benefit from caring guidance include ${weaknessesList}.`
        ];

        return this.selectRandom(templates);
    }

    /**
     * Generate positive conclusion
     */
    generateConclusion(data, isMale) {
        const templates = isMale ? [
            `${data.name} is well-prepared for continued advancement and demonstrates excellent potential for future success.`,
            `With ongoing support, ${data.name} will continue to thrive academically and achieve learning goals.`,
            `${data.name} shows strong readiness for new challenges and continued educational growth.`
        ] : [
            `${data.name} is ready for wonderful new adventures and shows beautiful potential for continued success.`,
            `With nurturing guidance, ${data.name} will continue to flourish and bloom in all areas.`,
            `${data.name} brings such joy to learning and is beautifully prepared for future growth.`
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
     */
    generateFallbackComments(studentName) {
        const maleComment = `${studentName} has demonstrated satisfactory academic progress this term, showing appropriate developmental growth across learning areas. ${studentName} exhibits positive engagement and maintains cooperative behavior. With continued support, ${studentName} will achieve academic success.`;

        const femaleComment = `${studentName} has blossomed beautifully this term, bringing joy to our classroom. ${studentName} shows wonderful progress and such a caring nature. With continued nurturing, ${studentName} will flourish in all areas.`;

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

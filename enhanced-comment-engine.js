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
        // Randomized descriptor pools to prevent repetition
        this.descriptorPools = {
            10: ["exceptional performance", "remarkable achievement", "superior mastery", "phenomenal competency", "distinguished excellence"],
            9: ["impressive progress", "notable accomplishment", "commendable proficiency", "stellar development", "admirable growth"],
            8: ["strong capability", "solid competence", "robust understanding", "capable performance", "proficient skills"],
            7: ["noteworthy progress", "effective development", "sound understanding", "positive achievement", "competent work"],
            6: ["good progress", "encouraging development", "satisfactory growth", "pleasing advancement", "favorable learning"],
            5: ["appropriate development", "steady progress", "consistent learning", "reliable growth", "suitable advancement"],
            4: ["emerging skills", "developing understanding", "growing capabilities", "budding competence", "promising foundation"],
            3: ["foundational learning", "basic progress", "initial development", "beginning understanding", "early growth"],
            2: ["exploratory learning", "starting development", "beginning journey", "initial steps", "early exploration"],
            1: ["discovering learning", "emerging awareness", "starting exploration", "initial curiosity", "beginning discovery"]
        };

        this.verbPools = {
            10: ["excelled magnificently", "achieved brilliantly", "performed exceptionally", "demonstrated mastery", "showcased excellence"],
            9: ["demonstrated excellence", "performed admirably", "showed impressive skill", "exhibited strong ability", "displayed proficiency"],
            8: ["performed well", "achieved solidly", "demonstrated capability", "showed competence", "exhibited understanding"],
            7: ["progressed effectively", "developed well", "showed growth", "achieved consistently", "learned successfully"],
            6: ["progressed steadily", "developed positively", "grew encouragingly", "advanced favorably", "learned reliably"],
            5: ["developed consistently", "progressed appropriately", "grew steadily", "advanced suitably", "learned reliably"],
            4: ["showed promise", "demonstrated growth", "exhibited development", "displayed progress", "revealed potential"],
            3: ["made progress", "showed development", "demonstrated learning", "exhibited growth", "revealed advancement"],
            2: ["began developing", "started learning", "initiated growth", "commenced progress", "embarked on learning"],
            1: ["explored enthusiastically", "discovered curiously", "began investigating", "started exploring", "commenced discovering"]
        };

        this.adverbPools = {
            10: ["remarkably", "exceptionally", "brilliantly", "magnificently", "phenomenally"],
            9: ["consistently", "impressively", "notably", "admirably", "commendably"],
            8: ["skillfully", "capably", "proficiently", "competently", "effectively"],
            7: ["effectively", "successfully", "positively", "soundly", "ably"],
            6: ["confidently", "encouragingly", "steadily", "reliably", "favorably"],
            5: ["reliably", "appropriately", "consistently", "steadily", "suitably"],
            4: ["steadily", "promisingly", "progressively", "developmentally", "encouragingly"],
            3: ["gradually", "progressively", "foundationally", "basically", "initially"],
            2: ["eagerly", "exploratively", "initially", "tentatively", "beginningly"],
            1: ["curiously", "enthusiastically", "exploratively", "investigatively", "discoveringly"]
        };

        this.performanceMap = {
            10: { level: "exceptional" },
            9: { level: "excellent" },
            8: { level: "very strong" },
            7: { level: "strong" },
            6: { level: "good" },
            5: { level: "satisfactory" },
            4: { level: "developing" },
            3: { level: "basic" },
            2: { level: "beginning" },
            1: { level: "emerging" }
        };

        this.grammarRules = {
            pronouns: {
                he: { subject: "He", subject_lower: "he", object: "him", possessive: "his", possessive_cap: "His", verb: "has", isAre: "is" },
                she: { subject: "She", subject_lower: "she", object: "her", possessive: "her", possessive_cap: "Her", verb: "has", isAre: "is" },
                male: { subject: "He", subject_lower: "he", object: "him", possessive: "his", possessive_cap: "His", verb: "has", isAre: "is" },
                female: { subject: "She", subject_lower: "she", object: "her", possessive: "her", possessive_cap: "Her", verb: "has", isAre: "is" }
            },
            subjectCapitalization: {
                english: "English", mathematics: "Mathematics", science: "Science",
                "social studies": "Social Studies", "i.q": "I.Q",
                "physical education": "Physical Education", cooking: "Cooking",
                "conversation 1": "Conversation 1", "conversation 2": "Conversation 2",
                "conversation 3": "Conversation 3",
                arts: "Arts", "puppet show": "Puppet Show",
                "super safari": "Super Safari", "story time": "Story Time"
            }
        };

        // Subject-to-topic mapping for intelligent grouping
        this.subjectTopicMap = {
            // Expanded English to include K1 phonics items (Nancy, Oscar, Penny, Queenie, Rev N/O/P)
            "English": [
                "draw lines", "trace", "match", "circle", "letter", "alphabet", "phonics",
                "nancy", "nurse", "nose", "oscar", "octopus", "on",
                "penny", "panda", "pen", "queenie", "quick", "quiet",
                "rev", "n/o/p", "n o p"
            ],
            "Mathematics": ["count", "number", "match", "trace", "dotted"],
            "I.Q": ["color", "same", "fatter", "taller", "hot", "cold", "shape"],
            "Social Studies": ["identify", "animal", "sounds", "habits", "hygiene", "gestures"],
            "Science": ["tissue", "lava", "magnet", "volcano", "experiment", "surface tension", "parachute", "float", "sink", "walking water"],
            "Cooking": ["look chop", "sugar", "bean", "salt", "coconut", "thai", "fried", "wonton", "wontons", "minced", "egg", "oil", "carrot", "seasoning"],
            "Conversation 1": ["pet", "feel", "lunch", "want to be", "like to go"],
            "Conversation 2": ["drink", "going", "school"],
            // Added Conversation 3 for K1 November
            "Conversation 3": [
                "food", "eat", "rice", "colors", "color", "yellow", "purple", "green", "orange",
                "daily routines", "wake", "take a shower", "sleep", "go to sleep", "morning"
            ],
            "Arts": ["finger painting", "ladybug", "play dough", "sponge", "origami", "ring craft", "pig", "banana", "painting", "stem", "paper bag", "fathers", "father's day", "card", "flower"],
            "Physical Education": ["football", "balance", "ball", "ring", "jump", "zigzag", "hurdle", "snakes", "ladders", "trampoline", "balancing", "game", "rubber", "shape", "dice", "step", "straw", "jumping"],
            "Puppet Show": ["noond", "vegetables", "panicked rabbit", "hare", "tortoise", "dog", "reflection"],
            "Super Safari": ["listen", "colour", "numbers", "circle", "pets", "food", "maze", "train", "mask"],
            "Story Time": ["harry frog", "bird", "lovely animals", "ox and the frog"]
        };
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
            console.log('🎯 Enhanced Engine: Processing session data', sessionData);

            if (!sessionData || !sessionData.studentName) {
                throw new Error('Invalid session data: missing student name');
            }

            const processedData = this.processSessionData(sessionData);
            console.log('📊 Processed data structure:', processedData);

            let maleComment = await this.generateStyleComment('male', processedData);
            let femaleComment = await this.generateStyleComment('female', processedData);

            // Apply synonym replacement if SynonymManager is available
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
        console.log('🔍 Processing session data:', sessionData);
        console.log('📊 sessionData.studentName:', sessionData.studentName);
        console.log('📊 sessionData.gender:', sessionData.gender);
        console.log('📊 sessionData.subjects:', sessionData.subjects);
        console.log('📊 sessionData.topicRatings:', sessionData.topicRatings);

        // Validate student name
        if (!sessionData.studentName || sessionData.studentName.trim() === '') {
            console.error('❌ Missing student name in session data!');
            throw new Error('Student name is required for comment generation');
        }

        const performance = this.performanceMap[sessionData.overallRating] || this.performanceMap[5];
        const genderKey = sessionData.gender.toLowerCase();
        const pronouns = this.grammarRules.pronouns[genderKey] || this.grammarRules.pronouns.he;

        // Get randomized descriptors/verbs/adverbs from pools
        const rating = sessionData.overallRating || 5;
        const descriptor = this.getRandomFromPool(this.descriptorPools[rating]);
        const verb = this.getRandomFromPool(this.verbPools[rating]);
        const adverb = this.getRandomFromPool(this.adverbPools[rating]);

        // Group topics by their parent subjects
        const topicsBySubject = this.groupTopicsBySubject(sessionData.subjects || [], sessionData.topicRatings || {});
        console.log('📦 Topics grouped by subject:', topicsBySubject);

        // Log each subject and its topics for clarity
        Object.entries(topicsBySubject).forEach(([subject, topics]) => {
            console.log(`  ✓ ${subject}: ${topics.length} topics`, topics);
        });

        const studentName = sessionData.studentName.trim();
        console.log('✅ Using student name:', studentName);

        return {
            name: studentName,
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
                console.warn(`⚠️ Topic "${topic}" could not be matched to any subject - assigning to first subject "${subjects[0]}" as fallback`);
                grouped[subjects[0]].push(topic);
            } else if (!assigned) {
                console.warn(`⚠️ Topic "${topic}" could not be matched to any subject and no subjects selected - ORPHANED TOPIC`);
            }
        });

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
        const templates = isMale ? [
            `${data.name} demonstrated ${data.level} performance this term, achieving consistent and ${data.descriptor} progress across multiple developmental areas.`,
            `${data.name} has shown ${data.level} academic development throughout this period, displaying structured and ${data.descriptor} engagement with learning objectives.`,
            `${data.name} ${data.verb} this term, establishing strong foundational competencies and ${data.descriptor} mastery in essential educational areas.`,
            `Throughout this term, ${data.name} exhibited ${data.level} performance, demonstrating ${data.descriptor} growth in key developmental domains.`,
            `${data.name} has met ${data.level} benchmarks this term with focused determination and systematic approach to learning activities.`,
            `This term, ${data.name} attained ${data.level} results through methodical effort and consistent application to curriculum objectives.`,
            `${data.name}'s performance this period reflects ${data.level} achievement with measurable advancement across core competency areas.`,
            `The academic record shows ${data.name} accomplished ${data.level} standards through dedicated focus and persistent effort.`
        ] : [
            `${data.name} has had a wonderful and enriching term, bringing great energy and enthusiastic participation to our classroom community.`,
            `It has been a pleasure watching ${data.name} grow and develop ${data.adverb}, making ${data.level} progress on this delightful learning journey.`,
            `${data.name} has developed into a confident and capable learner, embracing each day with curiosity and ${data.level} engagement.`,
            `What a joy to see ${data.name} blossom this term, showing ${data.level} development with such ${data.descriptor} enthusiasm.`,
            `${data.name} has brightened our classroom this term, flourishing beautifully and bringing such warmth to every learning moment.`,
            `It's been heartwarming to watch ${data.name} bloom into a joyful learner, radiating enthusiasm and ${data.level} spirit each day.`,
            `${data.name} has truly shined this term, filling our days with delightful curiosity and such genuine love for discovery.`,
            `What a treasure ${data.name} has been—growing with grace, exploring with wonder, and achieving ${data.level} milestones beautifully.`
        ];

        return this.selectRandom(templates);
    }

    /**
     * Generate strengths section with ALL provided strengths
     */
    generateStrengthsSection(data, isMale) {
        const strengthsList = this.naturalJoin(data.strengths);

        const templates = isMale ? [
            `${data.pronoun_subject} consistently demonstrates strong and versatile capabilities in ${strengthsList}, achieving measurable proficiency ${data.adverb}.`,
            `Notable strengths include ${data.pronoun_possessive} ${data.descriptor} abilities in ${strengthsList}, reflecting sustained achievement and dedication.`,
            `${data.name} excels particularly in ${strengthsList}, displaying consistent performance excellence and remarkable aptitude.`,
            `${data.pronoun_possessive_cap} proficiency in ${strengthsList} is ${data.descriptor}, demonstrating exceptional competence throughout this term.`,
            `Analysis of ${data.pronoun_possessive} work reveals distinct aptitude in ${strengthsList}, with quantifiable progress and skill mastery.`,
            `${data.name} maintains high performance standards in ${strengthsList}, evidencing systematic development and focused application.`,
            `Assessment data confirms ${data.pronoun_possessive} strength areas as ${strengthsList}, showing reliable competency and measurable gains.`,
            `${data.pronoun_subject} exhibits well-developed skills in ${strengthsList}, maintaining consistent output and achieving targeted objectives.`
        ] : [
            `${data.pronoun_possessive_cap} admirable and versatile talents in ${strengthsList} are a joy to see and inspire others beautifully.`,
            `We celebrate ${data.pronoun_possessive} wonderful and blossoming gifts in ${strengthsList}, which are developing delightfully each day.`,
            `${data.name} brings a lovely energy to the room through ${data.pronoun_possessive} exceptional and heartwarming abilities in ${strengthsList}.`,
            `It's wonderful to see ${data.pronoun_possessive} natural strengths shine through in ${strengthsList}, bringing such ${data.descriptor} contribution to our class.`,
            `${data.name}'s genuine sparkle in ${strengthsList} lights up our classroom and encourages everyone around ${data.pronoun_object}.`,
            `What precious gifts ${data.name} shares through ${strengthsList}—each one touching hearts and enriching our learning community.`,
            `The way ${data.pronoun_subject_lower} radiates joy while engaging with ${strengthsList} creates such beautiful moments for all of us.`,
            `${data.name}'s natural warmth shines brilliantly in ${strengthsList}, nurturing a loving atmosphere and uplifting classmates daily.`
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
                    `In ${subject}, ${data.pronoun_subject_lower} showed ${data.descriptor} progress with ${topicsText}, demonstrating proficient understanding.`,
                    `${data.name} demonstrated ${data.level} competency in ${subject}, particularly excelling with ${topicsText}.`,
                    `${data.pronoun_possessive_cap} work in ${subject} was ${data.descriptor}, especially notable in ${topicsText}.`,
                    `${data.pronoun_subject} achieved ${data.level} results in ${subject}, displaying skillful engagement with ${topicsText}.`
                ];
                parts.push(this.selectRandom(templates));
            } else {
                const templates = [
                    `In ${subject}, ${data.pronoun_subject_lower} delighted us with ${data.descriptor} enthusiasm for ${topicsText}.`,
                    `${data.name} showed wonderful and heartwarming engagement in ${subject}, particularly enjoying ${topicsText}.`,
                    `${data.pronoun_possessive_cap} progress in ${subject} was lovely to see, especially with the joyful exploration of ${topicsText}.`,
                    `What a pleasure to watch ${data.pronoun_object} flourish in ${subject}, bringing such vibrant energy to ${topicsText}.`
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
                parts.push(`${data.pronoun_subject} also made consistent and ${data.descriptor} progress in ${subjectsList}, demonstrating versatile aptitude.`);
            } else {
                parts.push(`${data.pronoun_subject} also flourished beautifully in ${subjectsList}, bringing delightful energy to each activity.`);
            }
        }

        // SAFETY CHECK: If NO subjects mentioned at all, add generic statement
        if (parts.length === 0 && data.subjects.length > 0) {
            console.warn('⚠️ No subject parts generated, adding fallback');
            const allSubjectsList = this.naturalJoin(data.subjects);
            if (isMale) {
                parts.push(`${data.name} made ${data.descriptor} progress across ${allSubjectsList}, showing versatile development.`);
            } else {
                parts.push(`${data.name} showed wonderful and blossoming growth in ${allSubjectsList}, embracing each learning opportunity.`);
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
            `With continued practice and focused attention in ${weaknessesList}, ${data.name} will further strengthen foundational skills and achieve greater mastery.`,
            `Areas for development include ${weaknessesList}, where additional support and structured guidance will foster meaningful growth.`,
            `Ongoing focus on ${weaknessesList} will help build greater confidence, mastery, and proficiency in these essential areas.`,
            `${data.pronoun_subject} would benefit from enhanced practice in ${weaknessesList} to develop more robust capabilities.`,
            `Targeted intervention in ${weaknessesList} will accelerate skill acquisition and build stronger competency foundations.`,
            `Strategic reinforcement of ${weaknessesList} through structured exercises will yield measurable improvement outcomes.`,
            `Development priorities include ${weaknessesList}, requiring systematic practice and consistent application for optimal gains.`,
            `Recommended focus areas are ${weaknessesList}, where increased repetition and guided instruction will strengthen performance.`
        ] : [
            `With gentle encouragement and nurturing support in ${weaknessesList}, ${data.name} will continue to develop with growing confidence.`,
            `Through caring guidance in ${weaknessesList}, ${data.pronoun_subject_lower} will discover ${data.pronoun_possessive} full potential and blossom beautifully.`,
            `Areas where ${data.name} will benefit from loving guidance include ${weaknessesList}, where ${data.pronoun_subject_lower} will flourish with support.`,
            `With patient encouragement in ${weaknessesList}, ${data.pronoun_subject_lower} will grow in confidence and capability.`,
            `Together we'll nurture growth in ${weaknessesList}, celebrating each small victory and fostering ${data.pronoun_possessive} beautiful journey.`,
            `${data.name} will bloom wonderfully in ${weaknessesList} with tender support, patient guidance, and heartfelt encouragement.`,
            `Through warm, compassionate teaching in ${weaknessesList}, ${data.pronoun_subject_lower} will discover new strengths and flourish joyfully.`,
            `With loving care and gentle persistence in ${weaknessesList}, ${data.name} will blossom into greater confidence and self-belief.`
        ];

        return this.selectRandom(templates);
    }

    /**
     * Generate positive conclusion
     */
    generateConclusion(data, isMale) {
        const templates = isMale ? [
            `${data.name} is well-prepared for continued advancement and demonstrates excellent potential for sustained future success.`,
            `With ongoing support and structured guidance, ${data.name} will continue to thrive academically and achieve ambitious learning goals.`,
            `${data.name} shows strong readiness for new challenges and demonstrates promising capability for continued educational growth.`,
            `${data.pronoun_subject} has established a solid foundation for future learning and exhibits exceptional promise for academic achievement.`,
            `Looking forward, ${data.name} possesses the requisite skills and work habits to advance successfully to the next grade level.`,
            `${data.name}'s current trajectory indicates strong preparedness for upcoming academic challenges and curriculum demands.`,
            `Based on demonstrated competencies, ${data.name} is positioned well for continued progress and future learning success.`,
            `${data.pronoun_subject} has met grade-level expectations and shows readiness to tackle more complex learning objectives ahead.`
        ] : [
            `${data.name} is ready for new adventures and shows such great potential for continued success and joyful learning.`,
            `With nurturing guidance, ${data.name} will continue to flourish beautifully and grow in all developmental areas.`,
            `${data.name} brings such joy and vibrant energy to learning and is wonderfully prepared for future growth.`,
            `What a delight to watch ${data.pronoun_object} grow—${data.name} is ready to embrace new challenges with enthusiasm and confidence.`,
            `${data.name} will carry this term's beautiful achievements forward, touching hearts and spreading joy in future learning journeys.`,
            `We're so excited to see where ${data.pronoun_possessive} bright spirit and loving nature will lead—such wonderful things await!`,
            `${data.name} has our hearts and our confidence—${data.pronoun_subject_lower} will shine brilliantly in all future endeavors.`,
            `It's been a privilege nurturing ${data.name}'s growth; ${data.pronoun_subject_lower} is cherished, capable, and ready to soar.`
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

        let femaleComment = `${studentName} has blossomed beautifully this term, bringing joy to our classroom. ${studentName} shows wonderful progress and such a caring nature. With continued nurturing, ${studentName} will flourish in all areas.`;

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

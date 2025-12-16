/* eslint-env es6 */
/* global window, TeachersPetUtils */

/**
 * Teachers Pet Comment Templates
 * Contains the logic for generating specific sections of the comment.
 */
window.TeachersPetTemplates = {
    /**
     * Generate comment in specific teacher style (male/female)
     */
    generateStyleComment: async function (style, data) {
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
        comment = TeachersPetUtils.improveGrammar(comment);
        comment = TeachersPetUtils.ensureNameUsage(comment, data.name);

        return comment;
    },

    /**
     * Generate opening sentence
     */
    generateOpening: function (data, isMale) {
        const templates = isMale ? [
            `${data.name} demonstrated ${data.level} performance this term, achieving consistent and ${data.descriptor} progress across multiple developmental areas.`,
            `${data.name} has shown ${data.level} academic development throughout the term, displaying structured and ${data.descriptor} engagement with learning objectives.`,
            `${data.name} ${data.verb} during this term, establishing strong foundational competencies and ${data.descriptor} mastery in essential educational areas.`,
            `Throughout the term, ${data.name} exhibited ${data.level} performance, demonstrating ${data.descriptor} growth in key developmental domains.`,
            `${data.name} has met ${data.level} benchmarks this term with focused determination and systematic approach to learning activities.`,
            `In class, ${data.name} attained ${data.level} results through methodical effort and consistent application to objectives.`,
            `${data.name}'s performance this term reflects ${data.level} achievement with measurable advancement across core competency areas.`,
            `The academic record shows ${data.name} accomplished ${data.level} standards this term through dedicated focus and persistent effort.`
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

        return TeachersPetUtils.selectRandom(templates);
    },

    /**
     * Generate strengths section with ALL provided strengths
     */
    generateStrengthsSection: function (data, isMale) {
        const strengthsList = TeachersPetUtils.naturalJoin(data.strengths);

        const templates = isMale ? [
            `${data.pronoun_subject} consistently demonstrates strong and versatile capabilities in ${strengthsList}, achieving measurable proficiency ${data.adverb}.`,
            `Notable strengths include ${data.pronoun_possessive} ${data.descriptor} abilities in ${strengthsList}, reflecting sustained achievement and dedication.`,
            `${data.name} excels particularly in ${strengthsList}, displaying consistent performance excellence and aptitude.`,
            `${data.pronoun_possessive_cap} proficiency in ${strengthsList} is ${data.descriptor}, demonstrating competence throughout this term.`,
            `Analysis of ${data.pronoun_possessive} work reveals distinct aptitude in ${strengthsList}, with quantifiable progress and skill mastery.`,
            `${data.name} maintains high performance standards in ${strengthsList}, evidencing systematic development and focused application.`,
            `Assessment data confirms ${data.pronoun_possessive} strength areas as ${strengthsList}, showing reliable competency and measurable gains.`,
            `${data.pronoun_subject} exhibits well-developed skills in ${strengthsList}, maintaining consistent output and achieving targeted objectives.`
        ] : [
            `${data.pronoun_possessive_cap} talents in ${strengthsList} are evident and inspire others positively.`,
            `${data.pronoun_subject} shows developing strengths in ${strengthsList}, which are progressing well each day.`,
            `${data.name} demonstrates natural abilities in ${strengthsList}, contributing positively to our classroom.`,
            `${data.pronoun_possessive_cap} strengths in ${strengthsList} are clear and bring ${data.descriptor} contribution to our class.`,
            `${data.name}'s engagement with ${strengthsList} is positive and encourages peers around ${data.pronoun_object}.`,
            `${data.name} shares meaningful skills through ${strengthsList}, enriching our learning community.`,
            `${data.pronoun_subject} engages thoughtfully with ${strengthsList}, creating positive moments for all of us.`,
            `${data.name}'s approach to ${strengthsList} is encouraging, supporting a collaborative atmosphere among classmates.`
        ];

        return TeachersPetUtils.selectRandom(templates);
    },

    /**
     * Generate subject-specific section mentioning TOPICS
     */
    generateSubjectSection: function (data, isMale) {
        const parts = [];
        const subjectsWithTopics = Object.entries(data.topicsBySubject)
            .filter(([subject, topics]) => topics.length > 0);

        // Detailed subject mentions with topics
        subjectsWithTopics.forEach(([subject, topics]) => {
            const topicsText = TeachersPetUtils.naturalJoin(topics);

            if (isMale) {
                const templates = [
                    `In '${subject}', ${data.pronoun_subject_lower} showed ${data.descriptor} progress with ${topicsText}, demonstrating proficient understanding.`,
                    `${data.name} demonstrated ${data.level} competency in '${subject}', particularly excelling with ${topicsText}.`,
                    `${data.pronoun_possessive_cap} work in '${subject}' was ${data.descriptor}, especially notable in ${topicsText}.`,
                    `${data.pronoun_subject} achieved ${data.level} results in '${subject}', displaying skillful engagement with ${topicsText}.`
                ];
                parts.push(TeachersPetUtils.selectRandom(templates));
            } else {
                const templates = [
                    `In '${subject}', ${data.pronoun_subject_lower} showed ${data.descriptor} engagement with ${topicsText}.`,
                    `${data.name} demonstrated positive learning in '${subject}', particularly with ${topicsText}.`,
                    `${data.pronoun_possessive_cap} progress in '${subject}' was encouraging, especially exploring ${topicsText}.`,
                    `${data.name} engaged well with '${subject}', showing interest in ${topicsText}.`
                ];
                parts.push(TeachersPetUtils.selectRandom(templates));
            }
        });

        // Find remaining subjects (those without specific topics selected)
        const subjectsWithTopicsNames = subjectsWithTopics.map(([s]) => s);
        const remainingSubjects = data.subjects.filter(subj => {
            const found = subjectsWithTopicsNames.some(name =>
                name.toLowerCase() === subj.toLowerCase()
            );
            return !found;
        });

        if (remainingSubjects.length > 0) {
            const subjectsList = TeachersPetUtils.naturalJoin(remainingSubjects.map(s => `'${s}'`));
            if (isMale) {
                parts.push(`${data.pronoun_subject} also made consistent and ${data.descriptor} progress in ${subjectsList}, demonstrating versatile aptitude.`);
            } else {
                parts.push(`${data.pronoun_subject} also progressed well in ${subjectsList}, engaging positively with each activity.`);
            }
        }

        // SAFETY CHECK: If NO subjects mentioned at all, add generic statement
        if (parts.length === 0 && data.subjects.length > 0) {
            const allSubjectsList = TeachersPetUtils.naturalJoin(data.subjects.map(s => `'${s}'`));
            if (isMale) {
                parts.push(`${data.name} made ${data.descriptor} progress across ${allSubjectsList}, showing versatile development.`);
            } else {
                parts.push(`${data.name} showed positive growth in ${allSubjectsList}, embracing each learning opportunity.`);
            }
        }

        return parts.join(' ');
    },

    /**
     * Generate weaknesses/development section with ALL provided areas
     */
    generateWeaknessesSection: function (data, isMale) {
        const weaknessesList = TeachersPetUtils.naturalJoin(data.weaknesses);

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

        return TeachersPetUtils.selectRandom(templates);
    },

    /**
     * Generate positive conclusion
     */
    generateConclusion: function (data, isMale) {
        const templates = isMale ? [
            `${data.name} is well-prepared for continued advancement and demonstrates excellent potential for sustained future success.`,
            `With ongoing support and structured guidance, ${data.name} will continue to thrive academically and achieve ambitious learning goals.`,
            `${data.name} shows strong readiness for new challenges and demonstrates promising capability for continued educational growth.`,
            `${data.pronoun_subject} has established a solid foundation for future learning and exhibits promise for academic achievement.`,
            `Looking forward, ${data.name} possesses the requisite skills and work habits to advance successfully to the next grade level.`,
            `${data.name}'s current trajectory indicates strong preparedness for upcoming academic challenges and curriculum demands.`,
            `Based on demonstrated competencies, ${data.name} is positioned well for continued progress and future learning success.`,
            `${data.pronoun_subject} has met grade-level expectations and shows readiness to tackle more complex learning objectives ahead.`
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

        return TeachersPetUtils.selectRandom(templates);
    },

    /**
     * Fallback comments when generation fails
     */
    generateFallbackComments: async function (studentName) {
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
            wordCount: {
                male: TeachersPetUtils.getWordCount(maleComment),
                female: TeachersPetUtils.getWordCount(femaleComment)
            }
        };
    }
};

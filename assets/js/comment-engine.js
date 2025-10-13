/**
 * Teachers Pet - Premium Comment Generation Engine
 * Advanced AI-powered comment generation with complete user input integration
 * In-memory processing with no storage dependencies
 */

class PremiumCommentEngine {
  constructor() {
    this.performanceMap = {
      10: {
        level: "exceptional",
        achievement: "outstanding mastery of developmental milestones",
        attitude: "exemplary engagement",
        descriptor: "remarkable",
      },
      9: {
        level: "excellent",
        achievement: "impressive command of key learning objectives",
        attitude: "consistently positive approach",
        descriptor: "excellent",
      },
      8: {
        level: "very strong",
        achievement: "solid grasp of essential concepts",
        attitude: "enthusiastic participation",
        descriptor: "strong",
      },
      7: {
        level: "strong",
        achievement: "good understanding of fundamental skills",
        attitude: "positive engagement",
        descriptor: "good",
      },
      6: {
        level: "good",
        achievement: "satisfactory progress in key areas",
        attitude: "cooperative behavior",
        descriptor: "satisfactory",
      },
      5: {
        level: "satisfactory",
        achievement: "appropriate developmental progress",
        attitude: "willing participation",
        descriptor: "adequate",
      },
      4: {
        level: "developing",
        achievement: "emerging understanding of core concepts",
        attitude: "engaged learning",
        descriptor: "developing",
      },
      3: {
        level: "basic",
        achievement: "foundational skill recognition",
        attitude: "participative approach",
        descriptor: "basic",
      },
      2: {
        level: "beginning",
        achievement: "early skill development",
        attitude: "responsiveness to support",
        descriptor: "beginning",
      },
      1: {
        level: "emerging",
        achievement: "initial learning exploration",
        attitude: "benefits from guidance",
        descriptor: "emerging",
      },
    };

    this.grammarRules = {
      pronouns: {
        he: {
          subject: "He",
          subject_lower: "he",
          object: "him",
          possessive: "his",
          possessive_cap: "His",
          verb: "has",
          isAre: "is",
          reflexive: "himself",
        },
        she: {
          subject: "She",
          subject_lower: "she",
          object: "her",
          possessive: "her",
          possessive_cap: "Her",
          verb: "has",
          isAre: "is",
          reflexive: "herself",
        },
        they: {
          subject: "They",
          subject_lower: "they",
          object: "them",
          possessive: "their",
          possessive_cap: "Their",
          verb: "have",
          isAre: "are",
          reflexive: "themselves",
        },
      },

      subjectCapitalization: {
        english: "English",
        mathematics: "Mathematics",
        science: "Science",
        "social studies": "Social Studies",
        "i.q": "I.Q",
        "physical education": "Physical Education",
        cooking: "Cooking",
        "conversation 1": "Conversation 1",
        "conversation 2": "Conversation 2",
        arts: "Arts",
        "puppet show": "Puppet Show",
        "super safari": "Super Safari",
        "story time": "Story Time",
      },
    };

    this.sentenceTemplates = {
      male: {
        openings: [
          "{name} demonstrated {level} performance this term, achieving {achievement} across multiple developmental areas with consistent focus and determination.",
          "{name} has maintained {level} academic standards throughout this period, displaying structured progress and methodical engagement with learning objectives.",
          "Throughout this term, {name} established {level} foundational competencies while systematically developing essential educational skills and knowledge.",
          "{name} achieved {level} performance benchmarks this term, demonstrating measurable progress across core developmental milestones.",
          "Academic assessment reveals that {name} has attained {level} proficiency levels, meeting established standards through dedicated effort and application.",
        ],
        strengths: [
          "{name} consistently demonstrates exceptional capabilities in {strengths}, achieving measurable proficiency and maintaining high performance standards.",
          "Notable academic strengths include {pronoun_possessive} demonstrated abilities in {strengths}, which reflect sustained achievement and skill mastery.",
          "{name} excels particularly in {strengths}, displaying quantifiable progress and maintaining consistent performance excellence in these areas.",
          "Assessment data confirms {pronoun_possessive} strong competencies in {strengths}, evidencing systematic skill development and achievement of learning targets.",
          "{pronoun_subject} has established clear proficiency in {strengths}, demonstrating both technical understanding and practical application of these skills.",
        ],
        subjects: [
          "In {subjects}, {name} demonstrates consistent academic progress, meeting curriculum standards and achieving measurable learning outcomes.",
          "{name} has shown structured advancement in {subjects}, maintaining focus on learning objectives and demonstrating competency development.",
          "Performance data in {subjects} reflects {pronoun_possessive} systematic approach to learning and achievement of established academic benchmarks.",
          "{pronoun_subject} demonstrated solid competency growth in {subjects}, meeting grade-level expectations through focused effort and application.",
          "Academic progress in {subjects} indicates {name}'s ability to master essential concepts and achieve required performance standards.",
        ],
        weaknesses: [
          "With continued practice in {weaknesses}, {name} will further strengthen {pronoun_possessive} skills and build greater confidence.",
          "Areas for continued development include {weaknesses}, where additional support and encouragement will foster growth.",
          "Ongoing focus on {weaknesses} will help {name} build stronger foundational skills and achieve greater mastery.",
        ],
        topics: [
          "Specific achievements include {pronoun_possessive} progress in {topics}, highlighting {pronoun_possessive} developing skills and growing confidence.",
          "{pronoun_subject} has shown particular success with {topics}, demonstrating both understanding and practical application of these concepts.",
          "Notable progress in areas such as {topics} reflects {name}'s ability to grasp specific learning objectives and apply skills effectively.",
          "Assessment in {topics} shows {pronoun_possessive} strong grasp of these foundational concepts and readiness for continued development.",
        ],
        behavior: [
          "{pronoun_subject} maintains {attitude} throughout classroom activities, contributing positively to the learning environment.",
          "{name} exhibits {attitude} in all classroom interactions, demonstrating maturity and respect for peers and teachers.",
          "{pronoun_possessive_cap} classroom behavior reflects {attitude}, creating a supportive atmosphere for collaborative learning.",
        ],
        social: [
          "{name} demonstrates excellent social skills, working cooperatively with classmates and showing kindness in daily interactions.",
          "{pronoun_subject} contributes positively to group activities and shows consideration for others in all classroom situations.",
          "{pronoun_possessive_cap} collaborative spirit and friendly nature make {pronoun_object} a valued member of our classroom community.",
        ],
        conclusions: [
          "{name} {pronoun_isAre} well-prepared for continued academic advancement, having established strong foundational skills for future learning success.",
          "With ongoing guidance and support, {name} will continue to thrive academically and socially in future educational endeavors.",
          "{name} shows readiness for new learning challenges and demonstrates excellent potential for continued growth.",
        ],
      },
      female: {
        openings: [
          "{name} has flourished magnificently this term, blossoming into a confident learner and bringing such joy to our classroom community.",
          "It has been an absolute delight watching {name} grow and blossom, celebrating wonderful progress throughout this beautiful learning journey.",
          "{name} has bloomed into an enthusiastic learner, embracing each precious learning moment with such wonderful curiosity and grace.",
          "What a joy it has been to witness {name}'s beautiful growth this term, flourishing in so many wonderful ways across all learning areas.",
          "{name} has truly blossomed this term, radiating enthusiasm and bringing such warmth and joy to every learning experience.",
        ],
        strengths: [
          "{name}'s beautiful gifts in {strengths} truly illuminate our classroom, bringing such wonderful energy and inspiration to everyone around {pronoun_object}.",
          "We celebrate {pronoun_possessive} magnificent talents in {strengths}, which continue to blossom and flourish in the most wonderful ways.",
          "{name} brings such radiant joy to learning through {pronoun_possessive} exceptional abilities in {strengths}, inspiring and uplifting our entire classroom family.",
          "The wonderful way {name} shines in {strengths} fills our hearts with joy and creates such beautiful learning moments for everyone.",
          "{pronoun_possessive_cap} natural gifts in {strengths} bloom beautifully each day, bringing light and wonder to our learning community.",
        ],
        subjects: [
          "{pronoun_subject} has shown wonderful progress in {subjects} with genuine enthusiasm and a love for discovery.",
          "Our studies in {subjects} have been a delightful success for {name}, who approaches each lesson with curiosity.",
          "{name} approaches {subjects} with remarkable curiosity and determination, making meaningful connections with new concepts.",
        ],
        weaknesses: [
          "With gentle encouragement in {weaknesses}, {name} will continue to blossom and develop beautiful confidence in these areas.",
          "Areas where {name} will benefit from nurturing support include {weaknesses}, where we will celebrate each step of progress.",
          "Through patient guidance in {weaknesses}, {name} will discover {pronoun_possessive} own wonderful potential and capabilities.",
        ],
        topics: [
          "{pronoun_subject} has particularly excelled in {topics}, showing both understanding and creative application of these learning objectives.",
          "We celebrate {pronoun_possessive} beautiful achievements in {topics}, which reflect {pronoun_possessive} growing confidence and specific skill development.",
          "{name} has embraced learning opportunities in {topics} with enthusiasm, demonstrating wonderful progress and meaningful engagement.",
          "Assessment results in {topics} show {pronoun_possessive} strong foundation in these essential areas and readiness for new challenges.",
        ],
        behavior: [
          "{name} brings {attitude} to our classroom every day, creating a warm and welcoming environment for all.",
          "{pronoun_subject} creates a positive and nurturing atmosphere for everyone, showing kindness and consideration in all interactions.",
          "{pronoun_possessive_cap} gentle nature and {attitude} make our classroom a more joyful place for learning and growing together.",
        ],
        social: [
          "{name} brings kindness and cooperation to all classroom interactions, naturally supporting and encouraging {pronoun_possessive} classmates.",
          "{pronoun_subject} demonstrates beautiful social skills, creating friendships and showing empathy in all classroom situations.",
          "{pronoun_possessive_cap} caring and inclusive nature makes {pronoun_object} a treasured friend and valued member of our learning community.",
        ],
        conclusions: [
          "{name} {pronoun_isAre} ready for wonderful new adventures in learning, having built a strong foundation for future success.",
          "With nurturing guidance and continued encouragement, {name} will continue to flourish and bloom in all areas of development.",
          "{name} brings joy to our classroom and shows beautiful potential for continued learning success.",
        ],
      },
    };
  }

  /**
   * Main method to generate comments from session data
   */
  generateComments(sessionData) {
    try {
      // Validate input data
      if (!sessionData || !sessionData.studentName) {
        throw new Error('Invalid session data: missing student name');
      }

      // Process the session data
      const processedData = this.processSessionData(sessionData);

      // Generate both comment styles
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
      console.error('Comment generation failed:', error);
      return this.generateFallbackComments(sessionData.studentName || 'Student');
    }
  }

  /**
   * Process session data into comment-ready format
   */
  processSessionData(sessionData) {
    const performance = this.performanceMap[sessionData.overallRating] || this.performanceMap[5];
    const pronouns = this.grammarRules.pronouns[sessionData.gender.toLowerCase()] || this.grammarRules.pronouns.they;

    // Process subjects and topics
    const subjects = this.capitalizeSubjects(sessionData.subjects || []);
    const topicRatings = sessionData.topicRatings || {};
    const topicList = Object.keys(topicRatings);

    return {
      name: sessionData.studentName.trim(),
      level: performance.level,
      achievement: performance.achievement,
      attitude: performance.attitude,
      descriptor: performance.descriptor,
      subjects: this.naturalJoin(subjects),
      topics: this.naturalJoin(topicList),
      strengths: this.processTextArray(sessionData.strengths || ''),
      weaknesses: this.processTextArray(sessionData.weaknesses || ''),
      pronoun_subject: pronouns.subject,
      pronoun_subject_lower: pronouns.subject_lower,
      pronoun_object: pronouns.object,
      pronoun_possessive: pronouns.possessive,
      pronoun_possessive_cap: pronouns.possessive_cap,
      pronoun_verb: pronouns.verb,
      pronoun_isAre: pronouns.isAre,
      pronoun_reflexive: pronouns.reflexive,
    };
  }

  /**
   * Generate a complete comment for a specific teacher style
   */
  generateStyleComment(style, data) {
    const templates = this.sentenceTemplates[style];
    const sections = [];

    // Opening statement (always included)
    sections.push(this.selectRandomTemplate(templates.openings, data));

    // Strengths section (if available)
    if (data.strengths && data.strengths.length > 0) {
      const strengthsText = this.naturalJoin(data.strengths);
      const strengthsData = { ...data, strengths: strengthsText };
      sections.push(this.selectRandomTemplate(templates.strengths, strengthsData));
    }

    // Subjects section (if available)
    if (data.subjects && data.subjects.trim() !== '') {
      sections.push(this.selectRandomTemplate(templates.subjects, data));
    }

    // Topics section (if available)
    if (data.topics && data.topics.trim() !== '') {
      sections.push(this.selectRandomTemplate(templates.topics, data));
    }

    // Behavior section
    sections.push(this.selectRandomTemplate(templates.behavior, data));

    // Social skills section
    sections.push(this.selectRandomTemplate(templates.social, data));

    // Weaknesses/development areas (if available)
    if (data.weaknesses && data.weaknesses.length > 0) {
      const weaknessesText = this.naturalJoin(data.weaknesses);
      const weaknessesData = { ...data, weaknesses: weaknessesText };
      sections.push(this.selectRandomTemplate(templates.weaknesses, weaknessesData));
    }

    // Conclusion
    sections.push(this.selectRandomTemplate(templates.conclusions, data));

    // Join sections and improve grammar
    const comment = sections.join(' ');
    return this.improveGrammar(this.ensureNameUsage(comment, data.name));
  }

  /**
   * Select and process a random template
   */
  selectRandomTemplate(templates, data) {
    const template = templates[Math.floor(Math.random() * templates.length)];
    return this.replacePlaceholders(template, data);
  }

  /**
   * Replace template placeholders with actual values
   */
  replacePlaceholders(template, data) {
    return template.replace(/\{([^}]+)\}/g, (match, key) => {
      return data[key] || match;
    });
  }

  /**
   * Ensure student name appears multiple times throughout the comment
   */
  ensureNameUsage(text, studentName) {
    if (!studentName || !text) return text;

    const sentences = text.split(/(?<=[.!?])\s+/);
    const nameUsageTarget = Math.max(2, Math.floor(sentences.length / 3));
    let nameCount = (text.match(new RegExp(studentName, 'gi')) || []).length;

    // If name usage is insufficient, strategically add more
    if (nameCount < nameUsageTarget) {
      for (let i = 1; i < sentences.length && nameCount < nameUsageTarget; i += 2) {
        if (!sentences[i].includes(studentName)) {
          sentences[i] = sentences[i].replace(/^(He|She|They)\s/, `${studentName} `);
          nameCount++;
        }
      }
    }

    return sentences.join(' ');
  }

  /**
   * Comprehensive grammar improvement
   */
  improveGrammar(text) {
    if (!text) return '';

    // Fix capitalization after punctuation
    text = text.replace(/([.!?]\s+)([a-z])/g, (match, punctuation, letter) => {
      return punctuation + letter.toUpperCase();
    });

    // Ensure proper capitalization at beginning
    text = text.replace(/^([a-z])/, (match, letter) => {
      return letter.toUpperCase();
    });

    // Fix pronoun capitalization after punctuation
    text = text.replace(/\b([.!?])\s+(he|she|his|her|him|their|they|them)\b/g, (match, punctuation, pronoun) => {
      return punctuation + ' ' + pronoun.charAt(0).toUpperCase() + pronoun.slice(1);
    });

    // Ensure proper spacing
    text = text.replace(/\s+/g, ' ');

    // Ensure proper ending punctuation
    if (!/[.!?]$/.test(text.trim())) {
      text = text.trim().replace(/[,;:]\s*$/, '') + '.';
    }

    return text.trim();
  }

  /**
   * Natural language joining with proper grammar
   */
  naturalJoin(arr, conjunction = "and") {
    if (!arr || arr.length === 0) return "";
    if (arr.length === 1) return arr[0];
    if (arr.length === 2) return `${arr[0]} ${conjunction} ${arr[1]}`;
    return `${arr.slice(0, -1).join(", ")}, ${conjunction} ${arr.slice(-1)}`;
  }

  /**
   * Capitalize subjects with proper handling
   */
  capitalizeSubjects(subjectList) {
    return subjectList.map((subject) => {
      const lower = subject.toLowerCase();
      if (this.grammarRules.subjectCapitalization[lower]) {
        return this.grammarRules.subjectCapitalization[lower];
      }
      return subject.charAt(0).toUpperCase() + subject.slice(1);
    });
  }

  /**
   * Process text arrays from user input
   */
  processTextArray(text, maxItems = 3) {
    if (!text || typeof text !== "string") return [];
    return text
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
      .slice(0, maxItems);
  }

  /**
   * Generate fallback comments when main generation fails
   */
  generateFallbackComments(studentName) {
    const maleComment = `${studentName} has demonstrated satisfactory academic progress this term, showing appropriate developmental growth across multiple learning areas. ${studentName} exhibits positive engagement in classroom activities and maintains cooperative behavior with peers and teachers. With continued support and encouragement, ${studentName} will continue to develop essential skills and achieve academic success.`;

    const femaleComment = `${studentName} has blossomed beautifully this term, bringing joy and enthusiasm to our classroom community. ${studentName} shows wonderful progress in learning and demonstrates such a caring nature with classmates. With continued nurturing and support, ${studentName} will continue to flourish and grow in all areas of development.`;

    return {
      male: maleComment,
      female: femaleComment,
      wordCount: {
        male: this.getWordCount(maleComment),
        female: this.getWordCount(femaleComment)
      }
    };
  }

  /**
   * Get word count for a text
   */
  getWordCount(text) {
    if (!text) return 0;
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  }
}

// Export for use in the main application
window.PremiumCommentEngine = PremiumCommentEngine;

// Backward compatibility with existing OptimizedCommentGenerator
window.OptimizedCommentGenerator = PremiumCommentEngine;
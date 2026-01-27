/* eslint-env es6 */
/**
 * Refactored Teachers Pet Comment Engine
 * Consolidated from multiple modules into single file under 300 lines
 * Removed redundant templates, simplified data structures, optimized performance
 */

export class TeachersPetEngine {
  constructor() {
    // Simplified data pools - reduced from 641 lines to essential mappings
    this.data = {
      // Performance levels (reduced from detailed arrays to key mappings)
      performanceMap: {
        10: "exceptional",
        9: "excellent",
        8: "very strong",
        7: "strong",
        6: "good",
        5: "satisfactory",
        4: "developing",
        3: "basic",
        2: "beginning",
        1: "emerging",
      },

      pronouns: {
        he: {
          subject: "He",
          object: "him",
          possessive: "his",
          verb: "has",
          isAre: "is",
        },
        she: {
          subject: "She",
          object: "her",
          possessive: "her",
          verb: "has",
          isAre: "is",
        },
        male: {
          subject: "He",
          object: "him",
          possessive: "his",
          verb: "has",
          isAre: "is",
        },
        female: {
          subject: "She",
          object: "her",
          possessive: "her",
          verb: "has",
          isAre: "is",
        },
      },

      // Subject-topic mapping (simplified keywords)
      subjectKeywords: {
        English: ["letter", "phonics", "read", "write"],
        Mathematics: ["count", "number", "add", "shape"],
        Science: ["experiment", "water", "plant", "animal"],
        "Social Studies": ["animal", "hygiene", "identify"],
        Arts: ["paint", "draw", "craft", "color"],
        "Physical Education": ["jump", "run", "balance", "game"],
      },
    };
  }

  /**
   * Main entry point - generates both male and female teacher comments
   * Simplified error handling and async flow
   */
  async generateComments(sessionData) {
    try {
      if (!sessionData?.studentName?.trim()) {
        throw new Error("Student name required");
      }

      const processed = this.processData(sessionData);
      const maleComment = this.generateComment("male", processed);
      const femaleComment = this.generateComment("female", processed);

      return {
        male: maleComment,
        female: femaleComment,
        wordCount: {
          male: this.getWordCount(maleComment),
          female: this.getWordCount(femaleComment),
        },
      };
    } catch (error) {
      console.error("Comment generation failed:", error);
      return this.generateFallback(sessionData.studentName);
    }
  }

  /**
   * Process session data - simplified validation and transformation
   * Removed complex topic grouping, kept essential data processing
   */
  processData(sessionData) {
    const rating = Math.max(1, Math.min(10, sessionData.overallRating || 5));
    const gender = (sessionData.gender || "").toLowerCase();
    const pronouns = this.data.pronouns[gender] || this.data.pronouns.he;

    return {
      name: sessionData.studentName.trim(),
      grade: sessionData.grade || "K1",
      level: this.data.performanceMap[rating],
      subjects: sessionData.subjects || [],
      strengths: this.processTextArray(sessionData.strengths || ""),
      weaknesses: this.processTextArray(sessionData.weaknesses || ""),
      rating: rating,
      pronouns: pronouns,
      // Simplified descriptors - single word instead of phrases
      descriptor: this.getDescriptor(rating),
      verb: this.getVerb(rating),
      adverb: this.getAdverb(rating),
    };
  }

  /**
   * Generate comment in specific style - consolidated template logic
   * Reduced from 8 templates per section to 2-3, removed redundant variations
   */
  generateComment(style, data) {
    const isMale = style === "male";
    const sections = [];

    // Opening
    sections.push(this.generateOpening(data, isMale));

    // Strengths
    if (data.strengths.length > 0) {
      sections.push(this.generateStrengths(data, isMale));
    }

    // Subjects
    if (data.subjects.length > 0) {
      sections.push(this.generateSubjects(data, isMale));
    }

    // Weaknesses
    if (data.weaknesses.length > 0) {
      sections.push(this.generateWeaknesses(data, isMale));
    }

    // Conclusion
    sections.push(this.generateConclusion(data, isMale));

    let comment = sections.join(" ");
    comment = this.improveGrammar(comment);
    comment = this.ensureNameUsage(comment, data.name);

    return comment;
  }

  generateOpening(data, isMale) {
    const templates = isMale
      ? [
          `${data.name} demonstrated ${data.level} performance this term with ${data.descriptor} progress.`,
          `${data.name} has shown ${data.level} development through consistent effort and engagement.`,
        ]
      : [
          `${data.name} has grown ${data.adverb} this term, showing ${data.level} progress and enthusiasm.`,
          `${data.name} has engaged positively in learning activities with ${data.descriptor} participation.`,
        ];
    return this.selectRandom(templates);
  }

  generateStrengths(data, isMale) {
    const strengths = this.naturalJoin(data.strengths);
    const templates = isMale
      ? [
          `${data.name} excels in ${strengths}, demonstrating strong capabilities and consistent performance.`,
          `${data.pronouns.subject} shows particular strength in ${strengths} with measurable progress.`,
        ]
      : [
          `${data.name} shows natural abilities in ${strengths}, contributing positively to our class.`,
          `${data.pronouns.subject} engages thoughtfully with ${strengths}, inspiring peers around ${data.pronouns.object}.`,
        ];
    return this.selectRandom(templates);
  }

  generateSubjects(data, isMale) {
    const subjects = this.naturalJoin(data.subjects.map((s) => `'${s}'`));
    const templates = isMale
      ? [
          `In ${subjects}, ${data.pronouns.subject.toLowerCase()} achieved ${data.level} results with focused application.`,
          `${data.name} demonstrated competency across ${subjects}, showing versatile development.`,
        ]
      : [
          `${data.name} engaged well with ${subjects}, showing positive learning and interest.`,
          `Progress in ${subjects} was encouraging, with ${data.descriptor} participation throughout.`,
        ];
    return this.selectRandom(templates);
  }

  generateWeaknesses(data, isMale) {
    const weaknesses = this.naturalJoin(data.weaknesses);
    const templates = isMale
      ? [
          `Areas for development include ${weaknesses}, where additional practice will strengthen skills.`,
          `Continued focus on ${weaknesses} will help build greater confidence and proficiency.`,
        ]
      : [
          `With support in ${weaknesses}, ${data.name} will continue to develop with growing confidence.`,
          `Practice in ${weaknesses} will help ${data.pronouns.object} progress further with encouragement.`,
        ];
    return this.selectRandom(templates);
  }

  generateConclusion(data, isMale) {
    const templates = isMale
      ? [
          `${data.name} is well-prepared for continued advancement with strong potential for success.`,
          `${data.pronouns.subject} has established a solid foundation for future learning objectives.`,
        ]
      : [
          `${data.name} is ready for new experiences with enthusiasm and growing confidence.`,
          `${data.name} will carry forward achievements, continuing to develop and learn.`,
        ];
    return this.selectRandom(templates);
  }

  generateFallback(name) {
    const male = `${name} has demonstrated satisfactory progress this term with appropriate development.`;
    const female = `${name} has progressed well this term, contributing positively to our classroom.`;

    return {
      male: male,
      female: female,
      wordCount: {
        male: this.getWordCount(male),
        female: this.getWordCount(female),
      },
    };
  }

  // Utility functions - consolidated from utils.js, removed non-essential functions
  naturalJoin(arr, conjunction = "and") {
    if (!arr?.length) return "";
    if (arr.length === 1) return arr[0];
    if (arr.length === 2) return `${arr[0]} ${conjunction} ${arr[1]}`;
    return `${arr.slice(0, -1).join(", ")}, ${conjunction} ${arr.slice(-1)}`;
  }

  processTextArray(text, maxItems = 5) {
    if (!text) return [];
    if (Array.isArray(text))
      return text.map(String).filter(Boolean).slice(0, maxItems);
    return String(text)
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, maxItems);
  }

  selectRandom(arr) {
    return arr?.length ? arr[Math.floor(Math.random() * arr.length)] : "";
  }

  getWordCount(text) {
    return text
      ? text
          .trim()
          .split(/\s+/)
          .filter((w) => w.length > 0).length
      : 0;
  }

  improveGrammar(text) {
    if (!text) return "";
    return text
      .replace(/([.!?]\s+)([a-z])/g, (m, p, l) => p + l.toUpperCase())
      .replace(/^([a-z])/, (m, l) => l.toUpperCase())
      .replace(/\s+/g, " ")
      .replace(/([^.!?])$/, "$1.");
  }

  ensureNameUsage(text, name) {
    if (!name || !text) return text;
    const sentences = text.split(/(?<=[.!?])\s+/);
    const safeName = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    let nameCount = (text.match(new RegExp(safeName, "gi")) || []).length;
    const target = Math.max(3, Math.floor(sentences.length / 3));

    if (nameCount < target) {
      for (let i = 1; i < sentences.length && nameCount < target; i += 2) {
        if (!sentences[i].includes(name)) {
          sentences[i] = sentences[i].replace(/^(He|She|They)\s/, `${name} `);
          nameCount++;
        }
      }
    }
    return sentences.join(" ");
  }

  // Simplified descriptor/verb/adverb getters - single words instead of phrases
  getDescriptor(rating) {
    const descriptors = {
      10: "exceptional",
      9: "remarkable",
      8: "strong",
      7: "solid",
      6: "good",
      5: "steady",
      4: "developing",
      3: "basic",
      2: "emerging",
      1: "beginning",
    };
    return descriptors[rating] || descriptors[5];
  }

  getVerb(rating) {
    const verbs = {
      10: "excelled",
      9: "achieved",
      8: "performed",
      7: "progressed",
      6: "developed",
      5: "advanced",
      4: "improved",
      3: "learned",
      2: "engaged",
      1: "explored",
    };
    return verbs[rating] || verbs[5];
  }

  getAdverb(rating) {
    const adverbs = {
      10: "exceptionally",
      9: "remarkably",
      8: "strongly",
      7: "solidly",
      6: "well",
      5: "steadily",
      4: "progressively",
      3: "gradually",
      2: "actively",
      1: "curiously",
    };
    return adverbs[rating] || adverbs[5];
  }
}

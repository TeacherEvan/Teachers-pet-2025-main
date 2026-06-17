/* eslint-env es6 */

/**
 * Teacher's Pet Utility Functions
 * Pure functions for string manipulation, array handling, and formatting.
 */
export const TeachersPetUtils = {
  /**
   * Natural language joining with Oxford comma
   */
  naturalJoin: function (arr, conjunction = "and") {
    if (!arr || arr.length === 0) return "";
    if (arr.length === 1) return arr[0];
    if (arr.length === 2) return `${arr[0]} ${conjunction} ${arr[1]}`;
    return `${arr.slice(0, -1).join(", ")}, ${conjunction} ${arr.slice(-1)}`;
  },

  /**
   * Process text input into array
   */
  processTextArray: function (text, maxItems = 5) {
    if (!text) return [];
    if (Array.isArray(text)) {
      return text
        .map((item) => String(item).trim())
        .filter(Boolean)
        .slice(0, maxItems);
    }
    if (typeof text !== "string") return [];
    return text
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
      .slice(0, maxItems);
  },

  /**
   * Select random item from array
   */
  selectRandom: function (arr) {
    if (!arr || arr.length === 0) return "";
    return arr[Math.floor(Math.random() * arr.length)];
  },

  /**
   * Get random item from array pool to prevent repetition
   */
  getRandomFromPool: function (pool) {
    if (!pool || pool.length === 0) return "";
    return pool[Math.floor(Math.random() * pool.length)];
  },

  /**
   * Get word count
   */
  getWordCount: function (text) {
    if (!text) return 0;
    return text
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
  },

  /** Improve grammar and formatting */
  improveGrammar: function (text) {
    if (!text) return "";

    // Fix capitalization after punctuation
    text = text.replace(
      /([.!?]\s+)([a-z])/g,
      (match, punct, letter) => punct + letter.toUpperCase(),
    );

    // Capitalize first letter
    text = text.replace(/^([a-z])/, (match, letter) => letter.toUpperCase());

    // Fix spacing
    text = text.replace(/\s+/g, " ");

    // Ensure proper ending
    if (!/[.!?]$/.test(text.trim())) {
      text = text.trim() + ".";
    }

    return text.trim();
  },

  /** Get pronoun set for gender */
  getPronounSet: function (gender) {
    const pronouns = {
      he: { subject: "He", object: "him", possessive: "his" },
      she: { subject: "She", object: "her", possessive: "her" },
      they: { subject: "They", object: "them", possessive: "their" },
    };

    const normalizedGender = typeof gender === "string" ? gender.toLowerCase() : "they";
    return pronouns[normalizedGender] || pronouns.they;
  },

  /** Get performance descriptor for rating 1-10 */
  getPerformanceDescriptor: function (rating) {
    const descriptors = {
      10: { level: "exceptional", attitude: "outstanding" },
      9: { level: "excellent", attitude: "exemplary" },
      8: { level: "very strong", attitude: "enthusiastic" },
      7: { level: "strong", attitude: "positive" },
      6: { level: "good", attitude: "cooperative" },
      5: { level: "satisfactory", attitude: "willing" },
      4: { level: "developing", attitude: "engaged" },
      3: { level: "basic", attitude: "participative" },
      2: { level: "beginning", attitude: "responsive" },
      1: { level: "emerging", attitude: "guided" },
    };

    return descriptors[rating] || descriptors[5];
  },

  /** Process text list from comma-separated string */
  processTextList: function (text) {
    if (!text) return [];
    if (Array.isArray(text)) {
      return text.map((item) => String(item).trim()).filter(Boolean);
    }
    if (typeof text !== "string") return [];
    return text.split(",").map((item) => item.trim()).filter(Boolean);
  },

  /** Ensure student name appears appropriately throughout comment */
  ensureNameUsage: function (text, studentName) {
    if (!studentName || !text) return text;

    const sentences = text.split(/(?<=[.!?])\s+/);
    const safeName = studentName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    let nameCount = (text.match(new RegExp(safeName, "gi")) || []).length;
    const targetNameUsage = Math.max(3, Math.floor(sentences.length / 3));

    if (nameCount < targetNameUsage) {
      for (
        let i = 1;
        i < sentences.length && nameCount < targetNameUsage;
        i += 2
      ) {
        if (!sentences[i].includes(studentName)) {
          sentences[i] = sentences[i].replace(
            /^(He|She|They)\s/,
            `${studentName} `,
          );
          nameCount++;
        }
      }
    }

    return sentences.join(" ");
  },
};

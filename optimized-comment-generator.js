/**
 * Optimized Comment Generator - Compatibility bridge to PremiumCommentEngine
 * Provides backward compatibility and enhanced integration with existing systems
 */

class OptimizedCommentGenerator {
  constructor() {
    this.engine = null;
    this.isInitialized = false;
    this.fallbackMode = false;

    // Engine assets are loaded on-demand (code-splitting for static builds)
    this._engineLoadAttempted = false;

    this.init();
  }

  init() {
    try {
      // Prefer the Enhanced engine if it is already present.
      // Otherwise, we stay unbound and lazy-load engines only when needed.
      if (typeof EnhancedCommentEngine !== "undefined") {
        this.engine = new EnhancedCommentEngine();
        console.log(
          "OptimizedCommentGenerator initialized with EnhancedCommentEngine"
        );
      } else if (typeof PremiumCommentEngine !== "undefined") {
        this.engine = new PremiumCommentEngine();
        console.log(
          "OptimizedCommentGenerator initialized with PremiumCommentEngine (fallback)"
        );
      } else {
        console.log(
          "OptimizedCommentGenerator initialized (engines will lazy-load on demand)"
        );
      }

      this.isInitialized = true;
    } catch (error) {
      console.error("Failed to initialize OptimizedCommentGenerator:", error);
      this.engine = null;
      this.fallbackMode = false;
      this.isInitialized = true;
    }
  }

  initializeFallback() {
    this.isInitialized = true;
    console.log("OptimizedCommentGenerator initialized in fallback mode");
  }

  /**
   * Generate comments from localStorage data
   * Now returns a Promise to support async engines
   */
  async generateFromStorage() {
    try {
      const sessionData = this.collectSessionData();
      return await this.generateComments(sessionData);
    } catch (error) {
      console.error("Failed to generate comments from storage:", error);
      return this.generateErrorComments(error.message);
    }
  }

  /**
   * Generate comments from provided session data
   * Now returns a Promise to support async engines
   */
  async generateComments(sessionData) {
    if (!this.isInitialized) {
      throw new Error("OptimizedCommentGenerator not initialized");
    }

    await this.ensureEngineReady();

    // Validate session data
    const validatedData = this.validateAndCleanSessionData(sessionData);

    if (this.fallbackMode) {
      return this.generateFallbackComments(validatedData);
    }

    try {
      // Both engines now return Promises
      return await this.engine.generateComments(validatedData);
    } catch (error) {
      console.error("Engine failed, using fallback:", error);
      return this.generateFallbackComments(validatedData);
    }
  }

  /**
   * Ensure an engine is available.
   * Lazily loads Enhanced engine assets (preferred) and falls back to Premium.
   */
  async ensureEngineReady() {
    if (this.engine) return;
    if (this.fallbackMode) return;

    // Prevent repeated attempts within a single page session.
    if (this._engineLoadAttempted) {
      this.fallbackMode = true;
      return;
    }
    this._engineLoadAttempted = true;

    // TODO: [OPTIMIZATION] Consider preloading engine scripts on idle after first interaction.
    try {
      // 1) Try Enhanced Engine (preferred)
      if (typeof EnhancedCommentEngine === "undefined") {
        await this.loadEnhancedEngineAssets();
      }
      if (typeof EnhancedCommentEngine !== "undefined") {
        this.engine = new EnhancedCommentEngine();
        return;
      }

      // 2) Try Premium Engine as fallback
      if (typeof PremiumCommentEngine === "undefined") {
        await this.loadPremiumEngineAssets();
      }
      if (typeof PremiumCommentEngine !== "undefined") {
        this.engine = new PremiumCommentEngine();
        return;
      }

      // 3) No engines -> fallback mode
      this.fallbackMode = true;
    } catch (error) {
      console.error("Failed to lazy-load engines:", error);
      this.fallbackMode = true;
    }
  }

  async loadEnhancedEngineAssets() {
    if (typeof ScriptLoader === "undefined") {
      throw new Error(
        "ScriptLoader is not available; cannot lazy-load engine assets"
      );
    }

    // Keep ordering stable: utils -> processor -> templates -> core
    // Engine data and synonym manager are optional but strongly recommended.
    await ScriptLoader.loadSequential([
      "assets/js/data/engine-data.js",
      "assets/js/synonym-manager.js",
      "assets/js/engine/utils.js",
      "assets/js/engine/processor.js",
      "assets/js/engine/templates.js",
      "assets/js/engine/core.js",
    ]);
  }

  async loadPremiumEngineAssets() {
    if (typeof ScriptLoader === "undefined") {
      throw new Error(
        "ScriptLoader is not available; cannot lazy-load engine assets"
      );
    }

    await ScriptLoader.loadSequential(["assets/js/comment-engine.js"]);
  }

  /**
   * Collect session data from localStorage and form elements
   */
  collectSessionData() {
    // Get student data from localStorage
    const studentDataStr = localStorage.getItem("studentData");
    console.log("📦 Raw localStorage studentData:", studentDataStr);

    const studentData = studentDataStr ? JSON.parse(studentDataStr) : {};
    console.log("📊 Parsed studentData:", studentData);
    console.log("📊 studentData.studentName:", studentData.studentName);
    console.log("📊 studentData.gender:", studentData.gender);

    // Get selected subjects
    const selectedSubjects = this.getSelectedSubjects();
    const topicRatings = this.getTopicRatings();

    // Combine all data
    console.log(
      "📊 ⭐ Raw overallAttributes from localStorage:",
      studentData.overallAttributes,
      "Type:",
      typeof studentData.overallAttributes
    );
    const parsedRating = parseInt(studentData.overallAttributes);
    console.log(
      "📊 ⭐ After parseInt:",
      parsedRating,
      "Type:",
      typeof parsedRating,
      "isNaN:",
      isNaN(parsedRating)
    );
    // Use parsed rating if it's a valid number, otherwise default to 5
    const finalRating =
      isNaN(parsedRating) || parsedRating < 1 || parsedRating > 10
        ? 5
        : parsedRating;
    console.log(
      "📊 ⭐ Final rating (validated, defaults to 5 if invalid):",
      finalRating
    );

    const sessionData = {
      studentName: studentData.studentName || "",
      gender: studentData.gender || "they",
      overallRating: finalRating,
      strengths: studentData.strengths || "",
      weaknesses: studentData.weaknesses || "",
      subjects: selectedSubjects,
      topicRatings: topicRatings,
    };

    console.log("✅ Collected session data:", sessionData);
    console.log("✅ Final studentName value:", sessionData.studentName);
    console.log("✅ ⭐ Final overallRating value:", sessionData.overallRating);
    return sessionData;
  }

  /**
   * Get selected subjects from form
   */
  getSelectedSubjects() {
    const subjects = [];
    const subjectCheckboxes = document.querySelectorAll(
      ".subject-checkbox:checked"
    );

    subjectCheckboxes.forEach((checkbox) => {
      if (checkbox.value) {
        subjects.push(checkbox.value);
      }
    });

    // Fallback to localStorage if no form elements found
    if (subjects.length === 0) {
      const storedSubjects = localStorage.getItem("selectedSubjects");
      if (storedSubjects) {
        try {
          return JSON.parse(storedSubjects);
        } catch (error) {
          console.warn("Failed to parse stored subjects:", error);
        }
      }
    }

    return subjects;
  }

  /**
   * Get topic ratings from form
   */
  getTopicRatings() {
    const ratings = {};
    const topicCheckboxes = document.querySelectorAll(
      ".topic-checkbox:checked"
    );

    topicCheckboxes.forEach((checkbox) => {
      if (checkbox.value) {
        // Default rating of 5 for selected topics
        ratings[checkbox.value] = 5;
      }
    });

    return ratings;
  }

  /**
   * Validate and clean session data
   */
  validateAndCleanSessionData(sessionData) {
    console.log("🔍 ⭐ validateAndCleanSessionData - INPUT:", sessionData);
    console.log(
      "🔍 ⭐ Input overallRating:",
      sessionData.overallRating,
      "Type:",
      typeof sessionData.overallRating
    );

    const cleaned = { ...sessionData };

    // Ensure required fields
    if (!cleaned.studentName || cleaned.studentName.trim() === "") {
      throw new Error("Student name is required for comment generation");
    }

    // Clean and validate student name
    cleaned.studentName = cleaned.studentName.trim();

    // Validate gender
    const validGenders = ["he", "she", "they"];
    if (!validGenders.includes(cleaned.gender.toLowerCase())) {
      console.warn('Invalid gender, defaulting to "they"');
      cleaned.gender = "they";
    }

    // Ensure rating is within valid range
    console.log(
      "🔍 ⭐ Rating validation - value:",
      cleaned.overallRating,
      "Type:",
      typeof cleaned.overallRating
    );
    console.log(
      "🔍 ⭐ Is < 1?",
      cleaned.overallRating < 1,
      "Is > 10?",
      cleaned.overallRating > 10
    );
    console.log(
      "🔍 ⭐ Is NaN?",
      isNaN(cleaned.overallRating),
      "Is undefined?",
      cleaned.overallRating === undefined
    );

    if (
      isNaN(cleaned.overallRating) ||
      cleaned.overallRating < 1 ||
      cleaned.overallRating > 10
    ) {
      console.warn(
        "⚠️ ⭐ Invalid rating detected! Value:",
        cleaned.overallRating,
        "- Defaulting to 5"
      );
      cleaned.overallRating = 5;
    } else {
      console.log(
        "✅ ⭐ Rating validation PASSED - using value:",
        cleaned.overallRating
      );
    }

    // Ensure arrays exist
    cleaned.subjects = cleaned.subjects || [];
    cleaned.topicRatings = cleaned.topicRatings || {};

    // Clean text fields
    cleaned.strengths = (cleaned.strengths || "").trim();
    cleaned.weaknesses = (cleaned.weaknesses || "").trim();

    return cleaned;
  }

  /**
   * Generate fallback comments when main engine is unavailable
   */
  generateFallbackComments(sessionData) {
    const name = sessionData.studentName;
    const pronoun = this.getPronounSet(sessionData.gender);
    const performance = this.getPerformanceDescriptor(
      sessionData.overallRating
    );

    const maleComment = this.generateMaleFallbackComment(
      name,
      pronoun,
      performance,
      sessionData
    );
    const femaleComment = this.generateFemaleFallbackComment(
      name,
      pronoun,
      performance,
      sessionData
    );

    return {
      male: maleComment,
      female: femaleComment,
      wordCount: {
        male: this.getWordCount(maleComment),
        female: this.getWordCount(femaleComment),
      },
    };
  }

  generateMaleFallbackComment(name, pronoun, performance, data) {
    let comment = `${name} has demonstrated ${performance.level} performance this term, showing consistent progress across multiple learning areas. `;

    if (data.strengths) {
      const strengths = this.processTextList(data.strengths);
      comment += `${pronoun.subject} particularly excels in ${this.naturalJoin(
        strengths
      )}, displaying strong capabilities and understanding. `;
    }

    if (data.subjects && data.subjects.length > 0) {
      comment += `In ${this.naturalJoin(
        data.subjects
      )}, ${name} has shown steady progress and engagement with the curriculum. `;
    }

    comment += `${pronoun.subject} maintains positive behavior in the classroom and works well with peers. `;

    if (data.weaknesses) {
      const weaknesses = this.processTextList(data.weaknesses);
      comment += `With continued support in ${this.naturalJoin(
        weaknesses
      )}, ${name} will continue to develop these important skills. `;
    }

    comment += `${name} is well-prepared for continued academic growth and shows excellent potential for future success.`;

    return comment;
  }

  generateFemaleFallbackComment(name, pronoun, performance, data) {
    let comment = `${name} has blossomed beautifully this term, bringing joy and enthusiasm to our classroom community. `;

    if (data.strengths) {
      const strengths = this.processTextList(data.strengths);
      comment += `${pronoun.subject} shines particularly in ${this.naturalJoin(
        strengths
      )}, displaying wonderful natural abilities. `;
    }

    if (data.subjects && data.subjects.length > 0) {
      comment += `In ${this.naturalJoin(
        data.subjects
      )}, ${name} has shown delightful progress and genuine curiosity. `;
    }

    comment += `${pronoun.subject} brings warmth and kindness to all classroom interactions and is a treasured member of our learning community. `;

    if (data.weaknesses) {
      const weaknesses = this.processTextList(data.weaknesses);
      comment += `With gentle encouragement in ${this.naturalJoin(
        weaknesses
      )}, ${name} will continue to flourish and grow. `;
    }

    comment += `${name} is ready for wonderful new adventures in learning and shows beautiful potential for continued success.`;

    return comment;
  }

  /**
   * Get pronoun set for gender
   */
  getPronounSet(gender) {
    const pronouns = {
      he: { subject: "He", object: "him", possessive: "his" },
      she: { subject: "She", object: "her", possessive: "her" },
      they: { subject: "They", object: "them", possessive: "their" },
    };

    return pronouns[gender.toLowerCase()] || pronouns.they;
  }

  /**
   * Get performance descriptor
   */
  getPerformanceDescriptor(rating) {
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
  }

  /**
   * Process text list from comma-separated string
   */
  processTextList(text) {
    if (!text || typeof text !== "string") return [];
    return text
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  /**
   * Natural language joining
   */
  naturalJoin(arr, conjunction = "and") {
    if (!arr || arr.length === 0) return "";
    if (arr.length === 1) return arr[0];
    if (arr.length === 2) return `${arr[0]} ${conjunction} ${arr[1]}`;
    return `${arr.slice(0, -1).join(", ")}, ${conjunction} ${arr.slice(-1)}`;
  }

  /**
   * Get word count
   */
  getWordCount(text) {
    if (!text) return 0;
    return text
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
  }

  /**
   * Generate error comments when generation fails
   */
  generateErrorComments(errorMessage) {
    const errorComment = `Unable to generate personalized comments due to a technical issue: ${errorMessage}. Please ensure all required information is provided and try again.`;

    return {
      male: errorComment,
      female: errorComment,
      wordCount: {
        male: this.getWordCount(errorComment),
        female: this.getWordCount(errorComment),
      },
    };
  }

  /**
   * Test comment generation with sample data
   */
  testGeneration() {
    const testData = {
      studentName: "Test Student",
      gender: "they",
      overallRating: 7,
      strengths: "creative thinking, problem solving",
      weaknesses: "fine motor skills",
      subjects: ["Mathematics", "English"],
      topicRatings: {
        "counting to 10": 5,
        "letter recognition": 4,
      },
    };

    console.log("Testing comment generation with sample data...");
    const result = this.generateComments(testData);
    console.log("Test result:", result);
    return result;
  }
}

// Initialize and expose globally
window.OptimizedCommentGenerator = OptimizedCommentGenerator;

// Create global instance
window.commentGenerator = new OptimizedCommentGenerator();

// Backward compatibility functions
window.generateCommentsFromStorage = function () {
  return window.commentGenerator.generateFromStorage();
};

window.testCommentGeneration = function () {
  return window.commentGenerator.testGeneration();
};

// Auto-initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  // Ensure the generator is ready
  if (!window.commentGenerator.isInitialized) {
    window.commentGenerator.init();
  }

  console.log("OptimizedCommentGenerator ready for use");
});

console.log("Optimized Comment Generator loaded successfully");

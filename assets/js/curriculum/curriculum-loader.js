/**
 * Curriculum Loader Utility
 * Teachers Pet - Dynamic Curriculum Loading System
 *
 * Loads curriculum data based on selected grade and month.
 * Handles missing curriculum files with graceful fallbacks.
 * @class CurriculumLoader
 */

export default class CurriculumLoader {
  constructor() {
    this.loadedCurriculum = null;
    this.currentGrade = "";
    this.currentMonth = "";
  }

  /**
   * Load curriculum for a specific grade and month
   * @param {string} grade - Grade level (K1, K2, K3)
   * @param {string} month - Month name (August, September, etc.)
   * @returns {Promise} Resolves with curriculum data or rejects with error
   */
  async load(grade, month) {
    if (!grade || !month) {
      throw new Error("Grade and month are required");
    }

    this.currentGrade = grade;
    this.currentMonth = month;

    // Construct curriculum file path
    const gradeFolder = grade.toLowerCase();
    const monthFile = month.toLowerCase();
    const curriculumPath = `assets/data/curriculum/${gradeFolder}/${monthFile}.json`;

    console.log(`📚 Loading curriculum: ${grade} - ${month}`);
    console.log(`📂 Path: ${curriculumPath}`);

    try {
      const response = await fetch(curriculumPath);
      
      if (!response.ok) {
        throw new Error(`Failed to load curriculum file: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      // Validate data structure
      if (data && data.subjects) {
        this.loadedCurriculum = data;
        console.log(
          `✅ Curriculum loaded: ${this.loadedCurriculum.subjects.length} subjects`
        );
        return this.loadedCurriculum;
      } else {
        throw new Error(`Invalid curriculum data structure for ${grade} ${month}`);
      }
    } catch (error) {
      console.error("❌", error.message);
      throw error;
    }
  }

  /**
   * Get the currently loaded curriculum
   * @returns {Object|null} Current curriculum data or null if not loaded
   */
  getCurrent() {
    return this.loadedCurriculum;
  }

  /**
   * Check if a curriculum is available (file exists)
   * Note: This is a basic check - actual availability should be managed in availableMonths config
   * @param {string} grade - Grade level
   * @param {string} month - Month name
   * @returns {boolean} True if curriculum is available
   */
  isAvailable(grade, month) {
    const availableList = {
      K1: ["August", "November", "December"],
      K2: ["November", "December"],
      K3: [],
    };

    return (
      availableList[grade] &&
      availableList[grade].includes(month)
    );
  }

  /**
   * Get list of available months for a grade
   * @param {string} grade - Grade level
   * @returns {Array} List of available months
   */
  getAvailableMonths(grade) {
    const availableList = {
      K1: ["August", "November", "December"],
      K2: ["November", "December"],
      K3: [],
    };

    return availableList[grade] || [];
  }

  /**
   * Clear loaded curriculum data
   */
  clear() {
    this.loadedCurriculum = null;
    this.currentGrade = "";
    this.currentMonth = "";
    console.log("🧹 Curriculum data cleared");
  }
}


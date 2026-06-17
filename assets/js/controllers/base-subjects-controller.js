import CurriculumLoader from "../curriculum/curriculum-loader.js";
import { TeachersPetUtils } from "../engine/utils.js";
import { escapeHtml } from "../utils/security.js";

/**
 * Base Subjects Controller
 * Contains shared logic for SubjectsController (K1/K2) and P2SubjectsController
 * @class BaseSubjectsController
 */
export class BaseSubjectsController {
  constructor(app) {
    this.app = app;
    this.curriculumLoader = new CurriculumLoader();
    this.subjectsContainer = null;
    this.selectionSummary = null;
    this.generateBtn = null;
    this.gradeMonthDisplay = null;
  }

  async init() {
    this.cacheElements();
    this.loadSessionDataFromURL();
    await this.loadAndRenderCurriculum();
    this.setupSubjectInteractions();
    this.setupBulkActions();
    this.setupCommentGeneration();
    this.updateSelectionSummary();
    this.updateGenerateButton();
  }

  /**
   * Override in subclass: cache page-specific DOM elements
   */
  cacheElements() {
    throw new Error("cacheElements() must be implemented by subclass");
  }

  /**
   * Override in subclass: return default grade/month for fallbacks
   * @returns {{grade: string, month: string}}
   */
  getGradeMonthDefaults() {
    return { grade: "", month: "" };
  }

  /**
   * Override in subclass: return HTML template for subject section
   * @param {Object} _subject - Subject data
   * @param {string} _subjectId - Sanitized subject ID
   * @returns {string} HTML template string
   */
  getSubjectTemplate(_subject, _subjectId) {
    throw new Error("getSubjectTemplate() must be implemented by subclass");
  }

  /**
   * Override in subclass: return HTML template for topic item
   * @param {Object} _topic - Topic data
   * @param {string} _subjectId - Sanitized subject ID
   * @param {string} _topicId - Sanitized topic ID
   * @returns {string} HTML template string
   */
  getTopicTemplate(_topic, _subjectId, _topicId) {
    throw new Error("getTopicTemplate() must be implemented by subclass");
  }

  /**
   * Override in subclass: return CSS selector for subject sections
   * @returns {string}
   */
  getSubjectSelector() {
    return ".subject-section";
  }

  /**
   * Override in subclass: return CSS selector for topic checkboxes
   * @returns {string}
   */
  getTopicSelector() {
    return ".topic-checkbox";
  }

  /**
   * Override in subclass: additional interaction setup (e.g., star ratings for P2)
   */
  setupAdditionalInteractions() {
    // Default: no additional interactions
  }

  // ============================================
  // SHARED IMPLEMENTATIONS
  // ============================================

  /**
   * Load session data from URL parameters and localStorage
   */
  loadSessionDataFromURL() {
    const params = new URLSearchParams(window.location.search);
    const sessionData = this.app.sessionData;
    const defaults = this.getGradeMonthDefaults();

    // Restore student info from URL
    if (params.has("studentName")) {
      sessionData.studentName = params.get("studentName");
      sessionData.gender = params.get("gender");
      sessionData.overallRating = parseInt(params.get("overallRating"));
      sessionData.strengths = params.get("strengths");
      sessionData.weaknesses = params.get("weaknesses");
    }

    // Load grade and month from URL for curriculum loading
    if (params.has("grade")) {
      sessionData.grade = params.get("grade");
    }
    if (params.has("month")) {
      sessionData.month = params.get("month");
    }

    // Fallback to localStorage for grade/month
    if (!sessionData.grade || !sessionData.month) {
      try {
        const saved = localStorage.getItem("studentData");
        if (saved) {
          const data = JSON.parse(saved);
          sessionData.grade = sessionData.grade || data.grade || defaults.grade;
          sessionData.month = sessionData.month || data.month || defaults.month;
        }
      } catch (e) {
        console.warn("Could not load grade/month from localStorage:", e);
      }
    }

    // Ensure arrays/objects are initialized
    sessionData.subjects = sessionData.subjects || [];
    sessionData.topicRatings = sessionData.topicRatings || {};
  }

  /**
   * Load curriculum and render subjects
   */
  async loadAndRenderCurriculum() {
    const { grade, month } = this.app.sessionData;

    if (!grade || !month) {
      console.warn("Grade or month not available, using hardcoded topics");
      return;
    }

    try {
      if (this.app.showLoader) this.app.showLoader();

      const curriculum = await this.curriculumLoader.load(grade, month);
      this.renderSubjects(curriculum.subjects);
    } catch (error) {
      console.error("Failed to load curriculum:", error);
      if (this.app.notify) {
        this.app.notify("Failed to load curriculum. Using available topics.", "warning");
      }
    } finally {
      if (this.app.hideLoader) this.app.hideLoader();
    }
  }

  /**
   * Render subjects from curriculum data
   * @param {Array} subjects - Array of subject objects
   */
  renderSubjects(subjects) {
    if (!this.subjectsContainer) return;

    this.subjectsContainer.innerHTML = "";
    const fragment = document.createDocumentFragment();

    subjects.forEach((subject) => {
      fragment.appendChild(this.createSubjectElement(subject));
    });

    this.subjectsContainer.appendChild(fragment);
    this.bindSubjectEvents();
  }

  /**
   * Create DOM element for a subject
   * @param {Object} subject
   * @returns {HTMLElement}
   */
  createSubjectElement(subject) {
    const subjectId = subject.id || subject.name.toLowerCase().replace(/\s+/g, "-");
    const section = document.createElement("div");
    section.className = "subject-section";
    section.setAttribute("data-subject", escapeHtml(subjectId));

    const topicsFragment = document.createDocumentFragment();
    subject.topics.forEach((topic) => {
      const topicId = `${subjectId}-${topic.id || topic.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
      topicsFragment.appendChild(this.createTopicElement(topic, subjectId, topicId));
    });

    section.innerHTML = this.getSubjectTemplate(subject, subjectId);

    // Find the content container - subclasses should use consistent structure
    const _contentDiv = section.querySelector(".subject-content, .subject-topics");
    if (_contentDiv) {
      _contentDiv.appendChild(topicsFragment);
    }

    return section;
  }

  /**
   * Create DOM element for a topic
   * @param {Object} topic
   * @param {string} subjectId
   * @param {string} topicId
   * @returns {HTMLElement}
   */
  createTopicElement(topic, subjectId, topicId) {
    const _topicName = topic.name || topic;
    const label = document.createElement("label");
    label.className = "topic-item";
    label.setAttribute("data-topic-id", escapeHtml(topicId));
    label.innerHTML = this.getTopicTemplate(topic, subjectId, topicId);
    return label;
  }

  /**
   * Bind events for subject accordion and topic checkboxes
   */
  bindSubjectEvents() {
    const subjectSections = document.querySelectorAll(this.getSubjectSelector());

    subjectSections.forEach((section) => {
      const header = section.querySelector(".subject-header, h3.subject-title");
      const content = section.querySelector(".subject-content, .subject-topics");
      const arrow = section.querySelector(".dropdown-arrow, .subject-toggle");

      if (header && content && arrow) {
        header.addEventListener("click", (e) => {
          if (e.target.tagName === "INPUT") return;
          const isExpanded = content.classList.contains("active");

          subjectSections.forEach((otherSection) => {
            if (otherSection !== section) {
              otherSection.querySelector(".subject-content, .subject-topics")?.classList.remove("active");
              otherSection.querySelector(".dropdown-arrow, .subject-toggle")?.classList.remove("rotated");
              otherSection.classList.remove("expanded");
            }
          });

          content.classList.toggle("active", !isExpanded);
          arrow.classList.toggle("rotated", !isExpanded);
          section.classList.toggle("expanded", !isExpanded);
        });
      }

      // Setup topic checkboxes
      const topics = section.querySelectorAll(this.getTopicSelector());
      topics.forEach((_topicElement) => this.setupTopicInteraction(_topicElement));
    });

    // Allow subclass to add additional interactions (e.g., star ratings)
    this.setupAdditionalInteractions();
  }

  /**
   * Setup topic checkbox interaction
   * @param {HTMLInputElement} topicElement
   */
  setupTopicInteraction(topicElement) {
    const _topicName = topicElement.value;

    topicElement.addEventListener("change", () => {
      if (topicElement.checked) {
        if (!this.app.sessionData.subjects.includes(topicName)) {
          this.app.sessionData.subjects.push(topicName);
        }
      } else {
        const index = this.app.sessionData.subjects.indexOf(topicName);
        if (index > -1) {
          this.app.sessionData.subjects.splice(index, 1);
        }
        delete this.app.sessionData.topicRatings[topicName];
      }
      this.updateSelectionSummary();
      this.updateGenerateButton();
    });
  }

  /**
   * Setup bulk actions (override in SubjectsController)
   */
  setupBulkActions() {
    // Default: no bulk actions
  }

  /**
   * Update selection summary display
   */
  updateSelectionSummary() {
    if (!this.selectionSummary) return;

    const selectedCount = this.app.sessionData.subjects.length;
    const ratedCount = Object.keys(this.app.sessionData.topicRatings).length;

    if (ratedCount > 0) {
      this.selectionSummary.textContent = `${selectedCount} topics selected, ${ratedCount} rated`;
    } else {
      this.selectionSummary.textContent = `Selected Topics: ${selectedCount}`;
    }
  }

  /**
   * Update generate button state (override in P2SubjectsController)
   */
  updateGenerateButton() {
    if (!this.generateBtn) return;
    const hasSubjects = this.app.sessionData.subjects.length > 0;
    this.generateBtn.disabled = !hasSubjects;
  }

  /**
   * Setup comment generation button handler
   */
  setupCommentGeneration() {
    if (!this.generateBtn) return;

    this.generateBtn.addEventListener("click", () => {
      if (this.app.sessionData.subjects.length === 0) {
        this.app.showNotification("Please select at least one topic before generating comments.", "warning");
        return;
      }
      this.generateComments();
    });
  }

  /**
   * Generate comments - override in subclass for different data collection
   */
  async generateComments() {
    this.app.showLoadingOverlay("Generating premium comments...");

    setTimeout(async () => {
      try {
        const { OptimizedCommentGenerator } = await import("../optimized-comment-generator.js");
        const generator = new OptimizedCommentGenerator();
        const comments = await generator.generateComments(this.app.sessionData);
        this.displayComments(comments);
      } catch (error) {
        console.error("Comment generation failed:", error);
        this.app.showNotification("Failed to generate comments. Please try again.", "error");
      } finally {
        this.app.hideLoadingOverlay();
      }
    }, 2000);
  }

  /**
   * Display generated comments - override in subclass for different UI
   */
  displayComments(comments) {
    const generatedComments = document.getElementById("generatedComments");
    const commentText1 = document.getElementById("commentText1");
    const commentText2 = document.getElementById("commentText2");
    const wordCount1 = document.getElementById("wordCount1");
    const wordCount2 = document.getElementById("wordCount2");
    const comment1 = document.getElementById("comment1");

    if (commentText1 && comments.male) {
      commentText1.textContent = comments.male;
    }
    if (commentText2 && comments.female) {
      commentText2.textContent = comments.female;
    }

    if (wordCount1 && comments.male) {
      wordCount1.textContent = `(${TeachersPetUtils.getWordCount(comments.male)} words)`;
    }
    if (wordCount2 && comments.female) {
      wordCount2.textContent = `(${TeachersPetUtils.getWordCount(comments.female)} words)`;
    }

    if (generatedComments) {
      generatedComments.classList.remove("display-none");
      generatedComments.style.display = "block";
    }

    if (comment1) {
      comment1.classList.add("selected");
    }

    const generateBtn = document.getElementById("generateBtn");
    if (generateBtn) {
      generateBtn.textContent = "🔄 Generate New Comments";
    }

    this.app.hideLoadingOverlay();
    this.app.showNotification("Comments generated successfully!", "success");
  }
}
import { BaseSubjectsController } from "./base-subjects-controller.js";
import { OptimizedCommentGenerator } from "../optimized-comment-generator.js";
import { TeachersPetUtils } from "../engine/utils.js";

export class SubjectsController extends BaseSubjectsController {
  constructor(app) {
    super(app);
  }

  cacheElements() {
    this.subjectsContainer = document.getElementById("subjectsForm");
    this.selectionSummary = document.getElementById("selectionCount");
    this.generateBtn = document.getElementById("generateBtn");
    this.gradeMonthDisplay = document.getElementById("curriculumTracker");
  }

  getGradeMonthDefaults() {
    return { grade: "K1", month: "August" };
  }

  getSubjectSelector() {
    return ".subject-section";
  }

  getTopicSelector() {
    return ".topic-checkbox";
  }

  getSubjectTemplate(subject, subjectId) {
    return `
      <div class="subject-header" data-subject="${this.escapeHtml(subjectId)}">
        <div class="subject-title">
          <input type="checkbox" class="subject-checkbox" id="subject_${this.escapeHtml(subjectId)}" value="${this.escapeHtml(subject.name)}"
            onchange="app.controllers.subjects.handleSubjectCheck('${this.escapeHtml(subjectId)}')">
          <label for="subject_${this.escapeHtml(subjectId)}">${this.escapeHtml(subject.name.toUpperCase())}</label>
          <span class="dropdown-hint">Click to drop down</span>
          <span class="dropdown-arrow" id="arrow_${this.escapeHtml(subjectId)}">▼</span>
        </div>
        <div class="subject-content" id="content_${this.escapeHtml(subjectId)}"></div>
      </div>
    `;
  }

  getTopicTemplate(topic, subjectId, topicId) {
    const topicName = topic.name || topic;
    return `
      <input type="checkbox" class="topic-checkbox" id="topic_${this.escapeHtml(topicId)}" value="${this.escapeHtml(topicName)}"
        data-subject="${this.escapeHtml(subjectId)}" data-topic="${this.escapeHtml(topicName)}">
      <span class="topic-text">${this.escapeHtml(topicName)}</span>
    `;
  }

  setupBulkActions() {
    // No bulk actions in Subjects.html (removed per UX request)
    // Could add programmatic select/clear all if needed
  }

  // Keep for backward compatibility with inline onclick handlers
  handleSubjectCheck(subjectId) {
    const checkbox = document.getElementById(`subject_${subjectId}`);
    if (!checkbox) return;

    const content = document.getElementById(`content_${subjectId}`);
    const arrow = document.getElementById(`arrow_${subjectId}`);
    const section = checkbox.closest(".subject-section");

    if (checkbox.checked) {
      const topicCheckboxes = content?.querySelectorAll(".topic-checkbox");
      topicCheckboxes?.forEach((topic) => {
        if (!topic.checked) {
          topic.checked = true;
          topic.dispatchEvent(new Event("change"));
        }
      });
      section?.classList.add("expanded");
      content?.classList.add("active");
      arrow?.classList.add("rotated");
    } else {
      const topicCheckboxes = content?.querySelectorAll(".topic-checkbox");
      topicCheckboxes?.forEach((topic) => {
        if (topic.checked) {
          topic.checked = false;
          topic.dispatchEvent(new Event("change"));
        }
      });
    }
  }

  async generateComments() {
    if (this.app.sessionData.subjects.length === 0) {
      this.app.showNotification("Please select at least one subject before generating comments.", "warning");
      return;
    }

    this.app.showLoadingOverlay("Generating premium comments...");

    setTimeout(async () => {
      try {
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
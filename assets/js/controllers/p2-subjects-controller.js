import { BaseSubjectsController } from "./base-subjects-controller.js";
import { TeachersPetUtils } from "../engine/utils.js";
import { OptimizedCommentGenerator } from "../optimized-comment-generator.js";

export class P2SubjectsController extends BaseSubjectsController {
  constructor(app) {
    super(app);
  }

  cacheElements() {
    this.subjectsContainer = document.getElementById("subjects-container");
    this.selectionSummary = document.getElementById("selection-summary");
    this.generateBtn = document.getElementById("generate-comments");
    this.gradeMonthDisplay = document.getElementById("current-grade-month");
  }

  getGradeMonthDefaults() {
    return { grade: "P2", month: "Semester 1" };
  }

  getSubjectSelector() {
    return ".subject-section";
  }

  getTopicSelector() {
    return ".topic-checkbox";
  }

  getSubjectTemplate(subject, subjectId) {
    const thaiName = this.getThaiSubjectName(subject.name);
    return `
      <h3 class="subject-title">
        <span class="subject-name-en">${this.escapeHtml(subject.name)}</span>
        <span class="subject-name-th">${this.escapeHtml(thaiName)}</span>
        <button class="subject-toggle" aria-expanded="false" aria-controls="${this.escapeHtml(subjectId)}-topics">▼</button>
      </h3>
      <div class="subject-topics" id="${this.escapeHtml(subjectId)}-topics" role="region"></div>
    `;
  }

  getTopicTemplate(topic, subjectId, topicId) {
    const { en, th } = this.parseTopicName(topic.name);
    return `
      <input type="checkbox"
             class="topic-checkbox"
             data-subject="${this.escapeHtml(subjectId)}"
             data-topic="${this.escapeHtml(topic.name)}"
             data-topic-id="${this.escapeHtml(topicId)}"
             data-vocab="${this.escapeHtml(topic.name)}"
             value="${this.escapeHtml(topic.name)}">
      <span class="topic-name-en">${this.escapeHtml(en)}</span>
      <span class="topic-name-th">(${this.escapeHtml(th)})</span>
      <div class="rating-stars" data-topic-id="${this.escapeHtml(topicId)}" role="group" aria-label="Rating for ${this.escapeHtml(en)}">
        ${this.renderStars(0, topicId)}
      </div>
    `;
  }

  setupAdditionalInteractions() {
    // Toggle subject accordion
    this.subjectsContainer.addEventListener("click", (e) => {
      const toggle = e.target.closest(".subject-toggle");
      if (toggle) {
        const section = toggle.closest(".subject-section");
        const expanded = section.classList.toggle("expanded");
        toggle.setAttribute("aria-expanded", expanded);
        toggle.textContent = expanded ? "▲" : "▼";
      }
    });

    // Star rating clicks
    this.subjectsContainer.addEventListener("click", (e) => {
      const star = e.target.closest(".star");
      if (star) {
        const value = parseInt(star.dataset.value);
        const topicId = star.dataset.topic;
        this.setRating(topicId, value);
      }
    });

    // Keyboard support for stars
    this.subjectsContainer.addEventListener("keydown", (e) => {
      const star = e.target.closest(".star");
      if (star && (e.key === "Enter" || e.key === " ")) {
        e.preventDefault();
        const value = parseInt(star.dataset.value);
        const topicId = star.dataset.topic;
        this.setRating(topicId, value);
      }
    });

    // Topic checkbox changes (handled by base, but we need to update P2-specific UI)
    this.subjectsContainer.addEventListener("change", (e) => {
      if (e.target.matches(".topic-checkbox")) {
        this.handleTopicCheckboxChange(e.target);
        this.updateSelectionSummary();
        this.updateGenerateButton();
      }
    });
  }

  parseTopicName(name) {
    const match = name.match(/^(.+?)\s*\((.+?)\)$/);
    if (match) {
      return { en: match[1].trim(), th: match[2].trim() };
    }
    return { en: name.trim(), th: "" };
  }

  getThaiSubjectName(englishName) {
    const thaiNames = {
      "Thai Language": "ไทย",
      "Mathematics": "คณิตศาสตร์",
      "Science": "วิทยาศาสตร์",
      "Social Studies": "สังคมศึกษา",
      "English": "อังกฤษ",
      "Arts": "ศิลปะ",
      "Health & Physical Education": "สุขศึกษา",
      "Computing": "คอมพิวเตอร์",
    };
    return thaiNames[englishName] || "";
  }

  renderStars(value, topicId) {
    return Array.from({ length: 5 }, (_, i) =>
      `<span class="star ${i < value ? "filled" : ""}" data-value="${i + 1}" data-topic="${topicId}" role="button" tabindex="0" aria-label="${i + 1} star${i + 1 === value ? " (selected)" : ""}">★</span>`
    ).join("");
  }

  updateGradeMonthDisplay(grade, month) {
    if (this.gradeMonthDisplay) {
      const semesterLabel = month === "Semester 1" ? "Semester 1 (May–Sep)" : "Semester 2 (Nov–Mar)";
      this.gradeMonthDisplay.textContent = `Current: ${grade} · ${semesterLabel}`;
    }
  }

  handleTopicCheckboxChange(checkbox) {
    const topicId = checkbox.dataset.topicId;
    const topicName = checkbox.value;

    if (checkbox.checked) {
      if (!this.app.sessionData.subjects.includes(topicName)) {
        this.app.sessionData.subjects.push(topicName);
      }
      document.querySelectorAll(`.star[data-topic="${topicId}"]`).forEach((star) => {
        star.style.pointerEvents = "auto";
        star.style.opacity = "1";
      });
    } else {
      const index = this.app.sessionData.subjects.indexOf(topicName);
      if (index > -1) {
        this.app.sessionData.subjects.splice(index, 1);
      }
      delete this.app.sessionData.topicRatings[topicName];
      document.querySelectorAll(`.star[data-topic="${topicId}"]`).forEach((star) => {
        star.classList.remove("filled");
        star.style.pointerEvents = "none";
        star.style.opacity = "0.3";
      });
    }
  }

  setRating(topicId, value) {
    const stars = document.querySelectorAll(`.star[data-topic="${topicId}"]`);
    stars.forEach((star, i) => {
      star.classList.toggle("filled", i < value);
    });

    const checkbox = document.querySelector(`.topic-checkbox[data-topic-id="${topicId}"]`);
    if (checkbox) {
      checkbox.checked = value > 0;
      if (value > 0) {
        this.handleTopicCheckboxChange(checkbox);
      } else {
        this.handleTopicCheckboxChange(checkbox);
      }
    }

    if (checkbox) {
      const topicName = checkbox.value;
      this.app.sessionData.topicRatings[topicName] = value;
    }

    this.updateSelectionSummary();
    this.updateGenerateButton();
  }

  updateSelectionSummary() {
    const selectedCount = this.app.sessionData.subjects.length;
    const ratedCount = Object.keys(this.app.sessionData.topicRatings).length;

    if (this.selectionSummary) {
      this.selectionSummary.textContent = `${selectedCount} topics selected, ${ratedCount} rated`;
    }
  }

  updateGenerateButton() {
    const hasRated = Object.keys(this.app.sessionData.topicRatings).length > 0;
    if (this.generateBtn) {
      this.generateBtn.disabled = !hasRated;
    }
  }

  // Alias for test compatibility - base class calls this via setupSubjectInteractions
  setupSubjectInteractions() {
    this.setupAdditionalInteractions();
  }

  async generateComments() {
    if (this.app.sessionData.subjects.length === 0) {
      if (this.app.notify) this.app.notify("Please select at least one topic before generating comments.", "warning");
      return;
    }

    if (this.app.showLoader) this.app.showLoader("Generating comments...");

    try {
      const generator = new OptimizedCommentGenerator();
      const selections = this.collectSelections();
      const comments = await generator.generateComments(selections);

      if (this.app.notify) this.app.notify("Comments generated successfully!", "success");
      this.displayComments(comments);
    } catch (error) {
      console.error("Comment generation failed:", error);
      if (this.app.notify) this.app.notify("Failed to generate comments. Please try again.", "error");
    } finally {
      if (this.app.hideLoader) this.app.hideLoader();
    }
  }

  collectSelections() {
    const selections = [];

    document.querySelectorAll(".topic-checkbox:checked").forEach((cb) => {
      const topicId = cb.dataset.topicId;
      const stars = document.querySelectorAll(`.star[data-topic="${topicId}"].filled`).length;
      selections.push({
        subject: cb.dataset.subject,
        topic: cb.dataset.topic,
        vocab: 10,
        rating: stars,
      });
    });

    return {
      grade: this.app.sessionData.grade,
      month: this.app.sessionData.month,
      studentName: this.app.sessionData.studentName || "Student",
      gender: this.app.sessionData.gender || "they",
      overallRating: this.app.sessionData.overallRating || 5,
      strengths: this.app.sessionData.strengths || [],
      weaknesses: this.app.sessionData.weaknesses || [],
      selections: selections,
    };
  }

  displayComments(comments) {
    const maleText = comments.male || comments;
    const femaleText = comments.female || comments;
    const maleWordCount = TeachersPetUtils.getWordCount(maleText);
    const femaleWordCount = TeachersPetUtils.getWordCount(femaleText);

    const overlay = document.createElement("div");
    overlay.id = "commentsOverlay";
    overlay.className = "comments-overlay";

    const container = document.createElement("div");
    container.className = "comments-container";

    const header = document.createElement("div");
    header.className = "comments-header";
    const h2 = document.createElement("h2");
    h2.textContent = "Generated Comments";
    const closeBtn = document.createElement("button");
    closeBtn.className = "close-comments";
    closeBtn.textContent = "×";
    closeBtn.addEventListener("click", () => overlay.remove());
    header.appendChild(h2);
    header.appendChild(closeBtn);

    const content = document.createElement("div");
    content.className = "comments-content";

    const maleSection = document.createElement("div");
    maleSection.className = "comment-section";
    const maleH3 = document.createElement("h3");
    maleH3.textContent = "Male Teacher Style";
    const maleTextDiv = document.createElement("div");
    maleTextDiv.className = "comment-text";
    maleTextDiv.textContent = maleText;
    const maleCount = document.createElement("div");
    maleCount.className = "word-count";
    maleCount.textContent = `Word count: ${maleWordCount}`;
    maleSection.appendChild(maleH3);
    maleSection.appendChild(maleTextDiv);
    maleSection.appendChild(maleCount);

    const femaleSection = document.createElement("div");
    femaleSection.className = "comment-section";
    const femaleH3 = document.createElement("h3");
    femaleH3.textContent = "Female Teacher Style";
    const femaleTextDiv = document.createElement("div");
    femaleTextDiv.className = "comment-text";
    femaleTextDiv.textContent = femaleText;
    const femaleCount = document.createElement("div");
    femaleCount.className = "word-count";
    femaleCount.textContent = `Word count: ${femaleWordCount}`;
    femaleSection.appendChild(femaleH3);
    femaleSection.appendChild(femaleTextDiv);
    femaleSection.appendChild(femaleCount);

    content.appendChild(maleSection);
    content.appendChild(femaleSection);

    const actions = document.createElement("div");
    actions.className = "comments-actions";

    const copyMaleBtn = document.createElement("button");
    copyMaleBtn.className = "nav-button secondary";
    copyMaleBtn.textContent = "Copy Male Version";
    copyMaleBtn.addEventListener("click", () => navigator.clipboard.writeText(maleText));

    const copyFemaleBtn = document.createElement("button");
    copyFemaleBtn.className = "nav-button secondary";
    copyFemaleBtn.textContent = "Copy Female Version";
    copyFemaleBtn.addEventListener("click", () => navigator.clipboard.writeText(femaleText));

    const closeBtn2 = document.createElement("button");
    closeBtn2.className = "nav-button danger";
    closeBtn2.textContent = "Close";
    closeBtn2.addEventListener("click", () => overlay.remove());

    actions.appendChild(copyMaleBtn);
    actions.appendChild(copyFemaleBtn);
    actions.appendChild(closeBtn2);

    container.appendChild(header);
    container.appendChild(content);
    container.appendChild(actions);
    overlay.appendChild(container);

    document.body.appendChild(overlay);
  }
}
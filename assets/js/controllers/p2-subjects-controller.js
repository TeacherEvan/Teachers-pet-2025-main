import CurriculumLoader from "../curriculum/curriculum-loader.js";

export class P2SubjectsController {
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
    this.setupCommentGeneration();
    this.updateSelectionSummary();
  }

  cacheElements() {
    this.subjectsContainer = document.getElementById("subjects-container");
    this.selectionSummary = document.getElementById("selection-summary");
    this.generateBtn = document.getElementById("generate-comments");
    this.gradeMonthDisplay = document.getElementById("current-grade-month");
  }

  loadSessionDataFromURL() {
    const params = new URLSearchParams(window.location.search);
    this.app.sessionData.grade = params.get("grade") || "P2";
    this.app.sessionData.month = params.get("month") || "Semester 1";
    this.app.sessionData.subjects = [];
    this.app.sessionData.topicRatings = {};
  }

  async loadAndRenderCurriculum() {
    const { grade, month } = this.app.sessionData;
    
    if (this.app.showLoader) this.app.showLoader();
    
    try {
      const curriculum = await this.curriculumLoader.load(grade, month);
      this.renderSubjects(curriculum.subjects);
      this.updateGradeMonthDisplay(grade, month);
    } catch (error) {
      console.error("Failed to load curriculum:", error);
      if (this.app.notify) {
        this.app.notify("Failed to load curriculum. Please try again.", "error");
      }
      // Fallback to empty state
      this.subjectsContainer.innerHTML = `
        <div class="error-state">
          <p>Unable to load curriculum data.</p>
          <button class="btn btn-primary" onclick="location.reload()">Retry</button>
        </div>
      `;
    } finally {
      if (this.app.hideLoader) this.app.hideLoader();
    }
  }

  renderSubjects(subjects) {
    this.subjectsContainer.innerHTML = subjects.map(subject => this.renderSubject(subject)).join("");
  }

  parseTopicName(name) {
    // Topic name format: "English Name (Thai Name)"
    const match = name.match(/^(.+?)\s*\((.+?)\)$/);
    if (match) {
      return { en: match[1].trim(), th: match[2].trim() };
    }
    return { en: name.trim(), th: "" };
  }

  renderSubject(subject) {
    const subjectId = subject.id || subject.name.toLowerCase().replace(/\s+/g, "-");
    const topicsHtml = subject.topics.map(topic => this.renderTopic(topic, subjectId)).join("");
    return `
      <section class="subject-section" data-subject="${subjectId}">
        <h3 class="subject-title">
          <span class="subject-name-en">${subject.name}</span>
          <span class="subject-name-th">${this.getThaiSubjectName(subject.name)}</span>
          <button class="subject-toggle" aria-expanded="false" aria-controls="${subjectId}-topics">▼</button>
        </h3>
        <div class="subject-topics" id="${subjectId}-topics" role="region">${topicsHtml}</div>
      </section>
    `;
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

  renderTopic(topic, subjectId) {
    const topicId = `${subjectId}-${topic.id}`;
    const { en, th } = this.parseTopicName(topic.name);
    return `
      <label class="topic-item" data-topic-id="${topicId}">
        <input type="checkbox" 
               class="topic-checkbox"
               data-subject="${subjectId}" 
               data-topic="${topic.name}"
               data-topic-id="${topicId}"
               data-vocab="${topic.name}"
               value="${topic.name}">
        <span class="topic-name-en">${en}</span>
        <span class="topic-name-th">(${th})</span>
        <div class="rating-stars" data-topic-id="${topicId}" role="group" aria-label="Rating for ${en}">
          ${this.renderStars(0, topicId)}
        </div>
      </label>
    `;
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

  setupSubjectInteractions() {
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

    // Topic checkbox changes
    this.subjectsContainer.addEventListener("change", (e) => {
      if (e.target.matches('.topic-checkbox')) {
        this.handleTopicCheckboxChange(e.target);
        this.updateSelectionSummary();
        this.updateGenerateButton();
      }
    });
  }

  handleTopicCheckboxChange(checkbox) {
    const topicId = checkbox.dataset.topicId;
    const topicName = checkbox.value;
    
    if (checkbox.checked) {
      if (!this.app.sessionData.subjects.includes(topicName)) {
        this.app.sessionData.subjects.push(topicName);
      }
      // Enable stars visually
      document.querySelectorAll(`.star[data-topic="${topicId}"]`).forEach(star => {
        star.style.pointerEvents = "auto";
        star.style.opacity = "1";
      });
    } else {
      const index = this.app.sessionData.subjects.indexOf(topicName);
      if (index > -1) {
        this.app.sessionData.subjects.splice(index, 1);
      }
      delete this.app.sessionData.topicRatings[topicName];
      // Reset and disable stars
      document.querySelectorAll(`.star[data-topic="${topicId}"]`).forEach(star => {
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
    
    // Find the checkbox for this topic
    const checkbox = document.querySelector(`.topic-checkbox[data-topic-id="${topicId}"]`);
    if (checkbox) {
      checkbox.checked = value > 0;
      // Trigger change handler logic
      if (value > 0) {
        this.handleTopicCheckboxChange(checkbox);
      } else {
        this.handleTopicCheckboxChange(checkbox);
      }
    }
    
    // Update session data rating
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

  setupCommentGeneration() {
    if (this.generateBtn) {
      this.generateBtn.addEventListener("click", () => this.generateComments());
    }
  }

  async generateComments() {
    if (this.app.sessionData.subjects.length === 0) {
      if (this.app.notify) {
        this.app.notify("Please select at least one topic before generating comments.", "warning");
      }
      return;
    }

    if (this.app.showLoader) this.app.showLoader("Generating comments...");

    try {
      const { OptimizedCommentGenerator } = await import("../utils/optimized-comment-generator.js");
      const generator = new OptimizedCommentGenerator();
      const selections = this.collectSelections();
      const comments = await generator.generate(selections);
      
      if (this.app.notify) {
        this.app.notify("Comments generated successfully!", "success");
      }
      
      // Display comments (could also copy to clipboard)
      this.displayComments(comments);
    } catch (error) {
      console.error("Comment generation failed:", error);
      if (this.app.notify) {
        this.app.notify("Failed to generate comments. Please try again.", "error");
      }
    } finally {
      if (this.app.hideLoader) this.app.hideLoader();
    }
  }

  collectSelections() {
    const selections = [];
    
    document.querySelectorAll('.topic-checkbox:checked').forEach(cb => {
      const topicId = cb.dataset.topicId;
      const stars = document.querySelectorAll(`.star[data-topic="${topicId}"].filled`).length;
      selections.push({
        subject: cb.dataset.subject,
        topic: cb.dataset.topic,
        vocab: 10, // Default, could parse from curriculum
        rating: stars
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
      selections: selections
    };
  }

  displayComments(comments) {
    const commentsHTML = `
      <div class="comments-overlay" id="commentsOverlay">
        <div class="comments-container">
          <div class="comments-header">
            <h2>Generated Comments</h2>
            <button class="close-comments" onclick="this.closest('.comments-overlay').remove()">×</button>
          </div>
          <div class="comments-content">
            <div class="comment-section">
              <h3>Male Teacher Style</h3>
              <div class="comment-text">${comments.male || comments}</div>
              <div class="word-count">Word count: ${this.getWordCount(comments.male || comments)}</div>
            </div>
            <div class="comment-section">
              <h3>Female Teacher Style</h3>
              <div class="comment-text">${comments.female || comments}</div>
              <div class="word-count">Word count: ${this.getWordCount(comments.female || comments)}</div>
            </div>
          </div>
          <div class="comments-actions">
            <button class="nav-button secondary" onclick="navigator.clipboard.writeText('${(comments.male || comments).replace(/'/g, "\\'")}')">Copy Male Version</button>
            <button class="nav-button secondary" onclick="navigator.clipboard.writeText('${(comments.female || comments).replace(/'/g, "\\'")}')">Copy Female Version</button>
            <button class="nav-button danger" onclick="document.getElementById('commentsOverlay').remove()">Close</button>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', commentsHTML);
  }

  getWordCount(text) {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  }
}
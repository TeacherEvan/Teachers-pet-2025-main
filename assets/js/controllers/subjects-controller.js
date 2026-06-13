import CurriculumLoader from "../curriculum/curriculum-loader.js";
import { TeachersPetUtils } from "../engine/utils.js";

export class SubjectsController {
    constructor(app) {
        this.app = app;
        this.curriculumLoader = new CurriculumLoader();
        this.subjectsContainer = null;
    }

    async init() {
        this.cacheElements();
        this.loadSessionDataFromURL();
        await this.loadAndRenderCurriculum();
        this.setupSubjectInteractions();
        this.setupBulkActions();
        this.setupCommentGeneration();
        this.updateSelectionSummary();
    }

    cacheElements() {
        this.subjectsContainer = document.getElementById("subjectsForm");
    }

    loadSessionDataFromURL() {
        const params = new URLSearchParams(window.location.search);
        const sessionData = this.app.sessionData;

        // Restore session data from URL
        if (params.has('studentName')) {
            sessionData.studentName = params.get('studentName');
            sessionData.gender = params.get('gender');
            sessionData.overallRating = parseInt(params.get('overallRating'));
            sessionData.strengths = params.get('strengths');
            sessionData.weaknesses = params.get('weaknesses');
        }

        // Also load grade and month from URL for curriculum loading
        if (params.has('grade')) {
            sessionData.grade = params.get('grade');
        }
        if (params.has('month')) {
            sessionData.month = params.get('month');
        }

        // Fallback to localStorage for grade/month
        if (!sessionData.grade || !sessionData.month) {
            try {
                const saved = localStorage.getItem('studentData');
                if (saved) {
                    const data = JSON.parse(saved);
                    sessionData.grade = sessionData.grade || data.grade || '';
                    sessionData.month = sessionData.month || data.month || '';
                }
            } catch (e) {
                console.warn('Could not load grade/month from localStorage:', e);
            }
        }
    }

    async loadAndRenderCurriculum() {
        const { grade, month } = this.app.sessionData;

        if (!grade || !month) {
            console.warn('Grade or month not available, using hardcoded topics');
            return; // Keep existing hardcoded HTML
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

    renderSubjects(subjects) {
        if (!this.subjectsContainer) return;

        // Clear container safely
        this.subjectsContainer.innerHTML = '';

        // Build DOM elements safely
        const fragment = document.createDocumentFragment();
        subjects.forEach(subject => {
            fragment.appendChild(this.createSubjectElement(subject));
        });
        this.subjectsContainer.appendChild(fragment);
        this.bindSubjectEvents();
    }

    /**
     * Escape HTML to prevent XSS
     */
    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    createSubjectElement(subject) {
        const subjectId = subject.id || subject.name.toLowerCase().replace(/\s+/g, '-');
        const section = document.createElement('div');
        section.className = 'subject-section';

        const topicsFragment = document.createDocumentFragment();
        subject.topics.forEach(topic => {
            topicsFragment.appendChild(this.createTopicElement(topic, subjectId));
        });

        section.innerHTML = `
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

        const contentDiv = section.querySelector('.subject-content');
        contentDiv.appendChild(topicsFragment);

        return section;
    }

    createTopicElement(topic, subjectId) {
        const topicName = topic.name || topic;
        const topicId = `${subjectId}-${topic.id || topicName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
        const div = document.createElement('div');
        div.className = 'topic-item';
        div.innerHTML = `
      <input type="checkbox" class="topic-checkbox" id="topic_${this.escapeHtml(topicId)}" value="${this.escapeHtml(topicName)}"
        data-subject="${this.escapeHtml(subjectId)}" data-topic="${this.escapeHtml(topicName)}">
      <label for="topic_${this.escapeHtml(topicId)}" class="topic-text">${this.escapeHtml(topicName)}</label>
    `;
        return div;
    }

    bindSubjectEvents() {
        const subjectSections = document.querySelectorAll('.subject-section');

        subjectSections.forEach(section => {
            const header = section.querySelector('.subject-header');
            const content = section.querySelector('.subject-content');
            const arrow = section.querySelector('.dropdown-arrow');

            if (header && content && arrow) {
                header.addEventListener('click', (e) => {
                    if (e.target.tagName === 'INPUT') return; // Don't toggle if clicking checkbox
                    const isExpanded = content.classList.contains('active');

                    // Close all other sections
                    subjectSections.forEach(otherSection => {
                        if (otherSection !== section) {
                            otherSection.querySelector('.subject-content')?.classList.remove('active');
                            otherSection.querySelector('.dropdown-arrow')?.classList.remove('rotated');
                            otherSection.classList.remove('expanded');
                        }
                    });

                    // Toggle current section
                    content.classList.toggle('active', !isExpanded);
                    arrow.classList.toggle('rotated', !isExpanded);
                    section.classList.toggle('expanded', !isExpanded);
                });
            }

            // Setup topic checkboxes
            const topics = section.querySelectorAll('.topic-checkbox');
            topics.forEach(topic => this.setupTopicInteraction(topic));
        });
    }

    // Keep for backward compatibility with inline onclick handlers
    handleSubjectCheck(subjectId) {
        const checkbox = document.getElementById(`subject_${subjectId}`);
        if (!checkbox) return;

        const content = document.getElementById(`content_${subjectId}`);
        const arrow = document.getElementById(`arrow_${subjectId}`);
        const section = checkbox.closest('.subject-section');

        if (checkbox.checked) {
            // Select all topics in this subject
            const topicCheckboxes = content?.querySelectorAll('.topic-checkbox');
            topicCheckboxes?.forEach(topic => {
                if (!topic.checked) {
                    topic.checked = true;
                    topic.dispatchEvent(new Event('change'));
                }
            });
            section?.classList.add('expanded');
            content?.classList.add('active');
            arrow?.classList.add('rotated');
        } else {
            // Deselect all topics in this subject
            const topicCheckboxes = content?.querySelectorAll('.topic-checkbox');
            topicCheckboxes?.forEach(topic => {
                if (topic.checked) {
                    topic.checked = false;
                    topic.dispatchEvent(new Event('change'));
                }
            });
        }
    }

    setupTopicInteraction(topicElement) {
        const topicName = topicElement.value;

        topicElement.addEventListener('change', () => {
            if (topicElement.checked) {
                if (!this.app.sessionData.subjects.includes(topicName)) {
                    this.app.sessionData.subjects.push(topicName);
                }
            } else {
                // Remove from subjects
                const index = this.app.sessionData.subjects.indexOf(topicName);
                if (index > -1) {
                    this.app.sessionData.subjects.splice(index, 1);
                }
                // Remove rating
                delete this.app.sessionData.topicRatings[topicName];
            }
            this.updateSelectionSummary();
        });
    }

    setupBulkActions() {
        // No bulk actions in Subjects.html (removed per UX request)
        // Could add programmatic select/clear all if needed
    }

    updateSelectionSummary() {
        const selectionCount = document.getElementById('selectionCount');
        if (!selectionCount) return;

        const selectedCount = this.app.sessionData.subjects.length;
        selectionCount.textContent = selectedCount;
    }

    setupCommentGeneration() {
        const generateButton = document.getElementById('generateBtn');
        if (generateButton) {
            generateButton.addEventListener('click', () => {
                if (this.app.sessionData.subjects.length === 0) {
                    this.app.showNotification('Please select at least one subject before generating comments.', 'warning');
                    return;
                }

                this.generateComments();
            });
        }
    }

    generateComments() {
        // Show loading state
        this.app.showLoadingOverlay('Generating premium comments...');

        // Simulate processing time for premium experience
        setTimeout(() => {
            try {
                // Use the singleton comment generator from app
                const comments = this.app.commentGenerator.generateComments(this.app.sessionData);
                this.displayComments(comments);
            } catch (error) {
                console.error('Comment generation failed:', error);
                this.app.showNotification('Failed to generate comments. Please try again.', 'error');
            } finally {
                this.app.hideLoadingOverlay();
            }
        }, 2000);
    }

    displayComments(comments) {
        // Use Subjects.html's existing comment display structure
        const generatedComments = document.getElementById('generatedComments');
        const commentText1 = document.getElementById('commentText1');
        const commentText2 = document.getElementById('commentText2');
        const wordCount1 = document.getElementById('wordCount1');
        const wordCount2 = document.getElementById('wordCount2');
        const comment1 = document.getElementById('comment1');

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

        // Show the generated comments section
        if (generatedComments) {
            generatedComments.classList.remove('display-none');
            generatedComments.style.display = 'block';
        }

        // Select first comment by default
        if (comment1) {
            comment1.classList.add('selected');
        }

        // Update selection indicator
        const generateBtn = document.getElementById('generateBtn');
        if (generateBtn) {
            generateBtn.textContent = '🔄 Generate New Comments';
        }

        this.app.hideLoadingOverlay();
        this.app.showNotification('Comments generated successfully!', 'success');
    }
}

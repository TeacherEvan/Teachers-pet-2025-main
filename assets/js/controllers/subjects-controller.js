export class SubjectsController {
    constructor(app) {
        this.app = app;
    }

    init() {
        this.loadSessionDataFromURL();
        this.setupSubjectInteractions();
        this.setupBulkActions();
        this.setupCommentGeneration();
        this.updateSelectionSummary();
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
    }

    setupSubjectInteractions() {
        const subjectSections = document.querySelectorAll('.subject-section');

        subjectSections.forEach(section => {
            const header = section.querySelector('.subject-header');
            const content = section.querySelector('.subject-content');
            const arrow = section.querySelector('.dropdown-arrow');

            if (header && content && arrow) {
                header.addEventListener('click', () => {
                    const isExpanded = content.classList.contains('expanded');

                    // Close all other sections
                    subjectSections.forEach(otherSection => {
                        if (otherSection !== section) {
                            otherSection.querySelector('.subject-content')?.classList.remove('expanded');
                            otherSection.querySelector('.dropdown-arrow')?.classList.remove('rotated');
                            otherSection.classList.remove('expanded');
                        }
                    });

                    // Toggle current section
                    content.classList.toggle('expanded', !isExpanded);
                    arrow.classList.toggle('rotated', !isExpanded);
                    section.classList.toggle('expanded', !isExpanded);
                });
            }

            // Setup topic checkboxes and ratings
            const topics = section.querySelectorAll('.topic-item');
            topics.forEach(topic => this.setupTopicInteraction(topic));
        });
    }

    setupTopicInteraction(topicElement) {
        const checkbox = topicElement.querySelector('.topic-checkbox');
        const ratingOptions = topicElement.querySelectorAll('.rating-option');
        const topicText = topicElement.querySelector('.topic-text').textContent.trim();

        if (checkbox) {
            checkbox.addEventListener('change', () => {
                if (checkbox.checked) {
                    if (!this.app.sessionData.subjects.includes(topicText)) {
                        this.app.sessionData.subjects.push(topicText);
                    }
                    // Enable rating options
                    ratingOptions.forEach(option => {
                        option.style.pointerEvents = 'auto';
                        option.style.opacity = '1';
                    });
                } else {
                    // Remove from subjects
                    const index = this.app.sessionData.subjects.indexOf(topicText);
                    if (index > -1) {
                        this.app.sessionData.subjects.splice(index, 1);
                    }
                    // Remove rating
                    delete this.app.sessionData.topicRatings[topicText];
                    // Disable rating options
                    ratingOptions.forEach(option => {
                        option.classList.remove('selected');
                        option.style.pointerEvents = 'none';
                        option.style.opacity = '0.3';
                    });
                }
                this.updateSelectionSummary();
            });
        }

        // Setup rating interaction
        ratingOptions.forEach(option => {
            option.addEventListener('click', () => {
                if (!checkbox.checked) return;

                // Clear previous selection
                ratingOptions.forEach(opt => opt.classList.remove('selected'));

                // Set new selection
                option.classList.add('selected');
                this.app.sessionData.topicRatings[topicText] = parseInt(option.dataset.value);

                this.updateSelectionSummary();
            });
        });

        // Initialize rating options as disabled
        ratingOptions.forEach(option => {
            option.style.pointerEvents = 'none';
            option.style.opacity = '0.3';
        });
    }

    setupBulkActions() {
        const selectAllButton = document.querySelector('[data-action="select-all"]');
        const clearAllButton = document.querySelector('[data-action="clear-all"]');

        if (selectAllButton) {
            selectAllButton.addEventListener('click', () => {
                const checkboxes = document.querySelectorAll('.topic-checkbox');
                checkboxes.forEach(checkbox => {
                    if (!checkbox.checked) {
                        checkbox.checked = true;
                        checkbox.dispatchEvent(new Event('change'));
                    }
                });
            });
        }

        if (clearAllButton) {
            clearAllButton.addEventListener('click', () => {
                const checkboxes = document.querySelectorAll('.topic-checkbox');
                checkboxes.forEach(checkbox => {
                    if (checkbox.checked) {
                        checkbox.checked = false;
                        checkbox.dispatchEvent(new Event('change'));
                    }
                });
            });
        }
    }

    updateSelectionSummary() {
        const summaryContent = document.querySelector('.summary-content');
        if (!summaryContent) return;

        const selectedCount = this.app.sessionData.subjects.length;
        const ratedCount = Object.keys(this.app.sessionData.topicRatings).length;

        summaryContent.innerHTML = `
      <span class="summary-count">${selectedCount}</span> subjects selected, 
      <span class="summary-count">${ratedCount}</span> rated. 
      ${selectedCount > 0 ? 'Ready to generate comments!' : 'Please select subjects to continue.'}
    `;
    }

    setupCommentGeneration() {
        const generateButton = document.querySelector('[data-action="generate-comments"]');
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
                // Use the optimized comment generator
                if (typeof OptimizedCommentGenerator !== 'undefined') {
                    const generator = new OptimizedCommentGenerator();
                    const comments = generator.generateComments(this.app.sessionData);
                    this.displayComments(comments);
                } else {
                    throw new Error('Comment generator not available');
                }
            } catch (error) {
                console.error('Comment generation failed:', error);
                this.app.showNotification('Failed to generate comments. Please try again.', 'error');
            } finally {
                this.app.hideLoadingOverlay();
            }
        }, 2000);
    }

    displayComments(comments) {
        // Create comments display modal or section
        const commentsHTML = `
      <div class="comments-overlay" id="commentsOverlay">
        <div class="comments-container">
          <div class="comments-header">
            <h2>Generated Comments for ${this.app.sessionData.studentName}</h2>
            <button class="close-comments" onclick="app.controllers.subjects.closeComments()">×</button>
          </div>
          <div class="comments-content">
            <div class="comment-section">
              <h3>Male Teacher Style</h3>
              <div class="comment-text">${comments.male}</div>
              <div class="word-count">Word count: ${this.getWordCount(comments.male)}</div>
            </div>
            <div class="comment-section">
              <h3>Female Teacher Style</h3>
              <div class="comment-text">${comments.female}</div>
              <div class="word-count">Word count: ${this.getWordCount(comments.female)}</div>
            </div>
          </div>
          <div class="comments-actions">
            <button class="nav-button secondary" onclick="app.controllers.subjects.copyComments('male')">Copy Male Version</button>
            <button class="nav-button secondary" onclick="app.controllers.subjects.copyComments('female')">Copy Female Version</button>
            <button class="nav-button danger" onclick="app.startOverWithAnimation()">Start Over</button>
          </div>
        </div>
      </div>
    `;

        document.body.insertAdjacentHTML('beforeend', commentsHTML);

        // Add styles for comments display
        this.addCommentsStyles();
    }

    addCommentsStyles() {
        if (document.querySelector('#comments-styles')) return;

        const style = document.createElement('style');
        style.id = 'comments-styles';
        style.textContent = `
      .comments-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        -webkit-backdrop-filter: blur(10px);
        backdrop-filter: blur(10px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        padding: 20px;
      }
      
      .comments-container {
        background: var(--glass-bg);
        -webkit-backdrop-filter: var(--glass-backdrop);
        backdrop-filter: var(--glass-backdrop);
        border: 1px solid var(--glass-border);
        border-radius: var(--radius-lg);
        box-shadow: var(--glass-shadow);
        max-width: 800px;
        width: 100%;
        max-height: 90vh;
        overflow-y: auto;
        position: relative;
      }
      
      .comments-header {
        padding: var(--space-lg);
        border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      
      .comments-header h2 {
        color: var(--text-white);
        margin: 0;
        font-size: 1.5rem;
      }
      
      .close-comments {
        background: none;
        border: none;
        color: var(--text-white);
        font-size: 2rem;
        cursor: pointer;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all var(--transition-normal);
      }
      
      .close-comments:hover {
        background: rgba(255, 255, 255, 0.1);
      }
      
      .comments-content {
        padding: var(--space-lg);
      }
      
      .comment-section {
        margin-bottom: var(--space-lg);
        padding: var(--space-md);
        background: rgba(255, 255, 255, 0.05);
        border-radius: var(--radius-sm);
        border: 1px solid rgba(255, 255, 255, 0.1);
      }
      
      .comment-section h3 {
        color: var(--text-white);
        margin-bottom: var(--space-sm);
        font-size: 1.2rem;
      }
      
      .comment-text {
        color: rgba(255, 255, 255, 0.9);
        line-height: 1.6;
        margin-bottom: var(--space-sm);
        font-size: 1rem;
      }
      
      .word-count {
        color: rgba(255, 255, 255, 0.6);
        font-size: 0.875rem;
        font-style: italic;
      }
      
      .comments-actions {
        padding: var(--space-lg);
        border-top: 1px solid rgba(255, 255, 255, 0.2);
        display: flex;
        gap: var(--space-md);
        flex-wrap: wrap;
        justify-content: center;
      }
    `;

        document.head.appendChild(style);
    }

    closeComments() {
        const overlay = document.getElementById('commentsOverlay');
        if (overlay) {
            overlay.remove();
        }
    }

    copyComments(type) {
        const commentSections = document.querySelectorAll('.comment-section');
        const targetSection = type === 'male' ? commentSections[0] : commentSections[1];
        const commentText = targetSection.querySelector('.comment-text').textContent;

        if (navigator.clipboard) {
            navigator.clipboard.writeText(commentText).then(() => {
                this.app.showNotification(`${type.charAt(0).toUpperCase() + type.slice(1)} teacher comment copied to clipboard!`, 'success');
            }).catch(() => {
                this.fallbackCopyToClipboard(commentText);
            });
        } else {
            this.fallbackCopyToClipboard(commentText);
        }
    }

    fallbackCopyToClipboard(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            document.execCommand('copy');
            this.app.showNotification('Comment copied to clipboard!', 'success');
        } catch (err) {
            console.error('Fallback copy failed:', err);
            this.app.showNotification('Unable to copy to clipboard. Please copy manually.', 'error');
        }

        document.body.removeChild(textArea);
    }

    getWordCount(text) {
        return text.trim().split(/\s+/).filter(word => word.length > 0).length;
    }
}

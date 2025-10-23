/**
 * Teachers Pet - Main Application Controller
 * Premium In-Memory Session Management with No Storage Dependencies
 */

class TeachersPetApp {
  constructor() {
    this.sessionData = {
      grade: '',
      studentName: '',
      gender: '',
      overallRating: 5,
      strengths: '',
      weaknesses: '',
      subjects: [],
      topicRatings: {}
    };
    
    this.currentPage = this.getCurrentPage();
    this.initialized = false;
    
    // Initialize app based on current page
    this.init();
  }

  getCurrentPage() {
    const path = window.location.pathname;
    if (path.includes('grade-selection')) return 'grade-selection';
    if (path.includes('student-information')) return 'student-info';
    if (path.includes('Subjects')) return 'subjects';
    return 'launcher';
  }

  init() {
    if (this.initialized) return;
    
    // Initialize based on current page
    switch (this.currentPage) {
      case 'launcher':
        this.initLauncher();
        break;
      case 'grade-selection':
        this.initGradeSelection();
        break;
      case 'student-info':
        this.initStudentInfo();
        break;
      case 'subjects':
        this.initSubjects();
        break;
    }
    
    this.initialized = true;
  }

  // LAUNCHER PAGE METHODS
  initLauncher() {
    // Initialize premium loading screen
    this.showLoadingScreen();
    
    // Setup start over functionality
    this.setupStartOver();
    
    // Initialize particles and animations
    setTimeout(() => {
      this.hideLoadingScreen();
      this.initParticles();
      this.setupMicroInteractions();
    }, 1200);
  }

  showLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
      loadingScreen.style.display = 'flex';
    }
  }

  hideLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    const appContainer = document.getElementById('appContainer');
    
    if (loadingScreen && appContainer) {
      loadingScreen.classList.add('fade-out');
      appContainer.classList.add('fade-in');
    }
  }

  initParticles() {
    const particlesContainer = document.querySelector('.particles-container');
    if (!particlesContainer) return;

    const particles = particlesContainer.querySelectorAll('.particle');
    particles.forEach((particle, index) => {
      particle.style.animationDelay = `${index * 0.5}s`;
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.animationDuration = `${8 + Math.random() * 4}s`;
    });
  }

  setupMicroInteractions() {
    // Add hover effects to action cards
    const actionCards = document.querySelectorAll('.action-card');
    actionCards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-8px) scale(1.02)';
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
      });
    });

    // Add click ripple effect to buttons
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary');
    buttons.forEach(button => {
      button.addEventListener('click', this.createRippleEffect);
    });
  }

  createRippleEffect(event) {
    const button = event.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      transform: scale(0);
      animation: ripple 0.6s linear;
      pointer-events: none;
    `;

    // Add ripple animation keyframes if not exists
    if (!document.querySelector('#ripple-styles')) {
      const style = document.createElement('style');
      style.id = 'ripple-styles';
      style.textContent = `
        @keyframes ripple {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }

    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    button.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 600);
  }

  setupStartOver() {
    // Global start over function
    window.startOverWithAnimation = () => {
      // Clear ALL localStorage data for a true fresh start
      localStorage.clear();
      sessionStorage.clear();
      
      // Clear any cookies (if applicable)
      if (typeof document !== 'undefined') {
        document.cookie.split(";").forEach(function(c) { 
          document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
        });
      }
      
      // Reset the session data
      this.sessionData = {
        grade: '',
        studentName: '',
        gender: '',
        overallRating: 5,
        strengths: '',
        weaknesses: '',
        subjects: [],
        topicRatings: {}
      };
      
      console.log('🧹 All data cleared - starting fresh!');
      
      document.body.classList.add('page-exit');
      
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 600);
    };
  }

  // GRADE SELECTION PAGE METHODS
  initGradeSelection() {
    console.log('Initializing grade selection page');
    // Grade selection page is self-contained with inline JS
    // This method exists for consistency but most logic is in the page itself
  }

  // STUDENT INFORMATION PAGE METHODS
  initStudentInfo() {
    this.setupFormValidation();
    this.setupProgressTracking();
    this.initSlider();
    this.setupNavigationButtons();
  }

  setupFormValidation() {
    const form = document.querySelector('.student-form');
    if (!form) return;

    const inputs = form.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
      input.addEventListener('input', () => this.validateField(input));
      input.addEventListener('blur', () => this.validateField(input));
    });

    // Setup form submission
    const nextButton = document.querySelector('.nav-button.primary');
    if (nextButton) {
      nextButton.addEventListener('click', (e) => {
        e.preventDefault();
        this.submitStudentInfo();
      });
    }
  }

  validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let message = '';

    switch (field.name || field.id) {
      case 'studentName':
        isValid = value.length >= 2;
        message = isValid ? '' : 'Student name must be at least 2 characters';
        break;
      case 'gender':
        isValid = value !== '';
        message = isValid ? '' : 'Please select a gender';
        break;
      case 'strengths':
        isValid = value.length >= 5;
        message = isValid ? '' : 'Please provide more detail (minimum 5 characters)';
        break;
      case 'weaknesses':
        isValid = value.length >= 5;
        message = isValid ? '' : 'Please provide more detail (minimum 5 characters)';
        break;
    }

    // Update field appearance
    field.classList.remove('valid', 'invalid');
    field.classList.add(isValid ? 'valid' : 'invalid');

    // Update validation message
    const messageElement = field.parentNode.querySelector('.validation-message');
    if (messageElement) {
      messageElement.textContent = message;
      messageElement.style.display = message ? 'flex' : 'none';
      messageElement.classList.toggle('success', isValid && value !== '');
    }

    return isValid;
  }

  setupProgressTracking() {
    const form = document.querySelector('.student-form');
    if (!form) return;

    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    const progressFill = document.querySelector('.progress-fill');
    const progressText = document.querySelector('.progress-text');

    const updateProgress = () => {
      const completedFields = Array.from(inputs).filter(input => 
        input.value.trim() !== '' && this.validateField(input)
      ).length;
      
      const progress = (completedFields / inputs.length) * 100;
      
      if (progressFill) {
        progressFill.style.width = `${progress}%`;
      }
      
      if (progressText) {
        progressText.textContent = `Form Progress: ${Math.round(progress)}% Complete`;
      }
    };

    inputs.forEach(input => {
      input.addEventListener('input', updateProgress);
    });

    updateProgress();
  }

  initSlider() {
    const slider = document.querySelector('.slider');
    const sliderValue = document.querySelector('.slider-value');
    
    if (!slider || !sliderValue) return;

    const updateSliderDisplay = () => {
      const value = parseInt(slider.value);
      sliderValue.textContent = `${value}/10`;
      
      // Update slider appearance based on value
      const percentage = (value - 1) / 9 * 100;
      slider.style.background = `linear-gradient(90deg, 
        #e74c3c 0%, 
        #f39c12 ${percentage < 50 ? percentage * 2 : 100}%, 
        #27ae60 ${percentage}%)`;
    };

    slider.addEventListener('input', updateSliderDisplay);
    updateSliderDisplay();
  }

  setupNavigationButtons() {
    // Back button
    const backButton = document.querySelector('.nav-button.secondary');
    if (backButton) {
      backButton.addEventListener('click', (e) => {
        e.preventDefault();
        this.navigateWithTransition('index.html');
      });
    }
  }

  submitStudentInfo() {
    const form = document.querySelector('.student-form');
    if (!form) return;

    // Collect form data
    const formData = new FormData(form);
    
    // Validate all required fields
    const requiredFields = form.querySelectorAll('[required]');
    let allValid = true;

    requiredFields.forEach(field => {
      if (!this.validateField(field)) {
        allValid = false;
      }
    });

    if (!allValid) {
      this.showNotification('Please complete all required fields correctly.', 'error');
      return;
    }

    // Store session data (in memory only)
    this.sessionData = {
      studentName: formData.get('studentName') || '',
      gender: formData.get('gender') || '',
      overallRating: parseInt(formData.get('overallRating')) || 5,
      strengths: formData.get('strengths') || '',
      weaknesses: formData.get('weaknesses') || '',
      subjects: [],
      topicRatings: {}
    };

    // Pass data to next page via URL parameters (temporary)
    const params = new URLSearchParams();
    Object.keys(this.sessionData).forEach(key => {
      if (typeof this.sessionData[key] !== 'object') {
        params.set(key, this.sessionData[key]);
      }
    });

    this.navigateWithTransition(`Subjects.html?${params.toString()}`);
  }

  // SUBJECTS PAGE METHODS
  initSubjects() {
    this.loadSessionDataFromURL();
    this.setupSubjectInteractions();
    this.setupBulkActions();
    this.setupCommentGeneration();
    this.updateSelectionSummary();
  }

  loadSessionDataFromURL() {
    const params = new URLSearchParams(window.location.search);
    
    // Restore session data from URL
    if (params.has('studentName')) {
      this.sessionData.studentName = params.get('studentName');
      this.sessionData.gender = params.get('gender');
      this.sessionData.overallRating = parseInt(params.get('overallRating'));
      this.sessionData.strengths = params.get('strengths');
      this.sessionData.weaknesses = params.get('weaknesses');
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
          if (!this.sessionData.subjects.includes(topicText)) {
            this.sessionData.subjects.push(topicText);
          }
          // Enable rating options
          ratingOptions.forEach(option => {
            option.style.pointerEvents = 'auto';
            option.style.opacity = '1';
          });
        } else {
          // Remove from subjects
          const index = this.sessionData.subjects.indexOf(topicText);
          if (index > -1) {
            this.sessionData.subjects.splice(index, 1);
          }
          // Remove rating
          delete this.sessionData.topicRatings[topicText];
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
        this.sessionData.topicRatings[topicText] = parseInt(option.dataset.value);
        
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
    
    const selectedCount = this.sessionData.subjects.length;
    const ratedCount = Object.keys(this.sessionData.topicRatings).length;
    
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
        if (this.sessionData.subjects.length === 0) {
          this.showNotification('Please select at least one subject before generating comments.', 'warning');
          return;
        }
        
        this.generateComments();
      });
    }
  }

  generateComments() {
    // Show loading state
    this.showLoadingOverlay('Generating premium comments...');
    
    // Simulate processing time for premium experience
    setTimeout(() => {
      try {
        // Use the optimized comment generator
        if (typeof OptimizedCommentGenerator !== 'undefined') {
          const generator = new OptimizedCommentGenerator();
          const comments = generator.generateComments(this.sessionData);
          this.displayComments(comments);
        } else {
          throw new Error('Comment generator not available');
        }
      } catch (error) {
        console.error('Comment generation failed:', error);
        this.showNotification('Failed to generate comments. Please try again.', 'error');
      } finally {
        this.hideLoadingOverlay();
      }
    }, 2000);
  }

  displayComments(comments) {
    // Create comments display modal or section
    const commentsHTML = `
      <div class="comments-overlay" id="commentsOverlay">
        <div class="comments-container">
          <div class="comments-header">
            <h2>Generated Comments for ${this.sessionData.studentName}</h2>
            <button class="close-comments" onclick="app.closeComments()">×</button>
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
            <button class="nav-button secondary" onclick="app.copyComments('male')">Copy Male Version</button>
            <button class="nav-button secondary" onclick="app.copyComments('female')">Copy Female Version</button>
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
        this.showNotification(`${type.charAt(0).toUpperCase() + type.slice(1)} teacher comment copied to clipboard!`, 'success');
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
      this.showNotification('Comment copied to clipboard!', 'success');
    } catch (err) {
      console.error('Fallback copy failed:', err);
      this.showNotification('Unable to copy to clipboard. Please copy manually.', 'error');
    }
    
    document.body.removeChild(textArea);
  }

  getWordCount(text) {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  }

  // UTILITY METHODS
  navigateWithTransition(url) {
    document.body.classList.add('page-exit');
    
    setTimeout(() => {
      window.location.href = url;
    }, 600);
  }

  showLoadingOverlay(message = 'Loading...') {
    const overlay = document.createElement('div');
    overlay.id = 'loadingOverlay';
    overlay.innerHTML = `
      <div class="loading-overlay-content">
        <div class="loading-spinner"></div>
        <div class="loading-message">${message}</div>
      </div>
    `;
    
    overlay.style.cssText = `
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
      z-index: 9999;
      color: white;
      font-family: inherit;
    `;
    
    const contentStyle = `
      text-align: center;
      .loading-spinner {
        width: 40px;
        height: 40px;
        border: 3px solid rgba(255, 255, 255, 0.3);
        border-top: 3px solid white;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto 20px;
      }
      .loading-message {
        font-size: 1.1rem;
        font-weight: 500;
      }
    `;
    
    document.body.appendChild(overlay);
  }

  hideLoadingOverlay() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
      overlay.remove();
    }
  }

  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px 20px;
      border-radius: 8px;
      color: white;
      font-weight: 500;
      z-index: 10001;
      max-width: 300px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      transform: translateX(100%);
      transition: transform 0.3s ease;
      ${type === 'success' ? 'background: linear-gradient(135deg, #27ae60, #2ecc71);' : ''}
      ${type === 'error' ? 'background: linear-gradient(135deg, #e74c3c, #c0392b);' : ''}
      ${type === 'warning' ? 'background: linear-gradient(135deg, #f39c12, #e67e22);' : ''}
      ${type === 'info' ? 'background: linear-gradient(135deg, #3498db, #2980b9);' : ''}
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 4000);
  }
}

// Initialize the application
let app;

// Add debug logging
console.log('App.js loaded, DOM state:', document.readyState);

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, initializing TeachersPetApp');
  try {
    app = new TeachersPetApp();
    console.log('TeachersPetApp initialized successfully');
  } catch (error) {
    console.error('Error initializing TeachersPetApp:', error);
  }
});

// Global functions for backward compatibility
window.startOverWithAnimation = () => {
  // Clear ALL localStorage data for a true fresh start
  localStorage.clear();
  sessionStorage.clear();
  
  // Clear any cookies (if applicable)
  if (typeof document !== 'undefined') {
    document.cookie.split(";").forEach(function(c) { 
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
    });
  }
  
  // Reset the session data if app exists
  if (app && app.sessionData) {
    app.sessionData = {
      studentName: '',
      gender: '',
      overallRating: 5,
      strengths: '',
      weaknesses: '',
      subjects: [],
      topicRatings: {}
    };
  }
  
  console.log('🧹 All data cleared - starting fresh!');
  
  // Navigate with animation
  if (app) {
    app.navigateWithTransition('index.html');
  } else {
    document.body.style.opacity = '0';
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 300);
  }
};
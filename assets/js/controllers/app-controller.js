/**
 * Teachers Pet - Main Application Controller
 * Modularized version of the original app.js
 * @class TeachersPetApp
 */

/* eslint-disable no-unused-vars */
class TeachersPetApp {
    constructor() {
        this.sessionData = {
            grade: '',
            month: '',
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
        this.controllers = {};

        // Initialize app based on current page
        this.init();
    }

    getCurrentPage() {
        const path = window.location.pathname;
        if (path.includes('grade-selection')) return 'grade-selection';
        if (path.includes('month-selection')) return 'month-selection';
        if (path.includes('student-information')) return 'student-info';
        if (path.includes('Subjects')) return 'subjects';
        return 'launcher';
    }

    init() {
        if (this.initialized) return;

        // Initialize controllers
        if (typeof LauncherController !== 'undefined') this.controllers.launcher = new LauncherController(this);
        if (typeof StudentInfoController !== 'undefined') this.controllers.studentInfo = new StudentInfoController(this);
        if (typeof SubjectsController !== 'undefined') this.controllers.subjects = new SubjectsController(this);

        // Initialize based on current page
        switch (this.currentPage) {
            case 'launcher':
                if (this.controllers.launcher) this.controllers.launcher.init();
                break;
            case 'grade-selection':
                this.initGradeSelection();
                break;
            case 'month-selection':
                this.initMonthSelection();
                break;
            case 'student-info':
                if (this.controllers.studentInfo) this.controllers.studentInfo.init();
                break;
            case 'subjects':
                if (this.controllers.subjects) this.controllers.subjects.init();
                break;
        }

        this.initialized = true;
    }

    // GRADE SELECTION PAGE METHODS (Simple enough to keep here for now)
    initGradeSelection() {
        console.log('Initializing grade selection page');
    }

    initMonthSelection() {
        console.log('Initializing month selection page');
        this.loadGradeMonthFromStorage();
    }

    loadGradeMonthFromStorage() {
        const params = new URLSearchParams(window.location.search);
        if (params.has('grade')) {
            this.sessionData.grade = params.get('grade');
        }
        if (params.has('month')) {
            this.sessionData.month = params.get('month');
        }

        // Fallback to localStorage
        if (!this.sessionData.grade || !this.sessionData.month) {
            try {
                const saved = localStorage.getItem('studentData');
                if (saved) {
                    const data = JSON.parse(saved);
                    this.sessionData.grade = this.sessionData.grade || data.grade || '';
                    this.sessionData.month = this.sessionData.month || data.month || '';
                }
            } catch (error) {
                console.warn('Could not load from localStorage:', error);
            }
        }

        console.log('Loaded grade/month:', this.sessionData.grade, this.sessionData.month);
    }

    // SHARED UTILITY METHODS
    updateSessionData(newData) {
        this.sessionData = { ...this.sessionData, ...newData };
    }

    resetSessionData() {
        this.sessionData = {
            grade: '',
            month: '',
            studentName: '',
            gender: '',
            overallRating: 5,
            strengths: '',
            weaknesses: '',
            subjects: [],
            topicRatings: {}
        };
    }

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
console.log('App Controller loaded, DOM state:', document.readyState);

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
    if (app && app.controllers.launcher) {
        app.controllers.launcher.setupStartOver();
        // The setupStartOver method in LauncherController defines window.startOverWithAnimation
        // So we might need to call it directly or let it redefine this global
        // Actually, the LauncherController redefines this global. 
        // But if we are here, it means the global might not have been redefined yet if we are not on the launcher page.
        // So we should keep a fallback here.
    }

    // Fallback implementation
    localStorage.clear();
    sessionStorage.clear();
    if (typeof document !== 'undefined') {
        document.cookie.split(";").forEach(function (c) {
            document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        });
    }
    if (app) app.resetSessionData();
    console.log('🧹 All data cleared - starting fresh!');
    if (app) {
        app.navigateWithTransition('index.html');
    } else {
        document.body.style.opacity = '0';
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 300);
    }
};

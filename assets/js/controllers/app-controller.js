/**
 * Teachers Pet - Main Application Controller
 * Modularized version of the original app.js
 * @class TeachersPetApp
 */

/* eslint-disable no-unused-vars */
import { createPersistentStore } from '../state/store.js';
import { LauncherController } from './launcher-controller.js';
import { StudentInfoController } from './student-info-controller.js';
import { SubjectsController } from './subjects-controller.js';

export class TeachersPetApp {
    constructor() {
        // Initialize Reactive Store
        this.sessionData = createPersistentStore('studentData', {
            grade: '',
            month: '',
            studentName: '',
            gender: '',
            overallRating: 5,
            strengths: '',
            weaknesses: '',
            subjects: [],
            topicRatings: {}
        });

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
        this.controllers.launcher = new LauncherController(this);
        this.controllers.studentInfo = new StudentInfoController(this);
        this.controllers.subjects = new SubjectsController(this);

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
        
        // No need for manual localStorage fallback - Store handles it!
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
    // 1. Capture current context (Grade/Month) to preserve it
    let currentGrade = '';
    let currentMonth = '';

    try {
        const saved = localStorage.getItem('studentData');
        if (saved) {
            const data = JSON.parse(saved);
            currentGrade = data.grade;
            currentMonth = data.month;
        }
    } catch (e) { }

    // 2. Clear everything
    localStorage.clear();
    sessionStorage.clear();
    if (typeof document !== 'undefined') {
        document.cookie.split(";").forEach(function (c) {
            document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        });
    }
    if (app) app.resetSessionData();

    // 3. Restore context if it existed and navigate to Student Info
    if (currentGrade && currentMonth) {
        const preservedData = { grade: currentGrade, month: currentMonth };
        localStorage.setItem('studentData', JSON.stringify(preservedData));
        console.log('🧹 Data cleared (Grade/Month preserved)');

        const target = `student-information.html?grade=${currentGrade}&month=${currentMonth}`;
        if (app) {
            app.navigateWithTransition(target);
        } else {
            document.body.style.opacity = '0';
            setTimeout(() => { window.location.href = target; }, 300);
        }
    } else {
        // Full reset if no context
        console.log('🧹 All data cleared - starting fresh!');
        if (app) {
            app.navigateWithTransition('index.html');
        } else {
            document.body.style.opacity = '0';
            setTimeout(() => { window.location.href = 'index.html'; }, 300);
        }
    }
};

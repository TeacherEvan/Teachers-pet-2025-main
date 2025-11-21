class StudentInfoController {
    constructor(app) {
        this.app = app;
    }

    init() {
        // Show current curriculum tracker
        try {
            let grade = '';
            let month = '';
            // Prefer URL params, fallback to localStorage
            const params = new URLSearchParams(window.location.search);
            grade = params.get('grade') || '';
            month = params.get('month') || '';
            if (!grade || !month) {
                const saved = localStorage.getItem('studentData');
                if (saved) {
                    const data = JSON.parse(saved);
                    grade = grade || data.grade || '';
                    month = month || data.month || '';
                }
            }
            if (grade && month) {
                const tracker = document.getElementById('curriculumTracker');
                if (tracker) {
                    tracker.innerHTML = `<span style="background:rgba(0,0,0,0.07);border-radius:16px;padding:4px 12px;font-weight:600;display:inline-block;">Current: <span style='color:#2a7cff'>${grade}</span> · <span style='color:#ff7c2a'>${month}</span> <a href='month-selection.html?grade=${encodeURIComponent(grade)}' style='margin-left:8px;font-size:13px;'>Change</a></span>`;
                }
            }
        } catch (e) { }

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
                this.app.navigateWithTransition('index.html');
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
            this.app.showNotification('Please complete all required fields correctly.', 'error');
            return;
        }

        // Store session data (in memory only)
        // Get grade/month from localStorage.studentData (persisted from previous steps)
        let grade = '';
        let month = '';
        try {
            const saved = localStorage.getItem('studentData');
            if (saved) {
                const data = JSON.parse(saved);
                grade = data.grade || '';
                month = data.month || '';
            }
        } catch (e) {
            console.warn('Could not load grade/month from localStorage:', e);
        }

        const sessionData = {
            grade: grade,
            month: month,
            studentName: formData.get('studentName') || '',
            gender: formData.get('gender') || '',
            overallRating: parseInt(formData.get('overallRating')) || 5,
            strengths: formData.get('strengths') || '',
            weaknesses: formData.get('weaknesses') || '',
            subjects: [],
            topicRatings: {}
        };

        this.app.updateSessionData(sessionData);

        // Pass data to next page via URL parameters (temporary)
        const params = new URLSearchParams();
        Object.keys(sessionData).forEach(key => {
            if (typeof sessionData[key] !== 'object') {
                params.set(key, sessionData[key]);
            }
        });

        this.app.navigateWithTransition(`Subjects.html?${params.toString()}`);
    }
}

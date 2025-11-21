class LauncherController {
    constructor(app) {
        this.app = app;
    }

    init() {
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
            button.addEventListener('click', (e) => this.createRippleEffect(e));
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
                document.cookie.split(";").forEach(function (c) {
                    document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
                });
            }

            // Reset the session data
            if (this.app) {
                this.app.resetSessionData();
            }

            console.log('🧹 All data cleared - starting fresh!');

            document.body.classList.add('page-exit');

            setTimeout(() => {
                window.location.href = 'index.html';
            }, 600);
        };
    }
}

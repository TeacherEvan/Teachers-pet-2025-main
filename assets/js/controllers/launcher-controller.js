/**
 * Launcher Controller - Main Landing Page Controller
 * Manages initialization, animations, and user interactions on the landing page
 * @class LauncherController
 */
class LauncherController {
    constructor(appInstance) {
        this.app = appInstance;
        this.LOADING_SCREEN_DURATION_MS = 1200; // Premium loading experience duration
        this.isInitialized = false;
    }

    /**
     * Initialize the launcher page with premium loading experience
     * Orchestrates loading screen, particles, and micro-interactions
     */
    init() {
        if (this.isInitialized) {
            console.warn('LauncherController already initialized');
            return;
        }

        // Mark performance point
        if (window.performanceOptimizer) {
            window.performanceOptimizer.mark('launcher-init-start');
        }

        // Show premium loading screen
        this.displayLoadingScreen();

        // Setup application reset functionality
        this.configureStartOverBehavior();

        // TODO: [OPTIMIZATION] Consider using requestIdleCallback for non-critical animations
        // Schedule loading completion and animation initialization
        setTimeout(() => {
            this.transitionFromLoadingScreen();
            this.initializeFloatingParticles();
            this.enhanceInteractiveElements();
            
            if (window.performanceOptimizer) {
                window.performanceOptimizer.mark('launcher-init-complete');
                window.performanceOptimizer.measure(
                    'launcher-initialization',
                    'launcher-init-start',
                    'launcher-init-complete'
                );
            }
        }, this.LOADING_SCREEN_DURATION_MS);

        this.isInitialized = true;
    }

    /**
     * Display the premium loading screen with fade-in effect
     */
    displayLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.style.display = 'flex';
            loadingScreen.setAttribute('aria-busy', 'true');
            loadingScreen.setAttribute('role', 'status');
        }
    }

    /**
     * Transition from loading screen to main content with smooth animations
     */
    transitionFromLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        const appContainer = document.getElementById('appContainer');

        if (loadingScreen && appContainer) {
            loadingScreen.classList.add('fade-out');
            loadingScreen.setAttribute('aria-busy', 'false');
            appContainer.classList.add('fade-in');
            
            // Remove loading screen from DOM after animation completes
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 600);
        }
    }

    /**
     * Initialize floating particle animations with randomized properties
     * Creates dynamic background effects for premium visual experience
     */
    initializeFloatingParticles() {
        const particlesContainer = document.querySelector('.particles-container');
        if (!particlesContainer) {
            console.warn('Particles container not found');
            return;
        }

        // TODO: [OPTIMIZATION] Consider using CSS custom properties for better performance
        const particles = particlesContainer.querySelectorAll('.particle');
        particles.forEach((particle, index) => {
            // Stagger animation start times for natural effect
            particle.style.animationDelay = `${index * 0.5}s`;
            
            // Randomize horizontal position
            particle.style.left = `${Math.random() * 100}%`;
            
            // Vary animation duration for depth effect (8-12 seconds)
            const duration = 8 + Math.random() * 4;
            particle.style.animationDuration = `${duration}s`;
        });
    }

    /**
     * Enhance interactive elements with premium micro-interactions
     * Adds hover effects and ripple animations to buttons and cards
     */
    enhanceInteractiveElements() {
        // Enhance action cards with smooth transform effects
        const actionCards = document.querySelectorAll('.action-card');
        actionCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-8px) scale(1.02)';
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
            });
        });

        // Add Material Design ripple effect to all interactive buttons
        const interactiveButtons = document.querySelectorAll('.btn-primary, .btn-secondary');
        interactiveButtons.forEach(button => {
            button.addEventListener('click', (event) => this.createMaterialRippleEffect(event));
        });
    }

    /**
     * Create Material Design ripple effect on button click
     * Provides tactile feedback for user interactions
     * @param {MouseEvent} event - The click event containing coordinates
     */
    createMaterialRippleEffect(event) {
        const button = event.currentTarget;
        const rippleElement = document.createElement('span');
        const buttonRect = button.getBoundingClientRect();
        
        // Calculate ripple size (diameter of the button's largest dimension)
        const rippleSize = Math.max(buttonRect.width, buttonRect.height);
        
        // Calculate ripple position relative to button (centered on click point)
        const clickX = event.clientX - buttonRect.left - rippleSize / 2;
        const clickY = event.clientY - buttonRect.top - rippleSize / 2;

        rippleElement.style.cssText = `
      position: absolute;
      width: ${rippleSize}px;
      height: ${rippleSize}px;
      left: ${clickX}px;
      top: ${clickY}px;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      transform: scale(0);
      animation: ripple 0.6s linear;
      pointer-events: none;
    `;

        // Inject ripple animation CSS if not already present
        this.injectRippleAnimationStyles();

        // Ensure button has proper positioning context
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(rippleElement);

        // Remove ripple element after animation completes
        setTimeout(() => {
            rippleElement.remove();
        }, 600);
    }

    /**
     * Inject CSS animation styles for ripple effect
     * Only adds styles once to avoid duplication
     */
    injectRippleAnimationStyles() {
        if (!document.querySelector('#ripple-animation-styles')) {
            const styleElement = document.createElement('style');
            styleElement.id = 'ripple-animation-styles';
            styleElement.textContent = `
        @keyframes ripple {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
      `;
            document.head.appendChild(styleElement);
        }
    }

    /**
     * Configure "Start Over" functionality with context preservation
     * Clears application data while optionally preserving grade/month context
     * Provides smooth page transition for better UX
     */
    configureStartOverBehavior() {
        // Global function accessible from all pages
        window.startOverWithAnimation = () => {
            // Step 1: Capture current curriculum context for preservation
            let preservedGrade = '';
            let preservedMonth = '';

            try {
                const savedData = localStorage.getItem('studentData');
                if (savedData) {
                    const parsedData = JSON.parse(savedData);
                    preservedGrade = parsedData.grade;
                    preservedMonth = parsedData.month;
                }
            } catch (error) {
                console.warn('Could not parse saved data:', error);
            }

            // Step 2: Perform comprehensive data cleanup
            localStorage.clear();
            sessionStorage.clear();

            // Clear browser cookies (if applicable)
            // TODO: [OPTIMIZATION] Consider using IndexedDB for more complex state management
            if (typeof document !== 'undefined') {
                document.cookie.split(";").forEach(function (cookieString) {
                    document.cookie = cookieString
                        .replace(/^ +/, "")
                        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
                });
            }

            // Reset application session state
            if (this.app && typeof this.app.resetSessionData === 'function') {
                this.app.resetSessionData();
            }

            // Step 3: Restore curriculum context and navigate appropriately
            if (preservedGrade && preservedMonth) {
                // Preserve grade/month for continuity
                const contextData = { grade: preservedGrade, month: preservedMonth };
                localStorage.setItem('studentData', JSON.stringify(contextData));
                console.log('🧹 Data cleared (Grade/Month preserved for context)');

                // Navigate to student information page with preserved context
                this.navigateWithPageTransition(
                    `student-information.html?grade=${preservedGrade}&month=${preservedMonth}`
                );
            } else {
                // Complete fresh start - return to landing page
                console.log('🧹 All data cleared - starting fresh!');
                this.navigateWithPageTransition('index.html');
            }
        };
    }

    /**
     * Navigate to a new page with smooth exit animation
     * @param {string} targetUrl - The URL to navigate to
     */
    navigateWithPageTransition(targetUrl) {
        document.body.classList.add('page-exit');
        
        setTimeout(() => {
            window.location.href = targetUrl;
        }, 600); // Match CSS transition duration
    }
}

/**
 * Premium UI Enhancements - Production Grade 2024
 * Implements micro-interactions, animations, glassmorphism effects, and accessibility
 * @module UIEnhancements
 * @version 2.0.0
 */

/* eslint-env browser */
/* global window, document */

class UIEnhancements {
    constructor() {
        this.activeAnimations = new Set();
        this.interactionHandlers = new Map();
        this.darkMode = false;
        this.reducedMotion = false;
        this.hapticSupported = 'vibrate' in navigator;
        
        this.detectUserPreferences();
        this.init();
    }

    /**
     * Detect user preferences for accessibility
     */
    detectUserPreferences() {
        // Detect prefers-reduced-motion
        if (window.matchMedia) {
            const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
            this.reducedMotion = reducedMotionQuery.matches;
            
            reducedMotionQuery.addEventListener('change', (e) => {
                this.reducedMotion = e.matches;
                console.log(`🎯 Reduced motion ${this.reducedMotion ? 'enabled' : 'disabled'}`);
            });
        }
        
        // Detect prefers-color-scheme
        if (window.matchMedia) {
            const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
            this.darkMode = darkModeQuery.matches;
            
            darkModeQuery.addEventListener('change', (e) => {
                this.darkMode = e.matches;
                this.applyColorScheme(e.matches);
            });
        }
        
        console.log(`🎨 User preferences: Dark mode ${this.darkMode ? 'on' : 'off'}, Reduced motion ${this.reducedMotion ? 'on' : 'off'}`);
    }

    /**
     * Initialize all UI enhancements
     */
    init() {
        this.setupHoverEffects();
        this.setupRippleEffects();
        this.setupLoadingSkeletons();
        this.setupSmoothScrolling();
        this.setupFocusEnhancements();
        this.setupTooltips();
        this.setupHapticFeedback();
        this.setupKeyboardShortcuts();
        this.setupFormEnhancements();
        console.log('✨ UI Enhancements initialized (2024 Production Grade)');
    }

    /**
     * Apply color scheme based on user preference
     */
    applyColorScheme(isDark) {
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
        console.log(`🎨 Color scheme set to ${isDark ? 'dark' : 'light'} mode`);
    }

    /**
     * Setup haptic feedback for touch interactions
     */
    setupHapticFeedback() {
        if (!this.hapticSupported) {
            console.log('📱 Haptic feedback not supported on this device');
            return;
        }
        
        const hapticElements = document.querySelectorAll('.btn-primary, .btn-secondary, button, .clickable');
        
        hapticElements.forEach(element => {
            element.addEventListener('click', () => {
                this.triggerHapticFeedback('light');
            });
        });
        
        console.log('📱 Haptic feedback enabled');
    }

    /**
     * Trigger haptic feedback
     * @param {string} type - 'light', 'medium', 'heavy'
     */
    triggerHapticFeedback(type = 'light') {
        if (!this.hapticSupported) return;
        
        const patterns = {
            light: 10,
            medium: 20,
            heavy: 30
        };
        
        navigator.vibrate(patterns[type] || 10);
    }

    /**
     * Setup keyboard shortcuts for power users
     */
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + K for quick navigation
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                this.showQuickNavigation();
            }
            
            // Escape to close modals/overlays
            if (e.key === 'Escape') {
                this.closeOverlays();
            }
        });
        
        console.log('⌨️ Keyboard shortcuts enabled');
    }

    /**
     * Show quick navigation menu
     */
    showQuickNavigation() {
        // TODO: Implement quick navigation overlay
        console.log('🚀 Quick navigation triggered');
    }

    /**
     * Close all overlays
     */
    closeOverlays() {
        const overlays = document.querySelectorAll('.modal, .overlay, .dropdown-open');
        overlays.forEach(overlay => {
            overlay.classList.remove('active', 'open', 'dropdown-open');
        });
    }

    /**
     * Setup form enhancements for better UX
     */
    setupFormEnhancements() {
        const inputs = document.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            // Add floating label effect
            input.addEventListener('focus', () => {
                if (input.parentElement) {
                    input.parentElement.classList.add('input-focused');
                }
            });
            
            input.addEventListener('blur', () => {
                if (input.parentElement) {
                    input.parentElement.classList.remove('input-focused');
                    if (input.value) {
                        input.parentElement.classList.add('input-filled');
                    } else {
                        input.parentElement.classList.remove('input-filled');
                    }
                }
            });
            
            // Real-time validation feedback
            input.addEventListener('input', () => {
                this.validateInput(input);
            });
        });
        
        console.log('📝 Form enhancements enabled');
    }

    /**
     * Validate input and provide visual feedback
     */
    validateInput(input) {
        if (input.validity.valid) {
            input.classList.remove('invalid');
            input.classList.add('valid');
        } else {
            input.classList.remove('valid');
            if (input.value.length > 0) {
                input.classList.add('invalid');
            }
        }
    }

    /**
     * Setup premium hover effects with glassmorphism
     * Respects user's reduced motion preference
     */
    setupHoverEffects() {
        const hoverElements = document.querySelectorAll('.action-card, .btn-primary, .btn-secondary, .glass-card');
        
        hoverElements.forEach(element => {
            // Enhanced hover with smooth transitions
            element.addEventListener('mouseenter', (e) => {
                this.enhanceHoverState(e.target, true);
            });
            
            element.addEventListener('mouseleave', (e) => {
                this.enhanceHoverState(e.target, false);
            });

            // Add cursor tracking for premium effect (only if motion is not reduced)
            if (!this.reducedMotion) {
                element.addEventListener('mousemove', (e) => {
                    this.trackCursorGlow(e, element);
                });
            }
        });
    }

    /**
     * Enhance hover state with premium glassmorphism effects
     * Adapts based on reduced motion preference
     */
    enhanceHoverState(element, isHovering) {
        const duration = this.reducedMotion ? 0.1 : 0.4;
        
        if (isHovering) {
            element.style.transform = this.reducedMotion ? 'none' : 'translateY(-4px) scale(1.02)';
            element.style.boxShadow = '0 16px 48px rgba(31, 38, 135, 0.35), 0 0 20px rgba(102, 126, 234, 0.3)';
            element.style.backdropFilter = 'blur(25px)';
            element.style.transition = `all ${duration}s cubic-bezier(0.4, 0, 0.2, 1)`;
            
            // Add ARIA live region update for screen readers
            element.setAttribute('aria-pressed', 'true');
        } else {
            element.style.transform = 'none';
            element.style.boxShadow = '';
            element.style.backdropFilter = '';
            element.setAttribute('aria-pressed', 'false');
        }
    }

    /**
     * Track cursor for glow effect
     */
    trackCursorGlow(event, element) {
        const rect = element.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        // Create subtle glow following cursor
        element.style.background = `
            radial-gradient(circle at ${x}px ${y}px, 
                rgba(255, 255, 255, 0.25) 0%, 
                rgba(255, 255, 255, 0.1) 50%, 
                rgba(255, 255, 255, 0.05) 100%)
        `;
    }

    /**
     * Setup Material Design ripple effects
     */
    setupRippleEffects() {
        const rippleElements = document.querySelectorAll('.btn-primary, .btn-secondary, button, .clickable');
        
        rippleElements.forEach(element => {
            element.addEventListener('click', (e) => {
                this.createRipple(e, element);
            });
        });
    }

    /**
     * Create ripple animation on click
     */
    createRipple(event, element) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            left: ${x}px;
            top: ${y}px;
            transform: scale(0);
            animation: ripple-animation 0.6s ease-out;
            pointer-events: none;
        `;

        // Ensure element has position context
        if (getComputedStyle(element).position === 'static') {
            element.style.position = 'relative';
        }
        element.style.overflow = 'hidden';

        element.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    /**
     * Setup loading skeleton screens
     */
    setupLoadingSkeletons() {
        const skeletonContainers = document.querySelectorAll('[data-skeleton]');
        
        skeletonContainers.forEach(container => {
            if (container.dataset.skeleton === 'true') {
                this.showLoadingSkeleton(container);
            }
        });
    }

    /**
     * Show loading skeleton with shimmer effect
     */
    showLoadingSkeleton(container) {
        container.classList.add('skeleton-loading');
        
        const skeletonHTML = `
            <div class="skeleton-wrapper">
                <div class="skeleton-line skeleton-shimmer"></div>
                <div class="skeleton-line skeleton-shimmer" style="width: 80%;"></div>
                <div class="skeleton-line skeleton-shimmer" style="width: 60%;"></div>
            </div>
        `;
        
        container.innerHTML = skeletonHTML;
    }

    /**
     * Hide loading skeleton and reveal content
     */
    hideLoadingSkeleton(container, content) {
        container.classList.remove('skeleton-loading');
        container.classList.add('skeleton-loaded');
        
        // Fade in the actual content
        setTimeout(() => {
            container.innerHTML = content;
            container.style.opacity = '0';
            container.style.transition = 'opacity 0.4s ease-in';
            
            requestAnimationFrame(() => {
                container.style.opacity = '1';
            });
        }, 100);
    }

    /**
     * Setup smooth scrolling for anchor links
     */
    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const targetId = anchor.getAttribute('href');
                if (targetId === '#') return;
                
                e.preventDefault();
                const target = document.querySelector(targetId);
                
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    /**
     * Enhance focus states for accessibility and premium feel
     */
    setupFocusEnhancements() {
        const focusableElements = document.querySelectorAll(
            'button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        focusableElements.forEach(element => {
            element.addEventListener('focus', (e) => {
                this.enhanceFocusState(e.target, true);
            });
            
            element.addEventListener('blur', (e) => {
                this.enhanceFocusState(e.target, false);
            });
        });
    }

    /**
     * Enhance focus state with premium animation
     */
    enhanceFocusState(element, isFocused) {
        if (isFocused) {
            element.style.outline = '2px solid rgba(102, 126, 234, 0.8)';
            element.style.outlineOffset = '4px';
            element.style.boxShadow = '0 0 0 4px rgba(102, 126, 234, 0.2)';
            element.style.transition = 'all 0.3s ease-out';
        } else {
            element.style.outline = '';
            element.style.outlineOffset = '';
            element.style.boxShadow = '';
        }
    }

    /**
     * Setup tooltips with premium styling
     */
    setupTooltips() {
        const tooltipElements = document.querySelectorAll('[data-tooltip]');
        
        tooltipElements.forEach(element => {
            element.addEventListener('mouseenter', (e) => {
                this.showTooltip(e.target);
            });
            
            element.addEventListener('mouseleave', (e) => {
                this.hideTooltip(e.target);
            });
        });
    }

    /**
     * Show premium tooltip
     */
    showTooltip(element) {
        const text = element.dataset.tooltip;
        if (!text) return;

        const tooltip = document.createElement('div');
        tooltip.className = 'premium-tooltip';
        tooltip.textContent = text;
        tooltip.style.cssText = `
            position: absolute;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 8px 12px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            white-space: nowrap;
            pointer-events: none;
            z-index: 10000;
            backdrop-filter: blur(10px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            opacity: 0;
            transform: translateY(4px);
            transition: opacity 0.2s ease-out, transform 0.2s ease-out;
        `;

        document.body.appendChild(tooltip);

        const rect = element.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();
        
        tooltip.style.left = `${rect.left + rect.width / 2 - tooltipRect.width / 2}px`;
        tooltip.style.top = `${rect.top - tooltipRect.height - 8}px`;

        element.tooltipElement = tooltip;

        requestAnimationFrame(() => {
            tooltip.style.opacity = '1';
            tooltip.style.transform = 'translateY(0)';
        });
    }

    /**
     * Hide tooltip
     */
    hideTooltip(element) {
        if (element.tooltipElement) {
            element.tooltipElement.style.opacity = '0';
            element.tooltipElement.style.transform = 'translateY(4px)';
            
            setTimeout(() => {
                if (element.tooltipElement) {
                    element.tooltipElement.remove();
                    delete element.tooltipElement;
                }
            }, 200);
        }
    }

    /**
     * Create premium page transition
     */
    createPageTransition(direction = 'out') {
        return new Promise((resolve) => {
            const overlay = document.createElement('div');
            overlay.className = 'page-transition-overlay';
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                z-index: 9999;
                opacity: ${direction === 'out' ? 0 : 1};
                transition: opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1);
                pointer-events: none;
            `;

            document.body.appendChild(overlay);

            requestAnimationFrame(() => {
                overlay.style.opacity = direction === 'out' ? '1' : '0';
            });

            setTimeout(() => {
                if (direction === 'in') {
                    overlay.remove();
                }
                resolve();
            }, 600);
        });
    }

    /**
     * Add optimistic UI update for actions
     */
    optimisticUpdate(element, action, rollback) {
        const originalState = {
            content: element.innerHTML,
            disabled: element.disabled,
            classes: element.className
        };

        // Apply optimistic state
        element.disabled = true;
        element.classList.add('loading');
        
        // Execute action
        action()
            .then(() => {
                element.classList.remove('loading');
                element.classList.add('success');
                
                setTimeout(() => {
                    element.classList.remove('success');
                    element.disabled = false;
                }, 1000);
            })
            .catch(() => {
                // Rollback on error
                element.innerHTML = originalState.content;
                element.disabled = originalState.disabled;
                element.className = originalState.classes;
                
                if (rollback) rollback();
            });
    }

    /**
     * Create particle effect for celebrations
     */
    createParticleEffect(x, y, count = 20) {
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'celebration-particle';
            particle.style.cssText = `
                position: fixed;
                width: 8px;
                height: 8px;
                background: linear-gradient(135deg, #667eea, #764ba2);
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                left: ${x}px;
                top: ${y}px;
            `;

            document.body.appendChild(particle);

            const angle = (Math.PI * 2 * i) / count;
            const velocity = 2 + Math.random() * 2;
            const vx = Math.cos(angle) * velocity;
            const vy = Math.sin(angle) * velocity;

            this.animateParticle(particle, vx, vy);
        }
    }

    /**
     * Animate individual particle
     */
    animateParticle(particle, vx, vy) {
        let x = 0;
        let y = 0;
        let opacity = 1;
        
        const animate = () => {
            x += vx;
            y += vy;
            opacity -= 0.02;
            
            particle.style.transform = `translate(${x}px, ${y}px)`;
            particle.style.opacity = opacity;
            
            if (opacity > 0) {
                requestAnimationFrame(animate);
            } else {
                particle.remove();
            }
        };
        
        animate();
    }
}

// Add ripple animation CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }

    .skeleton-shimmer {
        background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0.1) 0%,
            rgba(255, 255, 255, 0.3) 50%,
            rgba(255, 255, 255, 0.1) 100%
        );
        background-size: 200% 100%;
        animation: shimmer 1.5s infinite;
    }

    @keyframes shimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
    }

    .skeleton-line {
        height: 16px;
        border-radius: 4px;
        margin: 8px 0;
    }

    .hover-lift {
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .hover-lift:hover {
        transform: translateY(-4px);
    }

    /* Loading state for buttons */
    button.loading::after {
        content: '';
        position: absolute;
        width: 16px;
        height: 16px;
        border: 2px solid transparent;
        border-top-color: currentColor;
        border-radius: 50%;
        animation: button-spin 0.6s linear infinite;
        margin-left: 8px;
    }

    @keyframes button-spin {
        to { transform: rotate(360deg); }
    }

    button.success {
        background: linear-gradient(135deg, #27ae60, #229954) !important;
    }
`;
document.head.appendChild(style);

// Initialize global UI enhancements
if (typeof window !== 'undefined') {
    window.uiEnhancements = new UIEnhancements();
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UIEnhancements;
}

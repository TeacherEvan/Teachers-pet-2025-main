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
        const overlay = this.ensureQuickNavigationOverlay();
        const groupsContainer = document.getElementById('quickNavigationGroups');
        const searchInput = document.getElementById('quickNavigationSearch');
        const emptyState = document.getElementById('quickNavigationEmpty');

        if (!groupsContainer || !searchInput || !emptyState) {
            return;
        }

        this.quickNavigationPreviousFocus = document.activeElement;
        this.renderQuickNavigationGroups(groupsContainer);
        this.filterQuickNavigationItems('', emptyState);

        searchInput.value = '';
        overlay.classList.add('active', 'open');
        overlay.setAttribute('aria-hidden', 'false');
        searchInput.focus();
        this.triggerHapticFeedback('medium');

        console.log('🚀 Quick navigation triggered');
    }

    ensureQuickNavigationOverlay() {
        let overlay = document.getElementById('quickNavigationOverlay');
        if (overlay) {
            return overlay;
        }

        overlay = document.createElement('div');
        overlay.id = 'quickNavigationOverlay';
        overlay.classList.add('overlay', 'quick-nav-overlay');
        overlay.setAttribute('aria-hidden', 'true');

        const panel = document.createElement('div');
        panel.classList.add('quick-nav-panel', 'glass-card');
        panel.setAttribute('role', 'dialog');
        panel.setAttribute('aria-modal', 'true');
        panel.setAttribute('aria-label', 'Quick navigation');

        const header = document.createElement('div');
        header.classList.add('quick-nav-header');

        const title = document.createElement('h2');
        title.textContent = 'Quick Navigation';

        const hint = document.createElement('p');
        hint.textContent = 'Jump between pages, sections, and actions.';

        const searchInput = document.createElement('input');
        searchInput.id = 'quickNavigationSearch';
        searchInput.type = 'text';
        searchInput.placeholder = 'Search pages, sections, or actions';
        searchInput.setAttribute('aria-label', 'Filter quick navigation items');
        searchInput.addEventListener('input', () => {
            const emptyState = document.getElementById('quickNavigationEmpty');
            this.filterQuickNavigationItems(searchInput.value, emptyState);
        });
        searchInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                const firstVisible = Array.from(document.querySelectorAll('.quick-nav-item')).find(
                    (item) => item.style.display !== 'none'
                );
                if (firstVisible) {
                    event.preventDefault();
                    firstVisible.click();
                }
            }

            this.handleQuickNavigationKeydown(event);
        });

        header.appendChild(title);
        header.appendChild(hint);
        header.appendChild(searchInput);

        const groupsContainer = document.createElement('div');
        groupsContainer.id = 'quickNavigationGroups';
        groupsContainer.classList.add('quick-nav-groups');

        const emptyState = document.createElement('p');
        emptyState.id = 'quickNavigationEmpty';
        emptyState.classList.add('quick-nav-empty');
        emptyState.textContent = 'No matching navigation items.';

        panel.appendChild(header);
        panel.appendChild(groupsContainer);
        panel.appendChild(emptyState);
        overlay.appendChild(panel);

        overlay.addEventListener('click', (event) => {
            if (event.target === overlay) {
                this.closeOverlays();
            }
        });
        overlay.addEventListener('keydown', (event) => {
            this.handleQuickNavigationKeydown(event);
        });

        document.body.appendChild(overlay);
        return overlay;
    }

    renderQuickNavigationGroups(container) {
        Array.from(container.children).forEach((child) => child.remove());

        const groups = [
            { title: 'Pages', items: this.getQuickNavigationPages() },
            { title: 'Sections', items: this.getQuickNavigationSections() },
            { title: 'Actions', items: this.getQuickNavigationActions() },
        ];

        groups.forEach((group) => {
            if (!group.items.length) {
                return;
            }

            const section = document.createElement('section');
            section.classList.add('quick-nav-group');

            const heading = document.createElement('h3');
            heading.classList.add('quick-nav-group-title');
            heading.textContent = group.title;
            section.appendChild(heading);

            group.items.forEach((item) => {
                section.appendChild(this.createQuickNavigationItem(item));
            });

            container.appendChild(section);
        });
    }

    createQuickNavigationItem(item) {
        const button = document.createElement('button');
        button.type = 'button';
        button.classList.add('quick-nav-item');
        button.textContent = item.label;
        button.dataset.quickNavSearch = `${item.group} ${item.label}`.toLowerCase();

        if (item.isCurrent) {
            button.classList.add('is-current');
        }

        button.addEventListener('click', () => {
            if (typeof item.onSelect === 'function') {
                item.onSelect();
            }
            this.closeOverlays({ restoreFocus: item.restoreFocus !== false });
        });
        button.addEventListener('keydown', (event) => {
            this.handleQuickNavigationKeydown(event);
        });

        return button;
    }

    handleQuickNavigationKeydown(event) {
        if (event.key !== 'Tab') {
            return;
        }

        const overlay = document.getElementById('quickNavigationOverlay');
        if (!overlay || !overlay.classList.contains('active')) {
            return;
        }

        const focusableElements = this.getQuickNavigationFocusableElements(overlay);
        if (focusableElements.length === 0) {
            return;
        }

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey && document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
            return;
        }

        if (!event.shiftKey && document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
        }
    }

    getQuickNavigationFocusableElements(overlay) {
        return Array.from(
            overlay.querySelectorAll('button, input, select, textarea, [tabindex]:not([tabindex="-1"])')
        ).filter((element) => element.style.display !== 'none' && !element.disabled);
    }

    filterQuickNavigationItems(query, emptyState) {
        const normalizedQuery = (query || '').trim().toLowerCase();
        const items = Array.from(document.querySelectorAll('.quick-nav-item'));
        let visibleCount = 0;

        items.forEach((item) => {
            const matches = !normalizedQuery || item.dataset.quickNavSearch.includes(normalizedQuery);
            item.style.display = matches ? '' : 'none';
            if (matches) {
                visibleCount += 1;
            }
        });

        if (emptyState) {
            emptyState.style.display = visibleCount > 0 ? 'none' : 'block';
        }
    }

    getQuickNavigationPages() {
        const currentPath = this.normalizeQuickNavigationPath(
            window.location && window.location.pathname ? window.location.pathname : ''
        );
        const pages = [
            { label: 'Home', href: 'index.html' },
            { label: 'Grade Selection', href: 'grade-selection.html' },
            { label: 'Month Selection', href: 'month-selection.html' },
            { label: 'Student Information', href: 'student-information.html' },
            { label: 'Subjects', href: 'Subjects.html' },
        ];

        return pages.map((page) => ({
            group: 'page',
            label: page.label,
            isCurrent: currentPath.endsWith(page.href.toLowerCase()),
            restoreFocus: currentPath.endsWith(page.href.toLowerCase()),
            onSelect: () => {
                if (!currentPath.endsWith(page.href.toLowerCase())) {
                    window.location.href = page.href;
                }
            },
        }));
    }

    normalizeQuickNavigationPath(pathname) {
        const normalizedPath = String(pathname || '').toLowerCase();

        if (normalizedPath === '' || normalizedPath === '/') {
            return '/index.html';
        }

        if (normalizedPath.endsWith('/')) {
            return `${normalizedPath}index.html`;
        }

        const lastSegment = normalizedPath.split('/').pop();
        if (lastSegment && !lastSegment.includes('.')) {
            return `${normalizedPath}/index.html`;
        }

        return normalizedPath;
    }

    getQuickNavigationSections() {
        const sectionElements = document.querySelectorAll('main[id], section[id], h1[id], h2[id], [data-quick-nav-label]');
        const seen = new Set();

        return Array.from(sectionElements).reduce((items, element) => {
            const identifier = element.id || element.dataset.quickNavLabel;
            if (!identifier || identifier === 'quickNavigationOverlay' || seen.has(identifier)) {
                return items;
            }

            seen.add(identifier);
            const label = element.dataset.quickNavLabel || this.prettifyQuickNavLabel(identifier);
            items.push({
                group: 'section',
                label,
                restoreFocus: false,
                onSelect: () => {
                    if (typeof element.scrollIntoView === 'function') {
                        element.scrollIntoView({ behavior: this.reducedMotion ? 'auto' : 'smooth', block: 'start' });
                    }

                    if (typeof element.focus === 'function') {
                        if (!element.getAttribute('tabindex')) {
                            element.setAttribute('tabindex', '-1');
                        }
                        element.focus({ preventScroll: true });
                    }
                },
            });

            return items;
        }, []);
    }

    getQuickNavigationActions() {
        const actions = [];
        const generateBtn = document.getElementById('generateBtn');
        const firstInput = document.querySelector('input:not([type="hidden"]), textarea, select');

        if (generateBtn) {
            actions.push({
                group: 'action',
                label: 'Generate Comments',
                restoreFocus: false,
                onSelect: () => {
                    generateBtn.click();
                    generateBtn.focus({ preventScroll: true });
                },
            });
        }

        if (typeof window.startOverWithAnimation === 'function') {
            actions.push({
                group: 'action',
                label: 'Start Over',
                restoreFocus: false,
                onSelect: () => window.startOverWithAnimation(),
            });
        } else if (typeof window.startOver === 'function') {
            actions.push({
                group: 'action',
                label: 'Start Over',
                restoreFocus: false,
                onSelect: () => window.startOver(),
            });
        }

        if (firstInput) {
            actions.push({
                group: 'action',
                label: 'Focus First Input',
                restoreFocus: false,
                onSelect: () => firstInput.focus(),
            });
        }

        return actions;
    }

    prettifyQuickNavLabel(identifier) {
        return String(identifier)
            .replace(/([a-z])([A-Z])/g, '$1 $2')
            .replace(/[-_]+/g, ' ')
            .replace(/\s+/g, ' ')
            .trim()
            .replace(/^./, (letter) => letter.toUpperCase());
    }

    /**
     * Close all overlays
     */
    closeOverlays(options = {}) {
        const restoreFocus = options.restoreFocus !== false;
        const overlays = document.querySelectorAll('.modal, .overlay, .dropdown-open');
        overlays.forEach(overlay => {
            overlay.classList.remove('active', 'open', 'dropdown-open');
            if (overlay.id === 'quickNavigationOverlay') {
                overlay.setAttribute('aria-hidden', 'true');
                if (restoreFocus && this.quickNavigationPreviousFocus && typeof this.quickNavigationPreviousFocus.focus === 'function') {
                    this.quickNavigationPreviousFocus.focus();
                }
            }
        });
        this.quickNavigationPreviousFocus = null;
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

    .quick-nav-overlay {
        position: fixed;
        inset: 0;
        display: flex;
        align-items: flex-start;
        justify-content: center;
        padding: 8vh 16px 24px;
        background: rgba(15, 23, 42, 0.72);
        backdrop-filter: blur(12px);
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.25s ease-out;
        z-index: 10000;
    }

    .quick-nav-overlay.active {
        opacity: 1;
        pointer-events: auto;
    }

    .quick-nav-panel {
        width: min(720px, 100%);
        max-height: 80vh;
        overflow: auto;
        border-radius: 20px;
        background: rgba(18, 24, 38, 0.92);
        border: 1px solid rgba(255, 255, 255, 0.14);
        box-shadow: 0 24px 80px rgba(15, 23, 42, 0.4);
        color: #f8fafc;
        padding: 20px;
    }

    .quick-nav-header h2,
    .quick-nav-group-title,
    .quick-nav-header p,
    .quick-nav-item,
    .quick-nav-empty {
        margin: 0;
    }

    .quick-nav-header {
        display: grid;
        gap: 10px;
        margin-bottom: 18px;
    }

    .quick-nav-header p {
        color: rgba(226, 232, 240, 0.78);
        font-size: 0.95rem;
    }

    .quick-nav-header input {
        width: 100%;
        border-radius: 14px;
        border: 1px solid rgba(148, 163, 184, 0.3);
        background: rgba(15, 23, 42, 0.78);
        color: #f8fafc;
        padding: 12px 14px;
    }

    .quick-nav-groups {
        display: grid;
        gap: 16px;
    }

    .quick-nav-group {
        display: grid;
        gap: 8px;
    }

    .quick-nav-group-title {
        font-size: 0.85rem;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: rgba(148, 163, 184, 0.9);
    }

    .quick-nav-item {
        width: 100%;
        text-align: left;
        border: 1px solid rgba(148, 163, 184, 0.18);
        border-radius: 14px;
        background: rgba(30, 41, 59, 0.65);
        color: #f8fafc;
        padding: 12px 14px;
        transition: transform 0.2s ease, background 0.2s ease, border-color 0.2s ease;
    }

    .quick-nav-item:hover,
    .quick-nav-item:focus {
        transform: translateY(-1px);
        background: rgba(51, 65, 85, 0.92);
        border-color: rgba(96, 165, 250, 0.55);
    }

    .quick-nav-item.is-current {
        border-color: rgba(129, 140, 248, 0.7);
        background: rgba(67, 56, 202, 0.26);
    }

    .quick-nav-empty {
        display: none;
        margin-top: 16px;
        color: rgba(226, 232, 240, 0.72);
        text-align: center;
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

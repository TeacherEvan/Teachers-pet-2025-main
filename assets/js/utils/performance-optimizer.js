/**
 * Performance Optimization Utilities - Production Grade 2024
 * Implements lazy loading, code splitting, progressive enhancement, and Core Web Vitals optimization
 * @module PerformanceOptimizer
 * @version 2.0.0
 */

/* eslint-env browser */
/* global window, document, IntersectionObserver */

class PerformanceOptimizer {
    constructor() {
        this.observers = new Map();
        this.loadedModules = new Map();
        this.resourcePrefetchQueue = [];
        this.idleCallbacks = new Map();
        this.performanceMetrics = {
            startTime: performance.now(),
            resourceTimings: [],
            customMarks: [],
            coreWebVitals: {
                LCP: null,
                FID: null,
                CLS: null,
                FCP: null,
                TTFB: null
            }
        };
        
        // Configuration constants optimized for 2024 best practices
        this.LAZY_LOAD_MARGIN = '50px'; // Start loading images 50px before viewport
        this.INTERSECTION_THRESHOLD = 0.01; // Trigger when 1% visible
        this.COMPONENT_LOAD_MARGIN = '100px'; // Load components 100px before viewport
        this.PREFETCH_PRIORITY = ['high', 'medium', 'low'];
        this.IDLE_CALLBACK_TIMEOUT = 2000; // Max wait time for idle callback
        
        this.init();
    }

    /**
     * Initialize performance monitoring and optimizations
     */
    init() {
        // Mark app initialization
        this.mark('app-init-start');
        
        // Setup lazy loading for images
        this.setupLazyImageLoading();
        
        // Setup intersection observer for components
        this.setupComponentLazyLoading();
        
        // Monitor Core Web Vitals
        this.monitorCoreWebVitals();
        
        // Setup resource prefetching
        this.setupResourcePrefetching();
        
        console.log('⚡ Performance Optimizer initialized');
    }

    /**
     * Create performance mark for timing measurements
     */
    mark(name) {
        if (window.performance && window.performance.mark) {
            performance.mark(name);
            this.performanceMetrics.customMarks.push({
                name,
                timestamp: performance.now()
            });
        }
    }

    /**
     * Measure time between two marks
     */
    measure(name, startMark, endMark) {
        if (window.performance && window.performance.measure) {
            try {
                performance.measure(name, startMark, endMark);
                const measures = performance.getEntriesByName(name);
                if (measures.length > 0) {
                    console.log(`📊 ${name}: ${measures[0].duration.toFixed(2)}ms`);
                    return measures[0].duration;
                }
            } catch (e) {
                console.warn(`Could not measure ${name}:`, e);
            }
        }
        return null;
    }

    /**
     * Setup lazy loading for images using Intersection Observer
     */
    setupLazyImageLoading() {
        if (!('IntersectionObserver' in window)) {
            console.warn('IntersectionObserver not supported, falling back to immediate loading');
            return;
        }

        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    this.loadImage(img);
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: `${this.LAZY_LOAD_MARGIN} 0px`,
            threshold: this.INTERSECTION_THRESHOLD
        });

        this.observers.set('images', imageObserver);
        
        // Observe all images with data-src attribute
        this.observeLazyImages();
    }

    /**
     * Observe images that should be lazy loaded
     */
    observeLazyImages() {
        const images = document.querySelectorAll('img[data-src], img[loading="lazy"]');
        const observer = this.observers.get('images');
        
        if (observer) {
            images.forEach(img => observer.observe(img));
        }
    }

    /**
     * Load image with progressive enhancement
     */
    loadImage(img) {
        const src = img.dataset.src || img.src;
        if (!src) return;

        // Create a placeholder effect
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease-in';

        const tempImg = new Image();
        tempImg.onload = () => {
            img.src = src;
            img.style.opacity = '1';
            img.classList.add('loaded');
            this.mark(`image-loaded-${src.substring(0, 30)}`);
        };
        tempImg.onerror = () => {
            console.error(`Failed to load image: ${src}`);
            img.classList.add('error');
        };
        tempImg.src = src;
    }

    /**
     * Setup lazy loading for heavy components
     */
    setupComponentLazyLoading() {
        if (!('IntersectionObserver' in window)) return;

        const componentObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const component = entry.target;
                    const moduleName = component.dataset.lazyModule;
                    
                    if (moduleName) {
                        this.loadModule(moduleName, component);
                    }
                }
            });
        }, {
            rootMargin: `${this.COMPONENT_LOAD_MARGIN} 0px`,
            threshold: this.INTERSECTION_THRESHOLD
        });

        this.observers.set('components', componentObserver);
    }

    /**
     * Dynamically load JavaScript module
     * @param {string} moduleName - Name/path of the module to load
     * @param {HTMLElement} component - Component element that triggered the load
     */
    async loadModule(moduleName, component) {
        if (this.loadedModules.has(moduleName)) {
            console.log(`✅ Module ${moduleName} already loaded`);
            return this.loadedModules.get(moduleName);
        }

        console.log(`🔄 Loading module: ${moduleName}`);
        this.mark(`module-load-start-${moduleName}`);

        try {
            // Dynamic import for code splitting
            const module = await import(moduleName);
            
            this.loadedModules.set(moduleName, module);
            this.mark(`module-load-end-${moduleName}`);
            this.measure(`module-load-${moduleName}`, 
                `module-load-start-${moduleName}`, 
                `module-load-end-${moduleName}`);
            
            // Initialize module if it has an init function
            if (module.init && typeof module.init === 'function') {
                module.init(component);
            }

            component.classList.add('module-loaded');
            return module;
        } catch (error) {
            console.error(`❌ Failed to load module ${moduleName}:`, error);
            component.classList.add('module-error');
            throw error;
        }
    }

    /**
     * Monitor Core Web Vitals (LCP, FID, CLS, FCP, TTFB) - Enhanced 2024 version
     */
    monitorCoreWebVitals() {
        // Monitor Largest Contentful Paint (LCP) - Target: <2.5s
        if ('PerformanceObserver' in window) {
            try {
                const lcpObserver = new PerformanceObserver((entryList) => {
                    const entries = entryList.getEntries();
                    const lastEntry = entries[entries.length - 1];
                    const lcpValue = lastEntry.renderTime || lastEntry.loadTime;
                    this.performanceMetrics.coreWebVitals.LCP = lcpValue;
                    
                    const rating = lcpValue <= 2500 ? '✅ Good' : lcpValue <= 4000 ? '⚠️ Needs Improvement' : '❌ Poor';
                    console.log(`📊 LCP: ${lcpValue.toFixed(2)}ms ${rating}`);
                });
                lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
            } catch (e) {
                console.warn('Could not observe LCP:', e);
            }

            // Monitor First Input Delay (FID) - Target: <100ms
            try {
                const fidObserver = new PerformanceObserver((entryList) => {
                    entryList.getEntries().forEach(entry => {
                        const fidValue = entry.processingStart - entry.startTime;
                        this.performanceMetrics.coreWebVitals.FID = fidValue;
                        
                        const rating = fidValue <= 100 ? '✅ Good' : fidValue <= 300 ? '⚠️ Needs Improvement' : '❌ Poor';
                        console.log(`📊 FID: ${fidValue.toFixed(2)}ms ${rating}`);
                    });
                });
                fidObserver.observe({ entryTypes: ['first-input'] });
            } catch (e) {
                console.warn('Could not observe FID:', e);
            }

            // Monitor Cumulative Layout Shift (CLS) - Target: <0.1
            try {
                let clsScore = 0;
                const clsObserver = new PerformanceObserver((entryList) => {
                    entryList.getEntries().forEach(entry => {
                        if (!entry.hadRecentInput) {
                            clsScore += entry.value;
                        }
                    });
                    this.performanceMetrics.coreWebVitals.CLS = clsScore;
                    
                    const rating = clsScore <= 0.1 ? '✅ Good' : clsScore <= 0.25 ? '⚠️ Needs Improvement' : '❌ Poor';
                    console.log(`📊 CLS: ${clsScore.toFixed(4)} ${rating}`);
                });
                clsObserver.observe({ entryTypes: ['layout-shift'] });
            } catch (e) {
                console.warn('Could not observe CLS:', e);
            }

            // Monitor First Contentful Paint (FCP) - Target: <1.8s
            try {
                const fcpObserver = new PerformanceObserver((entryList) => {
                    const entries = entryList.getEntries();
                    const fcpEntry = entries[0];
                    if (fcpEntry) {
                        const fcpValue = fcpEntry.startTime;
                        this.performanceMetrics.coreWebVitals.FCP = fcpValue;
                        
                        const rating = fcpValue <= 1800 ? '✅ Good' : fcpValue <= 3000 ? '⚠️ Needs Improvement' : '❌ Poor';
                        console.log(`📊 FCP: ${fcpValue.toFixed(2)}ms ${rating}`);
                    }
                });
                fcpObserver.observe({ entryTypes: ['paint'] });
            } catch (e) {
                console.warn('Could not observe FCP:', e);
            }

            // Monitor Time to First Byte (TTFB) - Target: <600ms
            try {
                const navigationTiming = performance.getEntriesByType('navigation')[0];
                if (navigationTiming) {
                    const ttfbValue = navigationTiming.responseStart - navigationTiming.requestStart;
                    this.performanceMetrics.coreWebVitals.TTFB = ttfbValue;
                    
                    const rating = ttfbValue <= 600 ? '✅ Good' : ttfbValue <= 1500 ? '⚠️ Needs Improvement' : '❌ Poor';
                    console.log(`📊 TTFB: ${ttfbValue.toFixed(2)}ms ${rating}`);
                }
            } catch (e) {
                console.warn('Could not measure TTFB:', e);
            }
        }
    }

    /**
     * Setup resource prefetching for next pages - Enhanced with priority hints
     * Prefetches likely next pages based on user's current position in wizard flow
     */
    setupResourcePrefetching() {
        // Detect current page and prefetch likely next resources
        const currentPage = window.location.pathname;
        const prefetchMap = {
            'index.html': [
                { url: 'grade-selection.html', priority: 'high', type: 'document' },
                { url: 'assets/css/components.css', priority: 'medium', type: 'style' }
            ],
            'grade-selection.html': [
                { url: 'month-selection.html', priority: 'high', type: 'document' }
            ],
            'month-selection.html': [
                { url: 'student-information.html', priority: 'high', type: 'document' }
            ],
            'student-information.html': [
                { url: 'Subjects.html', priority: 'high', type: 'document' },
                { url: 'assets/js/curriculum/curriculum-loader.js', priority: 'medium', type: 'script' }
            ]
        };

        const pageName = currentPage.split('/').pop() || 'index.html';
        const resourcesToPrefetch = prefetchMap[pageName];

        if (resourcesToPrefetch) {
            // Use requestIdleCallback for non-critical prefetching
            this.requestIdleCallback(() => {
                this.prefetchResources(resourcesToPrefetch);
            });
        }
        
        // Add DNS prefetch for external resources
        this.setupDNSPrefetch();
        
        // Add preconnect for critical third-party origins
        this.setupPreconnect();
    }

    /**
     * Setup DNS prefetch for external resources
     */
    setupDNSPrefetch() {
        const externalDomains = [
            'https://fonts.googleapis.com',
            'https://fonts.gstatic.com',
            'https://images.unsplash.com'
        ];
        
        externalDomains.forEach(domain => {
            const link = document.createElement('link');
            link.rel = 'dns-prefetch';
            link.href = domain;
            document.head.appendChild(link);
        });
        
        console.log('🔗 DNS prefetch configured for external domains');
    }

    /**
     * Setup preconnect for critical third-party origins
     */
    setupPreconnect() {
        const criticalOrigins = [
            'https://fonts.googleapis.com',
            'https://fonts.gstatic.com'
        ];
        
        criticalOrigins.forEach(origin => {
            const link = document.createElement('link');
            link.rel = 'preconnect';
            link.href = origin;
            link.crossOrigin = 'anonymous';
            document.head.appendChild(link);
        });
        
        console.log('🔗 Preconnect configured for critical origins');
    }

    /**
     * Prefetch resources using link rel="prefetch" with priority hints
     * @param {Array<{url: string, priority: string, type: string}>} resources - Array of resource objects to prefetch
     */
    prefetchResources(resources) {
        // Sort by priority
        const sortedResources = resources.sort((a, b) => {
            const priorityOrder = { high: 0, medium: 1, low: 2 };
            return priorityOrder[a.priority] - priorityOrder[b.priority];
        });
        
        sortedResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.href = resource.url;
            link.as = resource.type;
            
            // Add fetchpriority for supported browsers
            if ('fetchPriority' in link) {
                link.fetchPriority = resource.priority;
            }
            
            document.head.appendChild(link);
            console.log(`⚡ Prefetching (${resource.priority}): ${resource.url}`);
        });
    }

    /**
     * Debounce function for performance optimization
     */
    debounce(func, wait = 150) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Throttle function for performance optimization
     */
    throttle(func, limit = 100) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    /**
     * Request idle callback wrapper with fallback and timeout support
     * @param {Function} callback - Function to execute when idle
     * @param {Object} options - Options including timeout
     * @returns {number} - Callback ID
     */
    requestIdleCallback(callback, options = {}) {
        const timeout = options.timeout || this.IDLE_CALLBACK_TIMEOUT;
        
        if ('requestIdleCallback' in window) {
            const id = window.requestIdleCallback(callback, { timeout });
            this.idleCallbacks.set(id, { callback, timestamp: Date.now() });
            return id;
        }
        
        // Fallback for browsers without requestIdleCallback
        const id = setTimeout(() => {
            callback({ 
                didTimeout: false, 
                timeRemaining: () => 50 
            });
        }, 1);
        
        this.idleCallbacks.set(id, { callback, timestamp: Date.now() });
        return id;
    }
    
    /**
     * Cancel idle callback
     * @param {number} id - Callback ID to cancel
     */
    cancelIdleCallback(id) {
        if ('cancelIdleCallback' in window) {
            window.cancelIdleCallback(id);
        } else {
            clearTimeout(id);
        }
        this.idleCallbacks.delete(id);
    }
    
    /**
     * Schedule non-critical task to run when browser is idle
     * @param {Function} task - Task to execute
     * @param {string} taskName - Name for logging
     */
    scheduleIdleTask(task, taskName = 'idle-task') {
        this.requestIdleCallback((deadline) => {
            this.mark(`${taskName}-start`);
            
            try {
                task(deadline);
                this.mark(`${taskName}-end`);
                this.measure(taskName, `${taskName}-start`, `${taskName}-end`);
            } catch (error) {
                console.error(`Error in idle task ${taskName}:`, error);
            }
        });
    }

    /**
     * Get comprehensive performance report with Core Web Vitals
     * @returns {Object} - Detailed performance metrics
     */
    getPerformanceReport() {
        const endTime = performance.now();
        const totalTime = endTime - this.performanceMetrics.startTime;
        const navigationTiming = performance.getEntriesByType('navigation')[0];

        return {
            totalTime: totalTime.toFixed(2),
            coreWebVitals: {
                LCP: this.performanceMetrics.coreWebVitals.LCP?.toFixed(2) || 'N/A',
                FID: this.performanceMetrics.coreWebVitals.FID?.toFixed(2) || 'N/A',
                CLS: this.performanceMetrics.coreWebVitals.CLS?.toFixed(4) || 'N/A',
                FCP: this.performanceMetrics.coreWebVitals.FCP?.toFixed(2) || 'N/A',
                TTFB: this.performanceMetrics.coreWebVitals.TTFB?.toFixed(2) || 'N/A'
            },
            marks: this.performanceMetrics.customMarks,
            resources: {
                total: performance.getEntriesByType('resource').length,
                scripts: performance.getEntriesByType('resource').filter(r => r.initiatorType === 'script').length,
                stylesheets: performance.getEntriesByType('resource').filter(r => r.initiatorType === 'link' || r.initiatorType === 'css').length,
                images: performance.getEntriesByType('resource').filter(r => r.initiatorType === 'img').length,
                fonts: performance.getEntriesByType('resource').filter(r => r.name.includes('.woff') || r.name.includes('.ttf')).length
            },
            navigation: navigationTiming ? {
                domContentLoaded: (navigationTiming.domContentLoadedEventEnd - navigationTiming.domContentLoadedEventStart).toFixed(2),
                loadComplete: (navigationTiming.loadEventEnd - navigationTiming.loadEventStart).toFixed(2),
                domInteractive: navigationTiming.domInteractive?.toFixed(2) || 'N/A'
            } : null,
            loadedModules: Array.from(this.loadedModules.keys()),
            idleCallbacks: this.idleCallbacks.size,
            observersActive: this.observers.size
        };
    }

    /**
     * Log comprehensive performance report to console
     */
    logPerformanceReport() {
        const report = this.getPerformanceReport();
        console.group('⚡ Performance Report - Production Grade 2024');
        console.log(`%c🕐 Total Runtime: ${report.totalTime}ms`, 'color: #4CAF50; font-weight: bold');
        
        console.group('📊 Core Web Vitals');
        console.log(`LCP (Largest Contentful Paint): ${report.coreWebVitals.LCP}ms`);
        console.log(`FID (First Input Delay): ${report.coreWebVitals.FID}ms`);
        console.log(`CLS (Cumulative Layout Shift): ${report.coreWebVitals.CLS}`);
        console.log(`FCP (First Contentful Paint): ${report.coreWebVitals.FCP}ms`);
        console.log(`TTFB (Time to First Byte): ${report.coreWebVitals.TTFB}ms`);
        console.groupEnd();
        
        console.group('📦 Resources Loaded');
        console.log(`Total: ${report.resources.total}`);
        console.log(`Scripts: ${report.resources.scripts}`);
        console.log(`Stylesheets: ${report.resources.stylesheets}`);
        console.log(`Images: ${report.resources.images}`);
        console.log(`Fonts: ${report.resources.fonts}`);
        console.groupEnd();
        
        if (report.navigation) {
            console.group('🚀 Navigation Timing');
            console.log(`DOM Content Loaded: ${report.navigation.domContentLoaded}ms`);
            console.log(`Load Complete: ${report.navigation.loadComplete}ms`);
            console.log(`DOM Interactive: ${report.navigation.domInteractive}ms`);
            console.groupEnd();
        }
        
        console.group('🔧 Optimization Status');
        console.log(`Loaded Modules: ${report.loadedModules.length}`);
        console.log(`Active Observers: ${report.observersActive}`);
        console.log(`Idle Callbacks: ${report.idleCallbacks}`);
        console.groupEnd();
        
        console.log('Custom Marks:', report.marks);
        console.groupEnd();
        
        return report;
    }
    
    /**
     * Export performance metrics for analytics
     * @returns {Object} - Metrics formatted for analytics
     */
    exportMetrics() {
        const report = this.getPerformanceReport();
        return {
            timestamp: new Date().toISOString(),
            page: window.location.pathname,
            metrics: {
                totalTime: parseFloat(report.totalTime),
                lcp: report.coreWebVitals.LCP !== 'N/A' ? parseFloat(report.coreWebVitals.LCP) : null,
                fid: report.coreWebVitals.FID !== 'N/A' ? parseFloat(report.coreWebVitals.FID) : null,
                cls: report.coreWebVitals.CLS !== 'N/A' ? parseFloat(report.coreWebVitals.CLS) : null,
                fcp: report.coreWebVitals.FCP !== 'N/A' ? parseFloat(report.coreWebVitals.FCP) : null,
                ttfb: report.coreWebVitals.TTFB !== 'N/A' ? parseFloat(report.coreWebVitals.TTFB) : null
            },
            resources: report.resources
        };
    }
}

// Initialize global performance optimizer
if (typeof window !== 'undefined') {
    window.performanceOptimizer = new PerformanceOptimizer();
    
    // Log performance report when page is fully loaded
    window.addEventListener('load', () => {
        setTimeout(() => {
            window.performanceOptimizer.mark('app-fully-loaded');
            window.performanceOptimizer.logPerformanceReport();
        }, 1000);
    });
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PerformanceOptimizer;
}

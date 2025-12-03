/**
 * Performance Optimization Utilities
 * Implements lazy loading, code splitting, and progressive enhancement
 * @module PerformanceOptimizer
 */

/* eslint-env browser */
/* global window, document, IntersectionObserver */

class PerformanceOptimizer {
    constructor() {
        this.observers = new Map();
        this.loadedModules = new Map();
        this.performanceMetrics = {
            startTime: performance.now(),
            resourceTimings: [],
            customMarks: []
        };
        
        // Configuration constants
        this.LAZY_LOAD_MARGIN = '50px'; // Start loading images 50px before viewport
        this.INTERSECTION_THRESHOLD = 0.01; // Trigger when 1% visible
        this.COMPONENT_LOAD_MARGIN = '100px'; // Load components 100px before viewport
        
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
     * Monitor Core Web Vitals (LCP, FID, CLS)
     */
    monitorCoreWebVitals() {
        // Monitor Largest Contentful Paint (LCP)
        if ('PerformanceObserver' in window) {
            try {
                const lcpObserver = new PerformanceObserver((entryList) => {
                    const entries = entryList.getEntries();
                    const lastEntry = entries[entries.length - 1];
                    console.log(`📊 LCP: ${lastEntry.renderTime || lastEntry.loadTime}ms`);
                });
                lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
            } catch (e) {
                console.warn('Could not observe LCP:', e);
            }

            // Monitor First Input Delay (FID)
            try {
                const fidObserver = new PerformanceObserver((entryList) => {
                    entryList.getEntries().forEach(entry => {
                        console.log(`📊 FID: ${entry.processingStart - entry.startTime}ms`);
                    });
                });
                fidObserver.observe({ entryTypes: ['first-input'] });
            } catch (e) {
                console.warn('Could not observe FID:', e);
            }

            // Monitor Cumulative Layout Shift (CLS)
            try {
                let clsScore = 0;
                const clsObserver = new PerformanceObserver((entryList) => {
                    entryList.getEntries().forEach(entry => {
                        if (!entry.hadRecentInput) {
                            clsScore += entry.value;
                        }
                    });
                    console.log(`📊 CLS: ${clsScore.toFixed(4)}`);
                });
                clsObserver.observe({ entryTypes: ['layout-shift'] });
            } catch (e) {
                console.warn('Could not observe CLS:', e);
            }
        }
    }

    /**
     * Setup resource prefetching for next pages
     * Prefetches likely next pages based on user's current position in wizard flow
     */
    setupResourcePrefetching() {
        // Detect current page and prefetch likely next resources
        const currentPage = window.location.pathname;
        const prefetchMap = {
            'index.html': ['grade-selection.html', 'assets/css/components.css'],
            'grade-selection.html': ['month-selection.html'],
            'month-selection.html': ['student-information.html'],
            'student-information.html': ['Subjects.html', 'assets/js/curriculum/curriculum-loader.js']
        };

        const pageName = currentPage.split('/').pop() || 'index.html';
        const resourcesToPrefetch = prefetchMap[pageName];

        if (resourcesToPrefetch) {
            this.prefetchResources(resourcesToPrefetch);
        }
    }

    /**
     * Prefetch resources using link rel="prefetch"
     * @param {string[]} resources - Array of resource URLs to prefetch
     */
    prefetchResources(resources) {
        resources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.href = resource;
            link.as = resource.endsWith('.html') ? 'document' : 'script';
            document.head.appendChild(link);
            console.log(`⚡ Prefetching: ${resource}`);
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
     * Request idle callback wrapper with fallback
     */
    requestIdleCallback(callback) {
        if ('requestIdleCallback' in window) {
            return window.requestIdleCallback(callback);
        }
        // Fallback for browsers without requestIdleCallback
        return setTimeout(() => callback({ didTimeout: false, timeRemaining: () => 50 }), 1);
    }

    /**
     * Get performance report
     */
    getPerformanceReport() {
        const endTime = performance.now();
        const totalTime = endTime - this.performanceMetrics.startTime;

        return {
            totalTime: totalTime.toFixed(2),
            marks: this.performanceMetrics.customMarks,
            resources: performance.getEntriesByType('resource'),
            navigation: performance.getEntriesByType('navigation')[0],
            loadedModules: Array.from(this.loadedModules.keys())
        };
    }

    /**
     * Log performance report to console
     */
    logPerformanceReport() {
        const report = this.getPerformanceReport();
        console.group('⚡ Performance Report');
        console.log(`Total Time: ${report.totalTime}ms`);
        console.log(`Loaded Modules: ${report.loadedModules.length}`);
        console.log('Custom Marks:', report.marks);
        console.groupEnd();
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

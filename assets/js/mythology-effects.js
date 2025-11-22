/**
 * Mythology Theme Effects
 * Handles the "Stone Carving" interactions: Shake, Debris, and Shatter.
 */

class MythologyTheme {
    constructor() {
        this.container = document.querySelector('.container');
        this.inputs = document.querySelectorAll('input, textarea, select');
        this.isShattering = false;

        if (this.container) {
            this.init();
        }
    }

    init() {
        // Apply theme class
        document.body.classList.add('mythology-mode');
        this.container.classList.add('mythology-tablet');

        // Attach input listeners
        this.inputs.forEach(input => {
            input.addEventListener('input', (e) => this.handleInput(e));
            input.addEventListener('focus', (e) => this.handleFocus(e));
        });

        // Intercept navigation
        this.interceptNavigation();
    }

    handleInput(e) {
        if (this.isShattering) return;

        // 1. Shake Effect
        this.triggerShake();

        // 2. Debris Effect
        // Get input coordinates
        const rect = e.target.getBoundingClientRect();
        // Estimate caret position (rough approximation for performance)
        // For textareas/inputs, we'll just spawn near the right side or random x
        const x = rect.left + Math.random() * rect.width;
        const y = rect.top + rect.height; // Fall from bottom of input? Or top?
        // Actually, "breaking off" implies from the carving action.
        // Let's spawn from the bottom-right of the input, as if chips are falling.

        this.spawnDebris(x, y, 3); // Spawn 3 particles
    }

    handleFocus(e) {
        // Subtle shake on focus
        this.triggerShake();
    }

    triggerShake() {
        this.container.classList.remove('myth-shaking');
        void this.container.offsetWidth; // Trigger reflow
        this.container.classList.add('myth-shaking');
    }

    spawnDebris(x, y, count) {
        for (let i = 0; i < count; i++) {
            const debris = document.createElement('div');
            debris.classList.add('myth-debris');

            // Random size
            const size = 2 + Math.random() * 4; // 2-6px
            debris.style.width = `${size}px`;
            debris.style.height = `${size}px`;

            // Random shape
            debris.style.borderRadius = `${Math.random() * 50}% ${Math.random() * 50}% ${Math.random() * 50}% ${Math.random() * 50}%`;

            // Start position
            debris.style.left = `${x + (Math.random() * 20 - 10)}px`;
            debris.style.top = `${y + (Math.random() * 10 - 5)}px`;

            document.body.appendChild(debris);

            // Physics animation
            const velocityX = (Math.random() - 0.5) * 4; // -2 to 2
            const velocityY = Math.random() * 2; // 0 to 2 (down)
            const gravity = 0.5;
            let currentX = 0;
            let currentY = 0;
            let opacity = 1;
            let rotation = 0;
            const rotationSpeed = (Math.random() - 0.5) * 10;

            const animate = () => {
                currentX += velocityX;
                currentY += velocityY + gravity * (currentY / 5); // Accelerate
                rotation += rotationSpeed;
                opacity -= 0.02;

                debris.style.transform = `translate(${currentX}px, ${currentY}px) rotate(${rotation}deg)`;
                debris.style.opacity = opacity;

                if (opacity > 0) {
                    requestAnimationFrame(animate);
                } else {
                    debris.remove();
                }
            };

            requestAnimationFrame(animate);
        }
    }

    interceptNavigation() {
        // We need to hook into the app's navigation
        // Since we can't easily overwrite the class method instance directly without access to the instance variable 'app'
        // We will rely on the fact that 'app' is a global variable in student-information.html

        const checkApp = setInterval(() => {
            if (window.app && window.app.navigateWithTransition) {
                clearInterval(checkApp);
                const originalNavigate = window.app.navigateWithTransition.bind(window.app);

                window.app.navigateWithTransition = (url) => {
                    // Check if we are navigating to Subjects.html (the "Proceed" action)
                    if (url.includes('Subjects.html')) {
                        this.shatterAndNavigate(() => originalNavigate(url));
                    } else {
                        originalNavigate(url);
                    }
                };
                console.log('🏛️ Mythology Theme: Navigation intercepted');
            }
        }, 100);
    }

    shatterAndNavigate(callback) {
        if (this.isShattering) return;
        this.isShattering = true;

        console.log('🏛️ Mythology Theme: Shattering...');

        // 1. Create Grid
        const rect = this.container.getBoundingClientRect();
        const tileSize = 40; // 40x40px tiles
        const cols = Math.ceil(rect.width / tileSize);
        const rows = Math.ceil(rect.height / tileSize);

        const containerStyle = window.getComputedStyle(this.container);
        const bgImage = containerStyle.backgroundImage;
        const bgColor = containerStyle.backgroundColor;

        // Create a container for tiles to avoid body scroll issues
        const tileContainer = document.createElement('div');
        tileContainer.style.position = 'fixed';
        tileContainer.style.top = '0';
        tileContainer.style.left = '0';
        tileContainer.style.width = '100%';
        tileContainer.style.height = '100%';
        tileContainer.style.pointerEvents = 'none';
        tileContainer.style.zIndex = '9999';
        document.body.appendChild(tileContainer);

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const tile = document.createElement('div');
                tile.classList.add('myth-shatter-tile');

                const width = Math.min(tileSize, rect.width - c * tileSize);
                const height = Math.min(tileSize, rect.height - r * tileSize);

                tile.style.width = `${width}px`;
                tile.style.height = `${height}px`;
                tile.style.left = `${rect.left + c * tileSize}px`;
                tile.style.top = `${rect.top + r * tileSize}px`;

                // Attempt to match background (tricky with noise, but we'll use the generic stone style)
                // We rely on the CSS class .myth-shatter-tile having the same texture

                tileContainer.appendChild(tile);

                // Animate
                // Calculate distance from center for explosion direction
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                const tileX = rect.left + c * tileSize + width / 2;
                const tileY = rect.top + r * tileSize + height / 2;

                const dirX = (tileX - centerX) / (rect.width / 2);
                const dirY = (tileY - centerY) / (rect.height / 2);

                // Randomize slightly
                const destX = dirX * 200 + (Math.random() - 0.5) * 100;
                const destY = dirY * 200 + 500; // Fall down
                const rotateX = Math.random() * 720;
                const rotateY = Math.random() * 720;
                const delay = Math.random() * 0.5; // Random start delay

                tile.style.transition = `transform 2s cubic-bezier(0.25, 1, 0.5, 1) ${delay}s, opacity 2s ease-in ${delay}s`;

                // Trigger reflow
                void tile.offsetWidth;

                // Apply transform
                requestAnimationFrame(() => {
                    tile.style.transform = `translate(${destX}px, ${destY}px) rotate3d(1, 1, 1, ${rotateX}deg)`;
                    tile.style.opacity = '0';
                });
            }
        }

        // Hide original container
        this.container.style.opacity = '0';
        this.container.style.transition = 'opacity 0.1s';

        // Wait 3 seconds then navigate
        setTimeout(() => {
            callback();
        }, 3000);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Small delay to ensure main app is ready
    setTimeout(() => {
        window.mythologyTheme = new MythologyTheme();
    }, 500);
});

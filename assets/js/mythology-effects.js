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
        // Shatter effect disabled by user request
        // Keeping method stub for potential future use
        console.log('🏛️ Mythology Theme: Navigation intercept disabled');
    }

    shatterAndNavigate(callback) {
        // Disabled
        callback();
    }
}// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Small delay to ensure main app is ready
    setTimeout(() => {
        window.mythologyTheme = new MythologyTheme();
    }, 500);
});

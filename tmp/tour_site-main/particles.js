// particles.js

const PARTICLES_ENABLED = true;

if (PARTICLES_ENABLED) {
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d', { alpha: true });

    let width, height;
    let particles = [];
    const NUM_PARTICLES = 25;

    // Interaction state
    let pointerX = -1000;
    let pointerY = -1000;
    let isPointerActive = false;

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        // Adjust for high DPI displays
        const dpr = window.devicePixelRatio || 1;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);
    }

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            // Slow diagonal movement
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = Math.random() * 0.5 + 0.2; // Mostly moving downwards/diagonally
            
            // Random size and opacity
            this.radius = Math.random() * 2 + 1;
            this.baseAlpha = Math.random() * 0.5 + 0.1;
            this.alpha = this.baseAlpha;
            this.color = `rgba(0, 255, 157, `; // #00ff9d
        }

        update() {
            // Mouse/Touch repulsion
            if (isPointerActive) {
                const dx = this.x - pointerX;
                const dy = this.y - pointerY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                const repulseRadius = 150;
                if (distance < repulseRadius) {
                    const force = (repulseRadius - distance) / repulseRadius;
                    this.vx += (dx / distance) * force * 1.5;
                    this.vy += (dy / distance) * force * 1.5;
                }
            }

            // Normal movement
            this.x += this.vx;
            this.y += this.vy;

            // Damping (return to normal speed)
            this.vx *= 0.98;
            this.vy *= 0.98;

            // Keep base movement
            if (Math.abs(this.vx) < 0.2) this.vx += (Math.random() - 0.5) * 0.05;
            if (this.vy < 0.2) this.vy += 0.02;

            // Screen wrap
            if (this.x < -10) this.x = width + 10;
            if (this.x > width + 10) this.x = -10;
            if (this.y < -10) this.y = height + 10;
            if (this.y > height + 10) this.y = -10;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color + this.alpha + ')';
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#00ff9d';
            ctx.fill();
            ctx.shadowBlur = 0; // Reset for performance
        }
    }

    function initParticles() {
        resize();
        window.addEventListener('resize', resize);
        
        particles = [];
        for (let i = 0; i < NUM_PARTICLES; i++) {
            particles.push(new Particle());
        }

        // Pointer events
        window.addEventListener('pointerdown', (e) => {
            isPointerActive = true;
            pointerX = e.clientX;
            pointerY = e.clientY;
        });

        window.addEventListener('pointermove', (e) => {
            if (isPointerActive) {
                pointerX = e.clientX;
                pointerY = e.clientY;
            }
        });

        window.addEventListener('pointerup', () => {
            isPointerActive = false;
        });
        
        // Mobile touch events
        window.addEventListener('touchstart', (e) => {
            isPointerActive = true;
            pointerX = e.touches[0].clientX;
            pointerY = e.touches[0].clientY;
        });
        
        window.addEventListener('touchend', () => {
            isPointerActive = false;
        });

        animate();
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
        }

        requestAnimationFrame(animate);
    }

    // Start
    initParticles();
}

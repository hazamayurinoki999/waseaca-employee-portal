// ===================================
// ANIMATION CONFIGURATION
// ===================================

let canvas, ctx;
let particles = [];
let animationFrame;
let currentTheme = 'light';
let currentSeason = 'spring';

// Season configurations
const SEASON_CONFIGS = {
    spring: {
        particleCount: 30,
        shapes: ['petal', 'cube', 'sphere'],
        colors: {
            light: ['#FFB3D9', '#FBD3E9', '#C2F0FC', '#FFDEE9'],
            dark: ['#FF6B9D', '#FB91C9', '#82D0FC', '#FFAEC9']
        }
    },
    summer: {
        particleCount: 40,
        shapes: ['cube', 'sphere', 'pyramid'],
        colors: {
            light: ['#4FACFE', '#00F2FE', '#43E97B', '#38F9D7'],
            dark: ['#2F8CDE', '#00D2DE', '#23C95B', '#18D9B7']
        }
    },
    autumn: {
        particleCount: 35,
        shapes: ['leaf', 'cube', 'hexagon'],
        colors: {
            light: ['#FA709A', '#FEE140', '#FFB347', '#FF8C69'],
            dark: ['#DA507A', '#DEC120', '#DF9327', '#DF6C49']
        }
    },
    winter: {
        particleCount: 45,
        shapes: ['snowflake', 'crystal', 'hexagon'],
        colors: {
            light: ['#A8EDEA', '#FED6E3', '#D4F1F4', '#C2E9FB'],
            dark: ['#88CDCA', '#DEB6C3', '#B4D1D4', '#A2C9DB']
        }
    }
};

// ===================================
// PARTICLE CLASS
// ===================================

class Particle {
    constructor() {
        this.reset();
        this.y = Math.random() * canvas.height;
        this.shape = this.getRandomShape();
        this.pulseOffset = Math.random() * Math.PI * 2;
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = -50;
        this.size = Math.random() * 30 + 10;
        this.speedY = Math.random() * 0.5 + 0.2;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.02;
        this.opacity = Math.random() * 0.3 + 0.2;
        this.color = this.getRandomColor();
    }

    getRandomShape() {
        const config = SEASON_CONFIGS[currentSeason];
        const shapes = config.shapes;
        return shapes[Math.floor(Math.random() * shapes.length)];
    }

    getRandomColor() {
        const config = SEASON_CONFIGS[currentSeason];
        const colors = config.colors[currentTheme];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
        this.y += this.speedY;
        this.x += this.speedX;
        this.rotation += this.rotationSpeed;

        // Pulse effect
        const pulse = Math.sin(Date.now() * 0.001 + this.pulseOffset) * 0.1 + 1;
        this.currentSize = this.size * pulse;

        // Reset if out of bounds
        if (this.y > canvas.height + 50) {
            this.reset();
        }

        if (this.x < -50 || this.x > canvas.width + 50) {
            this.x = Math.random() * canvas.width;
        }
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.globalAlpha = this.opacity;

        switch (this.shape) {
            case 'cube':
                this.drawCube();
                break;
            case 'sphere':
                this.drawSphere();
                break;
            case 'pyramid':
                this.drawPyramid();
                break;
            case 'hexagon':
                this.drawHexagon();
                break;
            case 'petal':
                this.drawPetal();
                break;
            case 'leaf':
                this.drawLeaf();
                break;
            case 'snowflake':
                this.drawSnowflake();
                break;
            case 'crystal':
                this.drawCrystal();
                break;
            default:
                this.drawCube();
        }

        ctx.restore();
    }

    drawCube() {
        const size = this.currentSize;
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;

        // Front face
        ctx.strokeRect(-size / 2, -size / 2, size, size);

        // 3D effect
        ctx.beginPath();
        ctx.moveTo(-size / 2, -size / 2);
        ctx.lineTo(-size / 2 + size / 4, -size / 2 - size / 4);
        ctx.lineTo(size / 2 + size / 4, -size / 2 - size / 4);
        ctx.lineTo(size / 2, -size / 2);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(size / 2, -size / 2);
        ctx.lineTo(size / 2 + size / 4, -size / 2 - size / 4);
        ctx.lineTo(size / 2 + size / 4, size / 2 - size / 4);
        ctx.lineTo(size / 2, size / 2);
        ctx.stroke();
    }

    drawSphere() {
        const size = this.currentSize;
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size / 2);
        gradient.addColorStop(0, this.color);
        gradient.addColorStop(1, this.color + '00');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
        ctx.fill();

        // Outer ring
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
        ctx.stroke();
    }

    drawPyramid() {
        const size = this.currentSize;
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.moveTo(0, -size / 2);
        ctx.lineTo(-size / 2, size / 2);
        ctx.lineTo(size / 2, size / 2);
        ctx.closePath();
        ctx.stroke();

        // 3D lines
        ctx.beginPath();
        ctx.moveTo(0, -size / 2);
        ctx.lineTo(0, 0);
        ctx.stroke();
    }

    drawHexagon() {
        const size = this.currentSize;
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;

        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i;
            const x = Math.cos(angle) * size / 2;
            const y = Math.sin(angle) * size / 2;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();
    }

    drawPetal() {
        const size = this.currentSize;
        ctx.fillStyle = this.color;

        ctx.beginPath();
        ctx.ellipse(0, 0, size / 3, size / 2, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.globalAlpha = this.opacity * 0.5;
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 1;
        ctx.stroke();
    }

    drawLeaf() {
        const size = this.currentSize;
        ctx.fillStyle = this.color;

        ctx.beginPath();
        ctx.moveTo(0, -size / 2);
        ctx.quadraticCurveTo(size / 2, 0, 0, size / 2);
        ctx.quadraticCurveTo(-size / 2, 0, 0, -size / 2);
        ctx.fill();

        // Vein
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, -size / 2);
        ctx.lineTo(0, size / 2);
        ctx.stroke();
    }

    drawSnowflake() {
        const size = this.currentSize;
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;

        for (let i = 0; i < 6; i++) {
            ctx.save();
            ctx.rotate((Math.PI / 3) * i);

            // Main line
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(0, -size / 2);
            ctx.stroke();

            // Branches
            ctx.beginPath();
            ctx.moveTo(0, -size / 4);
            ctx.lineTo(-size / 8, -size / 3);
            ctx.moveTo(0, -size / 4);
            ctx.lineTo(size / 8, -size / 3);
            ctx.stroke();

            ctx.restore();
        }
    }

    drawCrystal() {
        const size = this.currentSize;
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;

        // Diamond shape
        ctx.beginPath();
        ctx.moveTo(0, -size / 2);
        ctx.lineTo(size / 3, 0);
        ctx.lineTo(0, size / 2);
        ctx.lineTo(-size / 3, 0);
        ctx.closePath();
        ctx.stroke();

        // Inner lines
        ctx.beginPath();
        ctx.moveTo(0, -size / 2);
        ctx.lineTo(0, size / 2);
        ctx.moveTo(-size / 3, 0);
        ctx.lineTo(size / 3, 0);
        ctx.stroke();
    }
}

// ===================================
// ANIMATION FUNCTIONS
// ===================================

function initAnimations() {
    canvas = document.getElementById('bgCanvas');
    ctx = canvas.getContext('2d');

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    createParticles();
    animate();
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function createParticles() {
    particles = [];
    const config = SEASON_CONFIGS[currentSeason];
    for (let i = 0; i < config.particleCount; i++) {
        particles.push(new Particle());
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });

    animationFrame = requestAnimationFrame(animate);
}

function updateAnimationTheme(theme) {
    currentTheme = theme;
    particles.forEach(particle => {
        particle.color = particle.getRandomColor();
    });
}

function updateAnimationSeason(season) {
    currentSeason = season;
    createParticles();
}

// ===================================
// EXPOSE FUNCTIONS
// ===================================

window.initAnimations = initAnimations;
window.updateAnimationTheme = updateAnimationTheme;
window.updateAnimationSeason = updateAnimationSeason;

/**
 * 符文之地 - 粒子系统
 */

class Particle {
    constructor(x, y, options = {}) {
        this.x = x;
        this.y = y;
        this.vx = options.vx || (Math.random() - 0.5) * 2;
        this.vy = options.vy || (Math.random() - 0.5) * 2;
        this.life = options.life || 1;
        this.maxLife = this.life;
        this.size = options.size || 3;
        this.color = options.color || '#ffffff';
        this.gravity = options.gravity || 0;
        this.friction = options.friction || 0.98;
    }
    
    update(dt) {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += this.gravity;
        this.vx *= this.friction;
        this.vy *= this.friction;
        this.life -= dt;
    }
    
    draw(ctx) {
        const alpha = Math.max(0, this.life / this.maxLife);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * alpha, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}

class ParticleSystem {
    constructor(ctx) {
        this.ctx = ctx;
        this.particles = [];
    }
    
    emit(x, y, count = 10, options = {}) {
        for (let i = 0; i < count; i++) {
            this.particles.push(new Particle(x, y, {
                ...options,
                vx: (Math.random() - 0.5) * (options.speed || 3),
                vy: (Math.random() - 0.5) * (options.speed || 3)
            }));
        }
    }
    
    update(dt) {
        this.particles = this.particles.filter(p => {
            p.update(dt);
            return p.life > 0;
        });
    }
    
    draw() {
        this.particles.forEach(p => p.draw(this.ctx));
    }
    
    emitHit(x, y) {
        this.emit(x, y, 8, { color: '#ff4444', size: 4, life: 0.3 });
    }
    
    emitLevelUp(x, y) {
        this.emit(x, y, 20, { color: '#ffd700', size: 5, life: 0.8 });
    }
    
    emitItem(x, y) {
        this.emit(x, y, 12, { color: '#00ff00', size: 3, life: 0.5 });
    }
}

export { Particle, ParticleSystem };

/**
 * 符文之地 - 高级粒子系统
 */

class Particle {
    constructor(options = {}) {
        this.x = options.x || 0;
        this.y = options.y || 0;
        this.vx = options.vx || 0;
        this.vy = options.vy || 0;
        this.ax = options.ax || 0;
        this.ay = options.ay || 0;
        this.size = options.size || 5;
        this.sizeEnd = options.sizeEnd || 0;
        this.color = options.color || '#ffffff';
        this.colorEnd = options.colorEnd || this.color;
        this.alpha = options.alpha || 1;
        this.alphaEnd = options.alphaEnd || 0;
        this.life = options.life || 1;
        this.maxLife = this.life;
        this.rotation = options.rotation || 0;
        this.rotationSpeed = options.rotationSpeed || 0;
        this.shape = options.shape || 'circle'; // circle, square, star, line
        this.gravity = options.gravity || 0;
        this.friction = options.friction || 0.98;
        this.shrink = options.shrink !== undefined ? options.shrink : true;
        this.trail = options.trail || false;
        this.trailLength = options.trailLength || 5;
        this.trailPositions = [];
        this.blendMode = options.blendMode || 'source-over';
    }
    
    update(dt) {
        this.life -= dt;
        
        if (this.life <= 0) return false;
        
        // 速度
        this.vx += this.ax;
        this.vy += this.ay;
        this.vy += this.gravity;
        
        // 摩擦力
        this.vx *= this.friction;
        this.vy *= this.friction;
        
        // 位置
        this.x += this.vx;
        this.y += this.vy;
        
        // 旋转
        this.rotation += this.rotationSpeed;
        
        // Trail
        if (this.trail) {
            this.trailPositions.unshift({ x: this.x, y: this.y });
            if (this.trailPositions.length > this.trailLength) {
                this.trailPositions.pop();
            }
        }
        
        return true;
    }
    
    getProgress() {
        return 1 - (this.life / this.maxLife);
    }
    
    getCurrentSize() {
        if (!this.shrink) return this.size;
        return this.size - (this.size - this.sizeEnd) * this.getProgress();
    }
    
    getCurrentColor() {
        return this.color; // 简化版，实际应该做颜色插值
    }
    
    getCurrentAlpha() {
        return this.alpha - (this.alpha - this.alphaEnd) * this.getProgress();
    }
    
    draw(ctx) {
        const alpha = this.getCurrentAlpha();
        if (alpha <= 0) return;
        
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        
        // Trail
        if (this.trail && this.trailPositions.length > 1) {
            ctx.beginPath();
            ctx.moveTo(0, 0);
            for (const pos of this.trailPositions) {
                ctx.lineTo(pos.x - this.x, pos.y - this.y);
            }
            ctx.strokeStyle = this.getCurrentColor();
            ctx.lineWidth = this.getCurrentSize();
            ctx.stroke();
        }
        
        // Shape
        ctx.fillStyle = this.getCurrentColor();
        
        switch (this.shape) {
            case 'circle':
                ctx.beginPath();
                ctx.arc(0, 0, this.getCurrentSize(), 0, Math.PI * 2);
                ctx.fill();
                break;
                
            case 'square':
                const s = this.getCurrentSize();
                ctx.fillRect(-s / 2, -s / 2, s, s);
                break;
                
            case 'star':
                this.drawStar(ctx, 0, 0, 5, this.getCurrentSize(), this.getCurrentSize() / 2);
                break;
                
            case 'line':
                ctx.strokeStyle = this.getCurrentColor();
                ctx.lineWidth = this.getCurrentSize();
                ctx.beginPath();
                ctx.moveTo(-this.getCurrentSize(), 0);
                ctx.lineTo(this.getCurrentSize(), 0);
                ctx.stroke();
                break;
                
            case 'spark':
                ctx.strokeStyle = this.getCurrentColor();
                ctx.lineWidth = this.getCurrentSize() * 0.5;
                ctx.beginPath();
                ctx.moveTo(0, -this.getCurrentSize());
                ctx.lineTo(0, this.getCurrentSize());
                ctx.moveTo(-this.getCurrentSize(), 0);
                ctx.lineTo(this.getCurrentSize(), 0);
                ctx.stroke();
                break;
        }
        
        ctx.restore();
    }
    
    drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius) {
        let rot = Math.PI / 2 * 3;
        let x = cx;
        let y = cy;
        const step = Math.PI / spikes;
        
        ctx.beginPath();
        ctx.moveTo(cx, cy - outerRadius);
        
        for (let i = 0; i < spikes; i++) {
            x = cx + Math.cos(rot) * outerRadius;
            y = cy + Math.sin(rot) * outerRadius;
            ctx.lineTo(x, y);
            rot += step;
            
            x = cx + Math.cos(rot) * innerRadius;
            y = cy + Math.sin(rot) * innerRadius;
            ctx.lineTo(x, y);
            rot += step;
        }
        
        ctx.lineTo(cx, cy - outerRadius);
        ctx.closePath();
        ctx.fill();
    }
}

class ParticleEmitter {
    constructor(options = {}) {
        this.x = options.x || 0;
        this.y = options.y || 0;
        this.rate = options.rate || 10; // 每秒粒子数
        this.rateVariation = options.rateVariation || 0;
        this.burstCount = options.burstCount || 0;
        this.isActive = options.isActive !== undefined ? options.isActive : true;
        this.duration = options.duration || -1; // -1 表示永久
        this.elapsed = 0;
        this.particleTemplate = options.particleTemplate || {};
        this.angle = options.angle || 0;
        this.angleSpread = options.angleSpread || Math.PI * 2;
        this.speed = options.speed || 5;
        this.speedVariation = options.speedVariation || 0;
        this.size = options.size || 5;
        this.sizeVariation = options.sizeVariation || 0;
        this.life = options.life || 1;
        this.lifeVariation = options.lifeVariation || 0;
        this.color = options.color || '#ffffff';
        this.colors = options.colors || null;
        this.emissionAccumulator = 0;
    }
    
    update(dt) {
        if (!this.isActive) return;
        
        this.elapsed += dt;
        if (this.duration > 0 && this.elapsed >= this.duration) {
            this.isActive = false;
            return;
        }
        
        // 持续发射
        if (this.rate > 0) {
            const actualRate = this.rate + (Math.random() - 0.5) * 2 * this.rateVariation;
            this.emissionAccumulator += actualRate * dt;
            
            while (this.emissionAccumulator >= 1) {
                this.emit();
                this.emissionAccumulator -= 1;
            }
        }
        
        // Burst
        if (this.burstCount > 0) {
            for (let i = 0; i < this.burstCount; i++) {
                this.emit();
            }
            this.burstCount = 0;
        }
    }
    
    emit() {
        const particle = new Particle({
            ...this.particleTemplate,
            x: this.x,
            y: this.y,
            size: this.size + (Math.random() - 0.5) * 2 * this.sizeVariation,
            life: this.life + (Math.random() - 0.5) * 2 * this.lifeVariation,
            color: this.colors ? this.colors[Math.floor(Math.random() * this.colors.length)] : this.color
        });
        
        // 方向
        const angle = this.angle + (Math.random() - 0.5) * this.angleSpread;
        const speed = this.speed + (Math.random() - 0.5) * 2 * this.speedVariation;
        particle.vx = Math.cos(angle) * speed;
        particle.vy = Math.sin(angle) * speed;
        
        return particle;
    }
    
    burst() {
        this.burstCount += 10;
    }
}

class AdvancedParticleSystem {
    constructor() {
        this.particles = [];
        this.emitters = [];
        this.maxParticles = 1000;
    }
    
    addParticle(particle) {
        if (this.particles.length < this.maxParticles) {
            this.particles.push(particle);
        }
    }
    
    addEmitter(emitter) {
        this.emitters.push(emitter);
        return emitter;
    }
    
    removeEmitter(emitter) {
        const index = this.emitters.indexOf(emitter);
        if (index >= 0) {
            this.emitters.splice(index, 1);
        }
    }
    
    update(dt) {
        // 更新发射器
        for (const emitter of this.emitters) {
            emitter.update(dt);
            
            if (emitter.isActive) {
                while (emitter.emissionAccumulator >= 1) {
                    this.addParticle(emitter.emit());
                    emitter.emissionAccumulator -= 1;
                }
            }
        }
        
        // 更新粒子
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const alive = this.particles[i].update(dt);
            if (!alive) {
                this.particles.splice(i, 1);
            }
        }
    }
    
    draw(ctx) {
        for (const particle of this.particles) {
            particle.draw(ctx);
        }
    }
    
    clear() {
        this.particles = [];
    }
    
    // 预设效果
    fire(x, y) {
        const emitter = new ParticleEmitter({
            x, y,
            rate: 20,
            angle: -Math.PI / 2,
            angleSpread: Math.PI / 4,
            speed: 3,
            speedVariation: 2,
            size: 8,
            sizeVariation: 4,
            life: 0.8,
            lifeVariation: 0.3,
            colors: ['#ff4400', '#ff6600', '#ff8800', '#ffaa00'],
            gravity: 0.1
        });
        
        this.addEmitter(emitter);
        return emitter;
    }
    
    sparkles(x, y, count = 10) {
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 1 + Math.random() * 3;
            
            this.addParticle(new Particle({
                x, y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: 3 + Math.random() * 3,
                life: 0.5 + Math.random() * 0.5,
                colors: ['#ffd700', '#ffffff', '#ffff00'],
                gravity: 0,
                friction: 0.95
            }));
        }
    }
    
    smoke(x, y) {
        const emitter = new ParticleEmitter({
            x, y,
            rate: 5,
            angle: -Math.PI / 2,
            angleSpread: Math.PI / 8,
            speed: 1,
            speedVariation: 0.5,
            size: 15,
            sizeVariation: 5,
            sizeEnd: 30,
            life: 2,
            lifeVariation: 0.5,
            colors: ['#444444', '#666666', '#888888', '#aaaaaa'],
            gravity: -0.05,
            friction: 0.99,
            alphaEnd: 0
        });
        
        this.addEmitter(emitter);
        return emitter;
    }
}

export { Particle, ParticleEmitter, AdvancedParticleSystem };

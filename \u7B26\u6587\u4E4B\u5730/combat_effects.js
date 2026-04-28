/**
 * 符文之地 - 战斗特效系统
 * 粒子效果 + 动画 + 屏幕震动
 */

class CombatEffects {
    constructor(ctx) {
        this.ctx = ctx;
        this.effects = [];
        this.screenShake = { x: 0, y: 0, intensity: 0, duration: 0 };
        this.flash = { color: null, alpha: 0, duration: 0 };
        this.damageNumbers = [];
        this.projectiles = [];
    }
    
    // 伤害数字
    showDamage(x, y, damage, type = 'physical', isCrit = false) {
        const colors = {
            physical: '#ff4444',
            fire: '#ff4400',
            ice: '#00ffff',
            lightning: '#ffff00',
            holy: '#ffd700',
            void: '#8800ff',
            poison: '#00ff00',
            heal: '#44ff44'
        };
        
        const color = colors[type] || colors.physical;
        const text = isCrit ? `${damage}!` : `${damage}`;
        
        this.damageNumbers.push({
            x: x + (Math.random() - 0.5) * 20,
            y,
            text,
            color,
            isCrit,
            life: 1.0,
            vy: -2,
            scale: isCrit ? 1.5 : 1.0
        });
    }
    
    // 粒子爆发
    burst(x, y, color, count = 10, options = {}) {
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
            const speed = options.speed || (2 + Math.random() * 3);
            this.effects.push({
                type: 'particle',
                x, y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                color,
                size: options.size || (2 + Math.random() * 3),
                life: options.life || 0.5,
                maxLife: options.life || 0.5,
                gravity: options.gravity || 0.1,
                decay: options.decay || 0.95
            });
        }
    }
    
    // 屏幕震动
    shake(intensity = 5, duration = 0.3) {
        this.screenShake.intensity = intensity;
        this.screenShake.duration = duration;
    }
    
    // 屏幕闪白
    flashScreen(color = '#ffffff', duration = 0.1) {
        this.flash.color = color;
        this.flash.alpha = 0.5;
        this.flash.duration = duration;
    }
    
    // 投射物
    addProjectile(fromX, fromY, toX, toY, color, options = {}) {
        this.projectiles.push({
            x: fromX,
            y: fromY,
            targetX: toX,
            targetY: toY,
            color,
            size: options.size || 5,
            speed: options.speed || 10,
            trail: options.trail || false,
            trailColor: options.trailColor || color,
            life: 1.0
        });
    }
    
    // 环形冲击波
    ring(x, y, color, maxRadius = 50) {
        this.effects.push({
            type: 'ring',
            x, y, color,
            radius: 0,
            maxRadius,
            life: 0.3,
            maxLife: 0.3
        });
    }
    
    // 地面裂纹
    cracks(x, y, color) {
        this.effects.push({
            type: 'cracks',
            x, y, color,
            segments: 5 + Math.floor(Math.random() * 5),
            life: 2.0,
            maxLife: 2.0
        });
    }
    
    // 更新
    update(dt) {
        // 更新伤害数字
        this.damageNumbers = this.damageNumbers.filter(d => {
            d.y += d.vy;
            d.life -= dt;
            d.vy *= 0.95;
            return d.life > 0;
        });
        
        // 更新投射物
        this.projectiles = this.projectiles.filter(p => {
            const dx = p.targetX - p.x;
            const dy = p.targetY - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < p.speed) {
                return false;
            }
            
            p.x += (dx / dist) * p.speed;
            p.y += (dy / dist) * p.speed;
            p.life -= dt;
            
            return p.life > 0;
        });
        
        // 更新粒子
        this.effects = this.effects.filter(e => {
            if (e.type === 'particle') {
                e.x += e.vx;
                e.y += e.vy;
                e.vy += e.gravity;
                e.vx *= e.decay;
                e.vy *= e.decay;
                e.life -= dt;
                return e.life > 0;
            } else if (e.type === 'ring') {
                const progress = 1 - (e.life / e.maxLife);
                e.radius = e.maxRadius * progress;
                e.life -= dt;
                return e.life > 0;
            } else if (e.type === 'cracks') {
                e.life -= dt;
                return e.life > 0;
            }
            return false;
        });
        
        // 更新屏幕震动
        if (this.screenShake.duration > 0) {
            this.screenShake.duration -= dt;
            this.screenShake.x = (Math.random() - 0.5) * this.screenShake.intensity * 2;
            this.screenShake.y = (Math.random() - 0.5) * this.screenShake.intensity * 2;
        } else {
            this.screenShake.x = 0;
            this.screenShake.y = 0;
        }
        
        // 更新屏幕闪白
        if (this.flash.alpha > 0) {
            this.flash.alpha -= dt * 5;
        }
    }
    
    // 渲染
    render() {
        const ctx = this.ctx;
        
        ctx.save();
        ctx.translate(this.screenShake.x, this.screenShake.y);
        
        // 渲染粒子
        for (const e of this.effects) {
            if (e.type === 'particle') {
                const alpha = e.life / e.maxLife;
                ctx.globalAlpha = alpha;
                ctx.fillStyle = e.color;
                ctx.beginPath();
                ctx.arc(e.x, e.y, e.size * alpha, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalAlpha = 1;
            } else if (e.type === 'ring') {
                const alpha = e.life / e.maxLife;
                ctx.globalAlpha = alpha;
                ctx.strokeStyle = e.color;
                ctx.lineWidth = 3 * alpha;
                ctx.beginPath();
                ctx.arc(e.x, e.y, e.radius, 0, Math.PI * 2);
                ctx.stroke();
                ctx.globalAlpha = 1;
            }
        }
        
        // 渲染投射物
        for (const p of this.projectiles) {
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // 渲染伤害数字
        ctx.textAlign = 'center';
        for (const d of this.damageNumbers) {
            const alpha = d.life;
            ctx.globalAlpha = alpha;
            ctx.fillStyle = d.color;
            ctx.font = `bold ${16 * d.scale}px sans-serif`;
            ctx.fillText(d.text, d.x, d.y);
            ctx.globalAlpha = 1;
        }
        
        ctx.restore();
        
        // 渲染屏幕闪白
        if (this.flash.alpha > 0) {
            ctx.globalAlpha = this.flash.alpha;
            ctx.fillStyle = this.flash.color;
            ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            ctx.globalAlpha = 1;
        }
    }
    
    // 特效预设
    hitEffect(x, y) {
        this.burst(x, y, '#ff4444', 8, { speed: 3, life: 0.3 });
        this.shake(3, 0.1);
    }
    
    critEffect(x, y) {
        this.burst(x, y, '#ffd700', 15, { speed: 5, life: 0.5 });
        this.burst(x, y, '#ffffff', 10, { speed: 4, life: 0.4 });
        this.shake(6, 0.2);
        this.flashScreen('#ffffff', 0.1);
    }
    
    deathEffect(x, y, color = '#880000') {
        this.burst(x, y, color, 20, { speed: 4, life: 0.6 });
        this.burst(x, y, '#000000', 10, { speed: 3, life: 0.8 });
    }
    
    healEffect(x, y) {
        this.burst(x, y, '#44ff44', 12, { speed: 2, life: 0.5, gravity: -0.2 });
    }
    
    levelUpEffect(x, y) {
        this.burst(x, y, '#ffd700', 25, { speed: 6, life: 0.8 });
        this.ring(x, y, '#ffd700', 100);
        this.flashScreen('#ffd700', 0.2);
    }
    
    skillEffect(x, y, element) {
        const colors = {
            fire: '#ff4400',
            ice: '#00ffff',
            lightning: '#ffff00',
            holy: '#ffd700',
            void: '#8800ff'
        };
        const color = colors[element] || '#ffffff';
        this.burst(x, y, color, 15, { speed: 4, life: 0.4 });
        this.ring(x, y, color, 60);
    }
}

export { CombatEffects };

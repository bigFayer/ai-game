/**
 * 符文之地 - 动画系统
 */

class Animation {
    constructor(target, options = {}) {
        this.target = target;
        this.property = options.property || 'x';
        this.from = options.from !== undefined ? options.from : target[options.property];
        this.to = options.to;
        this.duration = options.duration || 1;
        this.elapsed = 0;
        this.easing = options.easing || Easing.linear;
        this.loop = options.loop || false;
        this.reverse = options.reverse || false;
        this.onUpdate = options.onUpdate || null;
        this.onComplete = options.onComplete || null;
        this.isRunning = true;
        this.isPaused = false;
    }
    
    update(dt) {
        if (!this.isRunning || this.isPaused) return;
        
        this.elapsed += dt;
        const t = Math.min(this.elapsed / this.duration, 1);
        const eased = this.easing(t);
        
        const current = this.from + (this.to - this.from) * eased;
        
        if (this.target) {
            this.target[this.property] = current;
        }
        
        if (this.onUpdate) {
            this.onUpdate(current, t);
        }
        
        if (t >= 1) {
            if (this.loop) {
                this.elapsed = 0;
                if (this.reverse) {
                    [this.from, this.to] = [this.to, this.from];
                }
            } else {
                this.isRunning = false;
                if (this.onComplete) {
                    this.onComplete();
                }
            }
        }
    }
    
    pause() {
        this.isPaused = true;
    }
    
    resume() {
        this.isPaused = false;
    }
    
    stop() {
        this.isRunning = false;
    }
    
    reset() {
        this.elapsed = 0;
        this.isRunning = true;
        if (this.target && this.property) {
            this.target[this.property] = this.from;
        }
    }
}

class Easing {
    static linear(t) { return t; }
    static easeInQuad(t) { return t * t; }
    static easeOutQuad(t) { return t * (2 - t); }
    static easeInOutQuad(t) { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; }
    static easeInCubic(t) { return t * t * t; }
    static easeOutCubic(t) { return (--t) * t * t + 1; }
    static easeInOutCubic(t) { return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1; }
    static easeInQuart(t) { return t * t * t * t; }
    static easeOutQuart(t) { return 1 - (--t) * t * t * t; }
    static easeInOutQuart(t) { return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t; }
    static easeInQuint(t) { return t * t * t * t * t; }
    static easeOutQuint(t) { return 1 + (--t) * t * t * t * t; }
    static easeInOutQuint(t) { return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t; }
    static easeInSine(t) { return 1 - Math.cos(t * Math.PI / 2); }
    static easeOutSine(t) { return Math.sin(t * Math.PI / 2); }
    static easeInOutSine(t) { return -(Math.cos(Math.PI * t) - 1) / 2; }
    static easeInExpo(t) { return t === 0 ? 0 : Math.pow(2, 10 * t - 10); }
    static easeOutExpo(t) { return t === 1 ? 1 : 1 - Math.pow(2, -10 * t); }
    static easeInOutExpo(t) {
        return t === 0 ? 0 : t === 1 ? 1 :
            t < 0.5 ? Math.pow(2, 20 * t - 10) / 2 :
            (2 - Math.pow(2, -20 * t + 10)) / 2;
    }
    static easeInCirc(t) { return 1 - Math.sqrt(1 - Math.pow(t, 2)); }
    static easeOutCirc(t) { return Math.sqrt(1 - Math.pow(t - 1, 2)); }
    static easeInOutCirc(t) {
        return t < 0.5 ?
            (1 - Math.sqrt(1 - Math.pow(2 * t, 2))) / 2 :
            (Math.sqrt(1 - Math.pow(-2 * t + 2, 2)) + 1) / 2;
    }
    static easeInBack(t) {
        const c1 = 1.70158;
        const c3 = c1 + 1;
        return c3 * t * t * t - c1 * t * t;
    }
    static easeOutBack(t) {
        const c1 = 1.70158;
        const c3 = c1 + 1;
        return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
    }
    static easeInOutBack(t) {
        const c1 = 1.70158;
        const c2 = c1 * 1.525;
        return t < 0.5
            ? (Math.pow(2 * t, 2) * ((c2 + 1) * 2 * t - c2)) / 2
            : (Math.pow(2 * t - 2, 2) * ((c2 + 1) * (t * 2 - 2) + c2) + 2) / 2;
    }
    static bounce(t) {
        const n1 = 7.5625;
        const d1 = 2.75;
        if (t < 1 / d1) return n1 * t * t;
        else if (t < 2 / d1) return n1 * (t -= 1.5 / d1) * t + 0.75;
        else if (t < 2.5 / d1) return n1 * (t -= 2.25 / d1) * t + 0.9375;
        else return n1 * (t -= 2.625 / d1) * t + 0.984375;
    }
    static elastic(t) {
        if (t === 0 || t === 1) return t;
        return Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * (2 * Math.PI) / 3) + 1;
    }
}

class AnimationManager {
    constructor() {
        this.animations = [];
        this.tweens = [];
    }
    
    add(animation) {
        this.animations.push(animation);
        return animation;
    }
    
    remove(animation) {
        const index = this.animations.indexOf(animation);
        if (index >= 0) {
            this.animations.splice(index, 1);
        }
    }
    
    update(dt) {
        for (let i = this.animations.length - 1; i >= 0; i--) {
            const anim = this.animations[i];
            anim.update(dt);
            
            if (!anim.isRunning) {
                this.animations.splice(i, 1);
            }
        }
    }
    
    clear() {
        this.animations = [];
    }
    
    // 预设动画
    fadeIn(target, duration = 0.5) {
        target.alpha = 0;
        return this.add(new Animation(target, {
            property: 'alpha',
            from: 0,
            to: 1,
            duration,
            easing: Easing.easeOutQuad
        }));
    }
    
    fadeOut(target, duration = 0.5) {
        return this.add(new Animation(target, {
            property: 'alpha',
            from: target.alpha || 1,
            to: 0,
            duration,
            easing: Easing.easeOutQuad
        }));
    }
    
    moveTo(target, property, to, duration = 1, easing = Easing.easeInOutQuad) {
        return this.add(new Animation(target, {
            property,
            from: target[property],
            to,
            duration,
            easing
        }));
    }
    
    scaleTo(target, to, duration = 0.5) {
        return this.add(new Animation(target, {
            property: 'scale',
            from: target.scale || 1,
            to,
            duration,
            easing: Easing.easeOutBack
        }));
    }
    
    shake(target, intensity = 5, duration = 0.3) {
        const originalX = target.x;
        const originalY = target.y;
        let elapsed = 0;
        
        return this.add({
            target,
            duration,
            elapsed: 0,
            isRunning: true,
            isPaused: false,
            update(dt) {
                this.elapsed += dt;
                if (this.elapsed >= this.duration) {
                    target.x = originalX;
                    target.y = originalY;
                    this.isRunning = false;
                    return;
                }
                
                target.x = originalX + (Math.random() - 0.5) * intensity * 2;
                target.y = originalY + (Math.random() - 0.5) * intensity * 2;
            }
        });
    }
    
    pulse(target, scale = 1.2, duration = 0.3) {
        const originalScale = target.scale || 1;
        return this.add(new Animation(target, {
            property: 'scale',
            from: originalScale,
            to: scale,
            duration: duration / 2,
            easing: Easing.easeOutQuad,
            loop: true,
            reverse: true
        }));
    }
    
    rotate(target, to, duration = 1) {
        return this.add(new Animation(target, {
            property: 'rotation',
            from: target.rotation || 0,
            to,
            duration,
            easing: Easing.linear
        }));
    }
}

export { Animation, AnimationManager, Easing };

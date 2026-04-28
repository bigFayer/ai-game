/**
 * 符文之地 - 摄像机系统
 */

class Camera {
    constructor(options = {}) {
        this.x = options.x || 0;
        this.y = options.y || 0;
        this.width = options.width || 800;
        this.height = options.height || 600;
        this.zoom = options.zoom || 1;
        this.rotation = options.rotation || 0;
        this.target = options.target || null;
        this.smoothing = options.smoothing || 0.1;
        this.bounds = options.bounds || null;
        this.shake = { x: 0, y: 0, intensity: 0, duration: 0 };
    }
    
    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }
    
    setTarget(target) {
        this.target = target;
    }
    
    follow(target, offsetX = 0, offsetY = 0) {
        if (!target) return;
        
        let targetX = target.x * this.zoom + offsetX;
        let targetY = target.y * this.zoom + offsetY;
        
        if (this.smoothing > 0) {
            this.x += (targetX - this.x) * this.smoothing;
            this.y += (targetY - this.y) * this.smoothing;
        } else {
            this.x = targetX;
            this.y = targetY;
        }
        
        // 应用边界
        if (this.bounds) {
            this.x = Math.max(this.bounds.minX, Math.min(this.bounds.maxX - this.width, this.x));
            this.y = Math.max(this.bounds.minY, Math.min(this.bounds.maxY - this.height, this.y));
        }
        
        // 应用震动
        if (this.shake.duration > 0) {
            this.shake.x = (Math.random() - 0.5) * this.shake.intensity * 2;
            this.shake.y = (Math.random() - 0.5) * this.shake.intensity * 2;
        } else {
            this.shake.x = 0;
            this.shake.y = 0;
        }
    }
    
    shakeScreen(intensity = 5, duration = 0.3) {
        this.shake.intensity = intensity;
        this.shake.duration = duration;
    }
    
    setBounds(minX, minY, maxX, maxY) {
        this.bounds = { minX, minY, maxX, maxY };
    }
    
    clearBounds() {
        this.bounds = null;
    }
    
    worldToScreen(worldX, worldY) {
        const screenX = (worldX - this.x + this.shake.x);
        const screenY = (worldY - this.y + this.shake.y);
        return { x: screenX, y: screenY };
    }
    
    screenToWorld(screenX, screenY) {
        const worldX = screenX + this.x - this.shake.x;
        const worldY = screenY + this.y - this.shake.y;
        return { x: worldX, y: worldY };
    }
    
    isInView(x, y, width = 0, height = 0) {
        return x + width > this.x &&
               x < this.x + this.width &&
               y + height > this.y &&
               y < this.y + this.height;
    }
    
    update(dt) {
        // 更新震动
        if (this.shake.duration > 0) {
            this.shake.duration -= dt;
            if (this.shake.duration <= 0) {
                this.shake.intensity = 0;
                this.shake.x = 0;
                this.shake.y = 0;
            }
        }
    }
    
    resize(width, height) {
        this.width = width;
        this.height = height;
    }
    
    setZoom(zoom) {
        this.zoom = Math.max(0.1, Math.min(zoom, 3));
    }
    
    zoomIn(amount = 0.1) {
        this.setZoom(this.zoom + amount);
    }
    
    zoomOut(amount = 0.1) {
        this.setZoom(this.zoom - amount);
    }
}

class CameraManager {
    constructor() {
        this.camera = new Camera();
        this.canvasWidth = 800;
        this.canvasHeight = 600;
    }
    
    init(canvasWidth, canvasHeight) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.camera.resize(canvasWidth, canvasHeight);
    }
    
    follow(entity) {
        if (entity) {
            const halfWidth = this.canvasWidth / 2;
            const halfHeight = this.canvasHeight / 2;
            this.camera.follow(entity, halfWidth, halfHeight);
        }
    }
    
    worldToScreen(x, y) {
        return this.camera.worldToScreen(x, y);
    }
    
    applyTransform(ctx) {
        ctx.save();
        ctx.translate(this.camera.x + this.camera.shake.x, this.camera.y + this.camera.shake.y);
        ctx.scale(this.camera.zoom, this.camera.zoom);
        ctx.rotate(this.camera.rotation);
    }
    
    restoreTransform(ctx) {
        ctx.restore();
    }
}

export { Camera, CameraManager };

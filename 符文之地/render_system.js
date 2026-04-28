/**
 * 符文之地 - 渲染系统
 */

class RenderLayer {
    constructor(name, zIndex) {
        this.name = name;
        this.zIndex = zIndex;
        this.objects = [];
    }
    
    add(obj) {
        this.objects.push(obj);
        this.objects.sort((a, b) => (a.z || 0) - (b.z || 0));
    }
    
    remove(obj) {
        const index = this.objects.indexOf(obj);
        if (index >= 0) {
            this.objects.splice(index, 1);
        }
    }
    
    clear() {
        this.objects = [];
    }
}

class RenderManager {
    constructor(ctx, width, height) {
        this.ctx = ctx;
        this.width = width;
        this.height = height;
        
        this.layers = new Map();
        this.setupLayers();
        
        this.camera = { x: 0, y: 0, zoom: 1 };
        this.viewport = { x: 0, y: 0, width, height };
        this.useCamera = true;
        
        this.effects = [];
        this.usePostProcessing = false;
    }
    
    setupLayers() {
        const layerOrder = [
            'background', 'floor', 'items', 'enemies', 'player',
            'projectiles', 'effects', 'ui', 'overlay'
        ];
        
        layerOrder.forEach((name, index) => {
            this.layers.set(name, new RenderLayer(name, index));
        });
    }
    
    addToLayer(layerName, obj) {
        const layer = this.layers.get(layerName);
        if (layer) {
            layer.add(obj);
        }
    }
    
    removeFromLayer(layerName, obj) {
        const layer = this.layers.get(layerName);
        if (layer) {
            layer.remove(obj);
        }
    }
    
    setCamera(x, y, zoom = 1) {
        this.camera.x = x;
        this.camera.y = y;
        this.camera.zoom = zoom;
    }
    
    worldToScreen(x, y) {
        if (!this.useCamera) return { x, y };
        
        return {
            x: (x - this.camera.x) * this.camera.zoom,
            y: (y - this.camera.y) * this.camera.zoom
        };
    }
    
    screenToWorld(x, y) {
        if (!this.useCamera) return { x, y };
        
        return {
            x: x / this.camera.zoom + this.camera.x,
            y: y / this.camera.zoom + this.camera.y
        };
    }
    
    isInViewport(x, y, margin = 100) {
        const screen = this.worldToScreen(x, y);
        return screen.x >= -margin &&
               screen.x <= this.width + margin &&
               screen.y >= -margin &&
               screen.y <= this.height + margin;
    }
    
    render() {
        const ctx = this.ctx;
        
        // 清屏
        ctx.fillStyle = '#0a0a15';
        ctx.fillRect(0, 0, this.width, this.height);
        
        // 应用相机变换
        ctx.save();
        
        if (this.useCamera) {
            ctx.translate(this.width / 2, this.height / 2);
            ctx.scale(this.camera.zoom, this.camera.zoom);
            ctx.translate(-this.camera.x, -this.camera.y);
        }
        
        // 渲染各层
        for (const layer of this.layers.values()) {
            for (const obj of layer.objects) {
                if (obj.visible !== false && this.shouldRender(obj)) {
                    this.renderObject(obj);
                }
            }
        }
        
        ctx.restore();
        
        // 后处理效果
        if (this.usePostProcessing) {
            this.applyPostProcessing();
        }
        
        // 特效
        this.renderEffects();
    }
    
    shouldRender(obj) {
        if (obj.x === undefined || obj.y === undefined) return true;
        
        const margin = obj.width || 50;
        return this.isInViewport(obj.x, obj.y, margin);
    }
    
    renderObject(obj) {
        const ctx = this.ctx;
        
        if (obj.render) {
            obj.render(ctx);
        } else if (obj.sprite) {
            ctx.drawImage(obj.sprite, obj.x, obj.y);
        } else if (obj.color) {
            ctx.fillStyle = obj.color;
            ctx.fillRect(obj.x, obj.y, obj.width || 32, obj.height || 32);
        }
    }
    
    applyPostProcessing() {
        // 模糊、色彩校正等
    }
    
    renderEffects() {
        // 屏幕特效
    }
    
    addEffect(effect) {
        this.effects.push(effect);
    }
    
    clearEffects() {
        this.effects = [];
    }
}

// Tile渲染器
class TileRenderer {
    constructor(ctx, tileSize = 40) {
        this.ctx = ctx;
        this.tileSize = tileSize;
        this.cache = new Map();
        this.useCache = true;
    }
    
    renderTile(tile, x, y, variant = 0) {
        const key = `${tile}_${variant}`;
        
        if (this.useCache && this.cache.has(key)) {
            this.ctx.drawImage(this.cache.get(key), x * this.tileSize, y * this.tileSize);
            return;
        }
        
        const canvas = document.createElement('canvas');
        canvas.width = this.tileSize;
        canvas.height = this.tileSize;
        const tileCtx = canvas.getContext('2d');
        
        this.drawTileContent(tileCtx, tile, variant);
        
        if (this.useCache) {
            this.cache.set(key, canvas);
        }
        
        this.ctx.drawImage(canvas, x * this.tileSize, y * this.tileSize);
    }
    
    drawTileContent(ctx, tile, variant) {
        switch (tile) {
            case 0: // 墙
                ctx.fillStyle = '#1a1a2a';
                ctx.fillRect(0, 0, 40, 40);
                ctx.fillStyle = '#2a2a3a';
                ctx.fillRect(2, 2, 36, 36);
                break;
            case 1: // 地板
                ctx.fillStyle = '#2a2a3a';
                ctx.fillRect(0, 0, 40, 40);
                // 随机纹理
                ctx.fillStyle = '#333344';
                if (variant % 2 === 0) {
                    ctx.fillRect(5, 5, 3, 3);
                }
                break;
            case 2: // 水
                ctx.fillStyle = '#0066aa';
                ctx.fillRect(0, 0, 40, 40);
                ctx.fillStyle = '#0088cc';
                ctx.fillRect(5, 10, 10, 5);
                break;
            case 3: // 岩浆
                ctx.fillStyle = '#aa4400';
                ctx.fillRect(0, 0, 40, 40);
                ctx.fillStyle = '#ff6600';
                ctx.fillRect(10, 10, 8, 8);
                break;
        }
    }
    
    clearCache() {
        this.cache.clear();
    }
}

// 文字渲染器
class TextRenderer {
    constructor(ctx) {
        this.ctx = ctx;
        this.defaultFont = '16px sans-serif';
        this.defaultColor = '#ffffff';
    }
    
    render(text, x, y, options = {}) {
        const ctx = this.ctx;
        
        ctx.save();
        
        // 字体
        const font = options.font || this.defaultFont;
        ctx.font = font;
        
        // 颜色
        const color = options.color || this.defaultColor;
        
        // 描边
        if (options.stroke) {
            ctx.strokeStyle = options.strokeColor || '#000000';
            ctx.lineWidth = options.strokeWidth || 3;
            ctx.textAlign = options.align || 'left';
            ctx.textBaseline = options.baseline || 'top';
            ctx.strokeText(text, x, y);
        }
        
        // 填充
        ctx.fillStyle = color;
        ctx.textAlign = options.align || 'left';
        ctx.textBaseline = options.baseline || 'top';
        ctx.globalAlpha = options.alpha || 1;
        
        // 旋转
        if (options.rotation) {
            ctx.translate(x, y);
            ctx.rotate(options.rotation);
            ctx.translate(-x, -y);
        }
        
        // 阴影
        if (options.shadow) {
            ctx.shadowColor = options.shadowColor || '#000000';
            ctx.shadowBlur = options.shadowBlur || 5;
            ctx.shadowOffsetX = options.shadowOffsetX || 2;
            ctx.shadowOffsetY = options.shadowOffsetY || 2;
        }
        
        ctx.fillText(text, x, y);
        
        ctx.restore();
    }
    
    renderWrap(text, x, y, maxWidth, lineHeight, options = {}) {
        const lines = this.wrapText(text, maxWidth);
        const startY = y;
        
        for (let i = 0; i < lines.length; i++) {
            this.render(lines[i], x, startY + i * lineHeight, options);
        }
    }
    
    wrapText(text, maxWidth) {
        const ctx = this.ctx;
        const words = text.split(' ');
        const lines = [];
        let currentLine = '';
        
        for (const word of words) {
            const testLine = currentLine + word + ' ';
            const metrics = ctx.measureText(testLine);
            
            if (metrics.width > maxWidth && currentLine !== '') {
                lines.push(currentLine.trim());
                currentLine = word + ' ';
            } else {
                currentLine = testLine;
            }
        }
        
        if (currentLine.trim()) {
            lines.push(currentLine.trim());
        }
        
        return lines;
    }
}

export { RenderManager, RenderLayer, TileRenderer, TextRenderer };

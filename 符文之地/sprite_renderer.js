/**
 * 符文之地 - 精灵渲染器
 */

class Sprite {
    constructor(image, options = {}) {
        this.image = image;
        this.x = options.x || 0;
        this.y = options.y || 0;
        this.width = options.width || image?.width || 32;
        this.height = options.height || image?.height || 32;
        this.scale = options.scale || 1;
        this.rotation = options.rotation || 0;
        this.alpha = options.alpha || 1;
        this.originX = options.originX || 0;
        this.originY = options.originY || 0;
        this.visible = options.visible !== undefined ? options.visible : true;
        this.animFrame = 0;
        this.animTimer = 0;
        this.animations = {};
        this.currentAnimation = null;
    }
    
    setAnimation(name, frames) {
        this.animations[name] = frames;
    }
    
    playAnimation(name, loop = true) {
        if (this.animations[name]) {
            this.currentAnimation = name;
            this.animFrame = 0;
            this.animTimer = 0;
        }
    }
    
    updateAnimation(dt) {
        if (!this.currentAnimation || !this.animations[this.currentAnimation]) return;
        
        const frames = this.animations[this.currentAnimation];
        const frame = frames[this.animFrame];
        
        this.animTimer += dt;
        
        if (frame.duration && this.animTimer >= frame.duration) {
            this.animTimer = 0;
            this.animFrame++;
            
            if (this.animFrame >= frames.length) {
                if (loop) {
                    this.animFrame = 0;
                } else {
                    this.animFrame = frames.length - 1;
                }
            }
        }
    }
    
    draw(ctx) {
        if (!this.visible) return;
        
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.scale(this.scale, this.scale);
        
        if (this.image) {
            if (this.currentAnimation) {
                const frame = this.animations[this.currentAnimation][this.animFrame];
                if (frame.srcX !== undefined) {
                    ctx.drawImage(
                        this.image,
                        frame.srcX, frame.srcY, frame.width, frame.height,
                        -this.originX, -this.originY, frame.width, frame.height
                    );
                }
            } else {
                ctx.drawImage(
                    this.image,
                    -this.originX, -this.originY, this.width, this.height
                );
            }
        }
        
        ctx.restore();
    }
}

class SpriteSheet {
    constructor(image, frameWidth, frameHeight) {
        this.image = image;
        this.frameWidth = frameWidth;
        this.frameHeight = frameHeight;
        this.frames = [];
        this.animations = {};
        
        this.parse();
    }
    
    parse() {
        const cols = Math.floor(this.image.width / this.frameWidth);
        const rows = Math.floor(this.image.height / this.frameHeight);
        
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                this.frames.push({
                    x: x * this.frameWidth,
                    y: y * this.frameHeight,
                    width: this.frameWidth,
                    height: this.frameHeight
                });
            }
        }
    }
    
    getFrame(index) {
        return this.frames[index];
    }
    
    addAnimation(name, frameIndices, frameDuration = 0.1) {
        this.animations[name] = frameIndices.map((index, i) => ({
            ...this.frames[index],
            duration: frameDuration,
            srcX: this.frames[index].x,
            srcY: this.frames[index].y
        }));
    }
    
    getAnimation(name) {
        return this.animations[name];
    }
}

class SpriteRenderer {
    constructor(ctx) {
        this.ctx = ctx;
        this.sprites = {};
        this.spriteSheets = {};
        this.defaultSprite = this.createDefaultSprite();
    }
    
    createDefaultSprite() {
        // 创建一个简单的默认精灵
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;
        const ctx = canvas.getContext('2d');
        
        ctx.fillStyle = '#ff00ff';
        ctx.fillRect(0, 0, 32, 32);
        
        return canvas;
    }
    
    loadSpriteSheet(id, url, frameWidth, frameHeight) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                this.spriteSheets[id] = new SpriteSheet(img, frameWidth, frameHeight);
                resolve(this.spriteSheets[id]);
            };
            img.onerror = reject;
            img.src = url;
        });
    }
    
    getSpriteSheet(id) {
        return this.spriteSheets[id];
    }
    
    createSprite(sheetId, frameIndex, options = {}) {
        const sheet = this.spriteSheets[sheetId];
        if (!sheet) {
            return new Sprite(this.defaultSprite, options);
        }
        
        const frame = sheet.getFrame(frameIndex);
        const canvas = document.createElement('canvas');
        canvas.width = frame.width;
        canvas.height = frame.height;
        const ctx = canvas.getContext('2d');
        
        ctx.drawImage(
            sheet.image,
            frame.x, frame.y, frame.width, frame.height,
            0, 0, frame.width, frame.height
        );
        
        return new Sprite(canvas, {
            width: frame.width,
            height: frame.height,
            ...options
        });
    }
    
    addSprite(id, sprite) {
        this.sprites[id] = sprite;
    }
    
    getSprite(id) {
        return this.sprites[id];
    }
    
    removeSprite(id) {
        delete this.sprites[id];
    }
    
    update(dt) {
        for (const sprite of Object.values(this.sprites)) {
            sprite.updateAnimation(dt);
        }
    }
    
    render() {
        for (const sprite of Object.values(this.sprites)) {
            sprite.draw(this.ctx);
        }
    }
}

// 精灵动画定义
const SPRITE_ANIMATIONS = {
    player_idle: {
        frames: [0, 1, 2, 3],
        duration: 0.25
    },
    player_walk: {
        frames: [4, 5, 6, 7],
        duration: 0.1
    },
    player_attack: {
        frames: [8, 9, 10, 11],
        duration: 0.08
    },
    player_hurt: {
        frames: [12, 13],
        duration: 0.1
    },
    player_death: {
        frames: [14, 15, 16, 17],
        duration: 0.2
    },
    
    enemy_idle: {
        frames: [0, 1],
        duration: 0.3
    },
    enemy_walk: {
        frames: [2, 3, 4, 5],
        duration: 0.15
    },
    enemy_attack: {
        frames: [6, 7, 8],
        duration: 0.1
    },
    enemy_hurt: {
        frames: [9, 10],
        duration: 0.1
    },
    enemy_death: {
        frames: [11, 12, 13],
        duration: 0.2
    }
};

export { Sprite, SpriteSheet, SpriteRenderer, SPRITE_ANIMATIONS };

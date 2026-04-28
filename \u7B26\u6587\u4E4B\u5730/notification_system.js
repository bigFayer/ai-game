/**
 * 符文之地 - 通知系统
 */

class Notification {
    constructor(options = {}) {
        this.id = options.id || `notif_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
        this.text = options.text || '';
        this.type = options.type || 'info'; // info, success, warning, error, achievement, item
        this.icon = options.icon || this.getDefaultIcon();
        this.color = options.color || this.getDefaultColor();
        this.duration = options.duration || 3000;
        this.life = this.duration;
        this.opacity = 1;
        this.y = 0;
        this.targetY = 0;
        this.x = 0;
        this.width = 300;
        this.height = 50;
        this.padding = 10;
        this.fontSize = 14;
        this.voiceLine = options.voiceLine || null;
        this.playSound = options.playSound !== false;
    }
    
    getDefaultIcon() {
        const icons = {
            info: '📢',
            success: '✅',
            warning: '⚠',
            error: '❌',
            achievement: '🏆',
            item: '📦',
            levelup: '⬆',
            damage: '💥',
            gold: '💰',
            quest: '📜'
        };
        return icons[this.type] || icons.info;
    }
    
    getDefaultColor() {
        const colors = {
            info: '#4488ff',
            success: '#44ff44',
            warning: '#ffaa00',
            error: '#ff4444',
            achievement: '#ffd700',
            item: '#ffd700',
            levelup: '#44ff44',
            damage: '#ff4444',
            gold: '#ffdd00',
            quest: '#4488ff'
        };
        return colors[this.type] || colors.info;
    }
    
    update(dt) {
        this.life -= dt * 1000;
        
        if (this.life < 500) {
            this.opacity = Math.max(0, this.life / 500);
        }
        
        // 平滑移动到目标位置
        this.y += (this.targetY - this.y) * 0.1;
        
        return this.life > 0;
    }
}

class NotificationManager {
    constructor(game) {
        this.game = game;
        this.notifications = [];
        this.maxNotifications = 5;
        this.baseY = 100;
        this.ySpacing = 60;
        this.x = 20;
        this.soundEnabled = true;
    }
    
    add(options) {
        const notification = new Notification(options);
        
        // 插入到列表开头
        this.notifications.unshift(notification);
        
        // 调整位置
        this.recalculatePositions();
        
        // 移除过多的通知
        while (this.notifications.length > this.maxNotifications) {
            this.notifications.pop();
        }
        
        // 播放音效
        if (this.soundEnabled && notification.playSound) {
            this.playNotificationSound(notification.type);
        }
        
        return notification.id;
    }
    
    show(text, type = 'info', duration = 3000) {
        return this.add({
            text,
            type,
            duration
        });
    }
    
    showItem(text) {
        return this.show(text, 'item', 2500);
    }
    
    showAchievement(text) {
        return this.show(text, 'achievement', 4000);
    }
    
    showLevelUp(level) {
        return this.show(`升级！现在是 ${level} 级`, 'levelup', 3000);
    }
    
    showDamage(text) {
        return this.show(text, 'damage', 1500);
    }
    
    showGold(amount) {
        return this.show(`获得 ${amount} 金币`, 'gold', 2000);
    }
    
    showQuest(text) {
        return this.show(text, 'quest', 3000);
    }
    
    showWarning(text) {
        return this.show(text, 'warning', 3000);
    }
    
    showError(text) {
        return this.show(text, 'error', 4000);
    }
    
    recalculatePositions() {
        for (let i = 0; i < this.notifications.length; i++) {
            this.notifications[i].targetY = this.baseY + i * this.ySpacing;
            if (i === 0) {
                this.notifications[i].y = this.baseY;
            }
        }
    }
    
    update(dt) {
        for (let i = this.notifications.length - 1; i >= 0; i--) {
            const alive = this.notifications[i].update(dt);
            if (!alive) {
                this.notifications.splice(i, 1);
            }
        }
        
        this.recalculatePositions();
    }
    
    render(ctx) {
        ctx.save();
        ctx.globalAlpha = 1;
        
        for (const notif of this.notifications) {
            this.renderNotification(ctx, notif);
        }
        
        ctx.restore();
    }
    
    renderNotification(ctx, notif) {
        ctx.save();
        ctx.globalAlpha = notif.opacity;
        
        const x = this.x;
        const y = notif.y;
        const width = notif.width;
        const height = notif.height;
        
        // 背景
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(x, y, width, height);
        
        // 边框
        ctx.strokeStyle = notif.color;
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, width, height);
        
        // 图标
        ctx.fillStyle = notif.color;
        ctx.font = `${notif.fontSize * 1.5}px serif`;
        ctx.textAlign = 'center';
        ctx.fillText(notif.icon, x + notif.padding + 15, y + height / 2 + 5);
        
        // 文字
        ctx.fillStyle = '#ffffff';
        ctx.font = `${notif.fontSize}px sans-serif`;
        ctx.textAlign = 'left';
        ctx.fillText(notif.text, x + notif.padding + 40, y + height / 2 + 5);
        
        // 进度条
        if (notif.life < notif.duration) {
            const progress = notif.life / notif.duration;
            ctx.fillStyle = notif.color;
            ctx.fillRect(x, y + height - 3, width * progress, 3);
        }
        
        ctx.restore();
    }
    
    playNotificationSound(type) {
        if (!this.game.audioManager) return;
        
        switch (type) {
            case 'achievement':
                this.game.audioManager.play('achievement');
                break;
            case 'levelup':
                this.game.audioManager.play('levelup');
                break;
            case 'item':
                this.game.audioManager.play('getitem');
                break;
            case 'quest':
                this.game.audioManager.play('quest');
                break;
            default:
                this.game.audioManager.play('notify');
        }
    }
    
    clear() {
        this.notifications = [];
    }
}

export { Notification, NotificationManager };

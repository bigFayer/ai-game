/**
 * 符文之地 - 无障碍系统
 */

class AccessibilitySystem {
    constructor(game) {
        this.game = game;
        this.colorblindMode = false;
        this.colorblindType = 'none'; // none, protanopia, deuteranopia, tritanopia
        this.largeText = false;
        this.highContrast = false;
        this.screenReader = false;
        this.reduceMotion = false;
        this.subtitles = true;
        this.audioDescription = false;
        
        this.colorTransform = null;
    }
    
    enableColorblindMode(type = 'protanopia') {
        this.colorblindMode = true;
        this.colorblindType = type;
        this.buildColorTransform();
    }
    
    disableColorblindMode() {
        this.colorblindMode = false;
        this.colorblindType = 'none';
        this.colorTransform = null;
    }
    
    buildColorTransform() {
        // 颜色矩阵转换
        switch (this.colorblindType) {
            case 'protanopia': // 红色盲
                this.colorTransform = [
                    0.567, 0.433, 0, 0, 0,
                    0.558, 0.442, 0, 0, 0,
                    0, 0.242, 0.758, 0, 0,
                    0, 0, 0, 1, 0
                ];
                break;
            case 'deuteranopia': // 绿色盲
                this.colorTransform = [
                    0.625, 0.375, 0, 0, 0,
                    0.7, 0.3, 0, 0, 0,
                    0, 0.3, 0.7, 0, 0,
                    0, 0, 0, 1, 0
                ];
                break;
            case 'tritanopia': // 蓝色盲
                this.colorTransform = [
                    0.95, 0.05, 0, 0, 0,
                    0, 0.433, 0.567, 0, 0,
                    0, 0.475, 0.525, 0, 0,
                    0, 0, 0, 1, 0
                ];
                break;
            default:
                this.colorTransform = null;
        }
    }
    
    applyColorTransform(ctx, drawCallback) {
        if (!this.colorTransform) {
            drawCallback();
            return;
        }
        
        ctx.save();
        ctx.filter = `url(#colorblind-${this.colorblindType})`;
        drawCallback();
        ctx.restore();
    }
    
    enableHighContrast() {
        this.highContrast = true;
    }
    
    disableHighContrast() {
        this.highContrast = false;
    }
    
    enableLargeText() {
        this.largeText = true;
    }
    
    disableLargeText() {
        this.largeText = false;
    }
    
    enableReduceMotion() {
        this.reduceMotion = true;
    }
    
    disableReduceMotion() {
        this.reduceMotion = false;
    }
    
    getColorPalette() {
        if (this.highContrast) {
            return {
                primary: '#ffffff',
                secondary: '#ffff00',
                success: '#00ff00',
                danger: '#ff0000',
                background: '#000000',
                text: '#ffffff',
                border: '#ffffff'
            };
        }
        
        return {
            primary: '#4488ff',
            secondary: '#ffd700',
            success: '#44ff44',
            danger: '#ff4444',
            background: '#0a0a15',
            text: '#ffffff',
            border: '#4488ff'
        };
    }
    
    getFontSize(baseSize) {
        return this.largeText ? baseSize * 1.5 : baseSize;
    }
    
    shouldReduceAnimation() {
        return this.reduceMotion;
    }
}

class ScreenReader {
    constructor(game) {
        this.game = game;
        this.enabled = false;
        this.announceQueue = [];
        this.announceDelay = 100;
    }
    
    enable() {
        this.enabled = true;
    }
    
    disable() {
        this.enabled = false;
    }
    
    announce(message, priority = 'polite') {
        if (!this.enabled) return;
        
        this.announceQueue.push({ message, priority, timestamp: Date.now() });
        
        // 实际实现需要使用Web Speech API
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(message);
            utterance.lang = 'zh-CN';
            window.speechSynthesis.speak(utterance);
        }
    }
    
    announceGameState() {
        if (!this.enabled) return;
        
        const player = this.game.player;
        if (!player) return;
        
        const message = `生命值 ${player.hp}/${player.maxHp}，魔法值 ${player.mp}/${player.maxMp}，等级 ${player.level}，第${this.game.currentFloor}层`;
        this.announce(message);
    }
    
    announceEnemy(enemy) {
        if (!this.enabled) return;
        
        const message = `敌人 ${enemy.name}，生命值 ${enemy.hp}/${enemy.maxHp}`;
        this.announce(message);
    }
    
    announceItem(item) {
        if (!this.enabled) return;
        
        const message = `获得物品 ${item.name}`;
        this.announce(message);
    }
    
    announceAchievement(achievement) {
        if (!this.enabled) return;
        
        const message = `解锁成就 ${achievement.name}`;
        this.announce(message, 'assertive');
    }
}

export { AccessibilitySystem, ScreenReader };

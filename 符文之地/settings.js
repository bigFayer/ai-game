/**
 * 符文之地 - 设置与菜单系统
 */

const DEFAULT_SETTINGS = {
    // 音频
    masterVolume: 1.0,
    musicVolume: 0.5,
    sfxVolume: 0.7,
    
    // 显示
    showFPS: false,
    screenShake: true,
    showDamageNumbers: true,
    showCombatLog: true,
    uiScale: 1.0,
    
    // 游戏
    combatSpeed: 1.0,
    autoSave: true,
    autoSaveInterval: 300, // 秒
    showTutorial: true,
    confirmOnExit: true,
    
    // 辅助
    autoPickupGold: true,
    autoUseHealthPotion: false,
    autoUseHealthPotionThreshold: 0.3,
    showMinimap: true,
    showEnemyHealthBars: true,
    showPlayerBuffs: true,
    
    // 画质
    particleEffects: true,
    screenFlashEffects: true,
    animationQuality: 'high' // low, medium, high
};

const ACHIEVEMENT_NOTIFICATION = {
    duration: 3000,
    position: 'top-right',
    maxVisible: 3,
    slideIn: true,
    sound: true
};

const NOTIFICATION_PRESETS = {
    item: { icon: '📦', color: '#ffd700', duration: 2000 },
    damage: { icon: '💥', color: '#ff4444', duration: 1000 },
    levelup: { icon: '⬆', color: '#44ff44', duration: 3000 },
    quest: { icon: '📜', color: '#4488ff', duration: 2500 },
    achievement: { icon: '🏆', color: '#ffd700', duration: 4000 },
    warning: { icon: '⚠', color: '#ff8800', duration: 3000 },
    gold: { icon: '💰', color: '#ffdd00', duration: 1500 }
};

class SettingsManager {
    constructor() {
        this.settings = { ...DEFAULT_SETTINGS };
        this.loadSettings();
    }
    
    loadSettings() {
        try {
            const saved = localStorage.getItem('rune_land_settings');
            if (saved) {
                const parsed = JSON.parse(saved);
                this.settings = { ...DEFAULT_SETTINGS, ...parsed };
            }
        } catch (e) {
            console.warn('[Settings] 加载设置失败，使用默认设置');
        }
    }
    
    saveSettings() {
        try {
            localStorage.setItem('rune_land_settings', JSON.stringify(this.settings));
        } catch (e) {
            console.warn('[Settings] 保存设置失败');
        }
    }
    
    get(key, defaultValue = null) {
        return this.settings[key] !== undefined ? this.settings[key] : defaultValue;
    }
    
    set(key, value) {
        this.settings[key] = value;
        this.saveSettings();
    }
    
    reset() {
        this.settings = { ...DEFAULT_SETTINGS };
        this.saveSettings();
    }
    
    getAll() {
        return { ...this.settings };
    }
}

class MenuSystem {
    constructor(game) {
        this.game = game;
        this.currentMenu = null;
        this.menuStack = [];
    }
    
    open(menuType) {
        this.currentMenu = menuType;
        this.menuStack.push(menuType);
        this.game.state = 'MENU';
    }
    
    close() {
        this.menuStack.pop();
        this.currentMenu = this.menuStack[this.menuStack.length - 1] || null;
        if (!this.currentMenu) {
            this.game.state = 'PLAYING';
        }
    }
    
    handleInput(action) {
        switch (this.currentMenu) {
            case 'main':
                return this.handleMainMenu(action);
            case 'settings':
                return this.handleSettingsMenu(action);
            case 'inventory':
                return this.handleInventoryMenu(action);
            case 'equipment':
                return this.handleEquipmentMenu(action);
            case 'skill':
                return this.handleSkillMenu(action);
            case 'quest':
                return this.handleQuestMenu(action);
            case 'achievement':
                return this.handleAchievementMenu(action);
            default:
                return false;
        }
    }
    
    handleMainMenu(action) {
        switch (action) {
            case 'new_game':
                this.game.startNewGame();
                this.close();
                break;
            case 'continue':
                this.game.loadGame();
                this.close();
                break;
            case 'settings':
                this.open('settings');
                break;
            case 'achievements':
                this.open('achievement');
                break;
            case 'quit':
                if (confirm('确定要退出游戏吗？')) {
                    window.close();
                }
                break;
        }
        return true;
    }
    
    handleSettingsMenu(action) {
        this.close();
        return true;
    }
    
    handleInventoryMenu(action) {
        this.close();
        return true;
    }
    
    render(ctx) {
        if (!this.currentMenu) return;
        
        switch (this.currentMenu) {
            case 'main':
                this.renderMainMenu(ctx);
                break;
            case 'settings':
                this.renderSettingsMenu(ctx);
                break;
            case 'inventory':
                this.renderInventoryMenu(ctx);
                break;
            default:
                this.renderGenericMenu(ctx);
        }
    }
    
    renderMainMenu(ctx) {
        const width = this.game.canvas.width;
        const height = this.game.canvas.height;
        
        // 半透明背景
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(0, 0, width, height);
        
        // 标题
        ctx.fillStyle = '#ffd700';
        ctx.font = 'bold 48px serif';
        ctx.textAlign = 'center';
        ctx.fillText('符文之地', width / 2, height / 3);
        
        // 菜单选项
        const options = ['继续游戏', '新游戏', '设置', '成就', '退出'];
        options.forEach((opt, i) => {
            ctx.fillStyle = '#ffffff';
            ctx.font = '24px sans-serif';
            ctx.fillText(opt, width / 2, height / 2 + i * 40);
        });
    }
    
    renderSettingsMenu(ctx) {
        const width = this.game.canvas.width;
        const height = this.game.canvas.height;
        
        ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
        ctx.fillRect(0, 0, width, height);
        
        ctx.fillStyle = '#ffd700';
        ctx.font = 'bold 32px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('设置', width / 2, 50);
    }
    
    renderInventoryMenu(ctx) {
        // Inventory rendering
    }
    
    renderGenericMenu(ctx) {
        const width = this.game.canvas.width;
        const height = this.game.canvas.height;
        
        ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
        ctx.fillRect(0, 0, width, height);
    }
}

export { SettingsManager, MenuSystem, DEFAULT_SETTINGS, NOTIFICATION_PRESETS };

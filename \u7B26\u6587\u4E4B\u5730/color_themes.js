/**
 * 符文之地 - 主题与配色系统
 */

const COLOR_THEMES = {
    // 默认主题
    default: {
        name: '默认',
        colors: {
            // 背景
            background: '#0a0a15',
            backgroundLight: '#151525',
            backgroundDark: '#050510',
            
            // 主色
            primary: '#4488ff',
            primaryDark: '#2266dd',
            primaryLight: '#66aaff',
            
            // 强调色
            accent: '#ffd700',
            accentDark: '#ccac00',
            accentLight: '#ffea55',
            
            // 文字
            text: '#ffffff',
            textSecondary: '#aaaaaa',
            textDark: '#666666',
            
            // UI
            panel: 'rgba(20, 20, 40, 0.9)',
            panelBorder: '#3a3a5a',
            button: '#3a3a6a',
            buttonHover: '#4a4a8a',
            buttonActive: '#2a2a5a',
            
            // 状态
            success: '#44ff44',
            warning: '#ffaa00',
            error: '#ff4444',
            info: '#4488ff',
            
            // 游戏元素
            health: '#ff4444',
            mana: '#4488ff',
            experience: '#44ff44',
            gold: '#ffd700'
        }
    },
    
    // 暗黑主题
    dark: {
        name: '暗黑',
        colors: {
            background: '#0a0a0a',
            backgroundLight: '#1a1a1a',
            backgroundDark: '#000000',
            primary: '#666666',
            primaryDark: '#444444',
            primaryLight: '#888888',
            accent: '#888888',
            accentDark: '#666666',
            accentLight: '#aaaaaa',
            text: '#cccccc',
            textSecondary: '#888888',
            textDark: '#555555',
            panel: 'rgba(30, 30, 30, 0.9)',
            panelBorder: '#444444',
            button: '#333333',
            buttonHover: '#444444',
            buttonActive: '#222222',
            success: '#44aa44',
            warning: '#aaaa44',
            error: '#aa4444',
            info: '#4466aa',
            health: '#aa4444',
            mana: '#4466aa',
            experience: '#44aa44',
            gold: '#aaaa44'
        }
    },
    
    // 明亮主题
    light: {
        name: '明亮',
        colors: {
            background: '#f0f0f0',
            backgroundLight: '#ffffff',
            backgroundDark: '#d0d0d0',
            primary: '#3366cc',
            primaryDark: '#2255aa',
            primaryLight: '#5588dd',
            accent: '#cc9900',
            accentDark: '#aa7700',
            accentLight: '#ddbb33',
            text: '#222222',
            textSecondary: '#666666',
            textDark: '#999999',
            panel: 'rgba(255, 255, 255, 0.95)',
            panelBorder: '#cccccc',
            button: '#dddddd',
            buttonHover: '#eeeeee',
            buttonActive: '#cccccc',
            success: '#22aa22',
            warning: '#aa8800',
            error: '#cc3333',
            info: '#3366cc',
            health: '#cc3333',
            mana: '#3366cc',
            experience: '#22aa22',
            gold: '#cc9900'
        }
    }
};

class ThemeManager {
    constructor() {
        this.currentTheme = 'default';
        this.themes = COLOR_THEMES;
    }
    
    setTheme(themeName) {
        if (this.themes[themeName]) {
            this.currentTheme = themeName;
            this.applyTheme();
        }
    }
    
    applyTheme() {
        const theme = this.themes[this.currentTheme];
        if (!theme) return;
        
        for (const [name, color] of Object.entries(theme.colors)) {
            document.documentElement.style.setProperty(`--color-${name}`, color);
        }
    }
    
    getTheme() {
        return this.themes[this.currentTheme];
    }
    
    getColor(name) {
        const theme = this.getTheme();
        return theme?.colors[name] || '#ffffff';
    }
    
    getAllThemes() {
        return Object.entries(this.themes).map(([id, theme]) => ({
            id,
            name: theme.name
        }));
    }
}

export { ThemeManager, COLOR_THEMES };

/**
 * 符文之地 - 标题画面
 */

class TitleScreen {
    constructor(game) {
        this.game = game;
        this.ctx = game.ctx;
        this.width = game.width;
        this.height = game.height;
        
        this.selectedIndex = 0;
        this.options = [
            { text: '开始游戏', action: () => this.startNewGame() },
            { text: '继续游戏', action: () => this.continueGame() },
            { text: '游戏设置', action: () => this.openSettings() },
            { text: '游戏手册', action: () => this.openManual() },
            { text: '制作人员', action: () => this.showCredits() }
        ];
        
        this.backgroundOffset = 0;
        this.titleBounce = 0;
        this.optionAlpha = [];
        for (let i = 0; i < this.options.length; i++) {
            this.optionAlpha[i] = 0.5;
        }
        
        this.setupInput();
    }
    
    setupInput() {
        this.game.input.on('keydown', (e) => {
            if (e.key === 'ArrowUp' || e.key === 'KeyW') {
                this.selectPrevious();
            } else if (e.key === 'ArrowDown' || e.key === 'KeyS') {
                this.selectNext();
            } else if (e.key === 'Enter' || e.key === 'Space') {
                this.confirm();
            }
        });
    }
    
    selectPrevious() {
        this.optionAlpha[this.selectedIndex] = 0.5;
        this.selectedIndex = (this.selectedIndex - 1 + this.options.length) % this.options.length;
        this.optionAlpha[this.selectedIndex] = 1.0;
    }
    
    selectNext() {
        this.optionAlpha[this.selectedIndex] = 0.5;
        this.selectedIndex = (this.selectedIndex + 1) % this.options.length;
        this.optionAlpha[this.selectedIndex] = 1.0;
    }
    
    confirm() {
        if (this.options[this.selectedIndex]) {
            this.options[this.selectedIndex].action();
        }
    }
    
    startNewGame() {
        this.game.state = 'CHARACTER_SELECT';
        // 显示角色选择界面
    }
    
    continueGame() {
        if (this.game.saveManager.hasSave(0)) {
            this.game.saveManager.load(0);
            this.game.state = 'PLAYING';
        } else {
            // 显示提示：没有存档
        }
    }
    
    openSettings() {
        this.game.state = 'SETTINGS';
    }
    
    openManual() {
        this.game.state = 'MANUAL';
    }
    
    showCredits() {
        this.game.state = 'CREDITS';
    }
    
    update(dt) {
        this.backgroundOffset += dt * 20;
        this.titleBounce = Math.sin(Date.now() / 500) * 5;
        
        for (let i = 0; i < this.options.length; i++) {
            if (i === this.selectedIndex) {
                this.optionAlpha[i] = Math.min(1.0, this.optionAlpha[i] + dt * 3);
            } else {
                this.optionAlpha[i] = Math.max(0.5, this.optionAlpha[i] - dt * 3);
            }
        }
    }
    
    render() {
        const ctx = this.ctx;
        
        // 背景
        this.renderBackground();
        
        // 标题
        this.renderTitle();
        
        // 选项
        this.renderOptions();
        
        // 版本信息
        ctx.fillStyle = '#666666';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('v1.0.0', 10, this.height - 10);
    }
    
    renderBackground() {
        const ctx = this.ctx;
        
        // 渐变背景
        const gradient = ctx.createLinearGradient(0, 0, 0, this.height);
        gradient.addColorStop(0, '#0a0a15');
        gradient.addColorStop(0.5, '#151525');
        gradient.addColorStop(1, '#0a0a15');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, this.width, this.height);
        
        // 星空效果
        ctx.fillStyle = '#ffffff';
        for (let i = 0; i < 100; i++) {
            const x = (i * 137.5 + this.backgroundOffset * 0.1) % this.width;
            const y = (i * 97.3) % this.height;
            const size = (Math.sin(i + Date.now() / 1000) + 1) * 1.5;
            ctx.globalAlpha = 0.3 + Math.sin(i + Date.now() / 500) * 0.3;
            ctx.fillRect(x, y, size, size);
        }
        ctx.globalAlpha = 1;
    }
    
    renderTitle() {
        const ctx = this.ctx;
        const titleY = 150 + this.titleBounce;
        
        // 标题阴影
        ctx.fillStyle = '#000000';
        ctx.font = 'bold 60px serif';
        ctx.textAlign = 'center';
        ctx.fillText('符文之地', this.width / 2 + 3, titleY + 3);
        
        // 标题渐变
        const gradient = ctx.createLinearGradient(0, titleY - 40, 0, titleY + 20);
        gradient.addColorStop(0, '#ffd700');
        gradient.addColorStop(0.5, '#ff8800');
        gradient.addColorStop(1, '#ff4400');
        ctx.fillStyle = gradient;
        ctx.fillText('符文之地', this.width / 2, titleY);
        
        // 副标题
        ctx.font = '20px sans-serif';
        ctx.fillStyle = '#aaaaaa';
        ctx.fillText('Roguelike ARPG', this.width / 2, titleY + 40);
    }
    
    renderOptions() {
        const ctx = this.ctx;
        const startY = 350;
        const spacing = 50;
        
        for (let i = 0; i < this.options.length; i++) {
            const y = startY + i * spacing;
            const option = this.options[i];
            
            // 选项背景
            ctx.globalAlpha = this.optionAlpha[i] * 0.3;
            ctx.fillStyle = '#4488ff';
            ctx.fillRect(this.width / 2 - 150, y - 20, 300, 40);
            
            // 选项边框
            ctx.globalAlpha = this.optionAlpha[i];
            ctx.strokeStyle = '#4488ff';
            ctx.lineWidth = 2;
            ctx.strokeRect(this.width / 2 - 150, y - 20, 300, 40);
            
            // 选项文字
            ctx.fillStyle = i === this.selectedIndex ? '#ffffff' : '#aaaaaa';
            ctx.font = i === this.selectedIndex ? 'bold 20px sans-serif' : '18px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(option.text, this.width / 2, y + 5);
        }
        
        ctx.globalAlpha = 1;
        
        // 提示
        ctx.font = '14px sans-serif';
        ctx.fillStyle = '#666666';
        ctx.fillText('使用 ↑↓ 选择，Enter 确认', this.width / 2, this.height - 50);
    }
}

export { TitleScreen };

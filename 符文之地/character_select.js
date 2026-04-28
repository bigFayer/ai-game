/**
 * 符文之地 - 角色选择画面
 */

class CharacterSelectScreen {
    constructor(game) {
        this.game = game;
        this.ctx = game.ctx;
        this.width = game.width;
        this.height = game.height;
        
        this.selectedIndex = 0;
        this.characters = ['warrior', 'mage', 'ranger', 'cleric'];
        this.characterData = {};
        
        this.loadCharacterData();
        this.setupInput();
    }
    
    loadCharacterData() {
        for (const id of this.characters) {
            const config = CHARACTER_CLASS_CONFIG[id];
            this.characterData[id] = config;
        }
    }
    
    setupInput() {
        window.onkeydown = (e) => {
            if (e.key === 'ArrowLeft' || e.key === 'KeyA') {
                this.selectPrevious();
            } else if (e.key === 'ArrowRight' || e.key === 'KeyD') {
                this.selectNext();
            } else if (e.key === 'Enter' || e.key === 'Space') {
                this.confirm();
            } else if (e.key === 'Escape') {
                this.back();
            }
        };
    }
    
    selectPrevious() {
        this.selectedIndex = (this.selectedIndex - 1 + this.characters.length) % this.characters.length;
    }
    
    selectNext() {
        this.selectedIndex = (this.selectedIndex + 1) % this.characters.length;
    }
    
    confirm() {
        const classId = this.characters[this.selectedIndex];
        this.game.newGame(classId);
        this.game.state = 'PLAYING';
    }
    
    back() {
        this.game.state = 'TITLE';
    }
    
    render() {
        const ctx = this.ctx;
        
        // 背景
        ctx.fillStyle = '#0a0a15';
        ctx.fillRect(0, 0, this.width, this.height);
        
        // 标题
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 30px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('选择职业', this.width / 2, 50);
        
        // 角色卡片
        const cardWidth = 150;
        const cardHeight = 250;
        const spacing = 30;
        const totalWidth = this.characters.length * cardWidth + (this.characters.length - 1) * spacing;
        const startX = (this.width - totalWidth) / 2;
        
        for (let i = 0; i < this.characters.length; i++) {
            const x = startX + i * (cardWidth + spacing);
            const y = 150;
            const data = this.characterData[this.characters[i]];
            const isSelected = i === this.selectedIndex;
            
            // 卡片背景
            ctx.fillStyle = isSelected ? '#1a2a4a' : '#151525';
            ctx.fillRect(x, y, cardWidth, cardHeight);
            
            // 边框
            ctx.strokeStyle = isSelected ? '#4488ff' : '#333355';
            ctx.lineWidth = isSelected ? 3 : 1;
            ctx.strokeRect(x, y, cardWidth, cardHeight);
            
            // 角色图标
            ctx.fillStyle = data.color;
            ctx.font = 'bold 40px serif';
            ctx.textAlign = 'center';
            ctx.fillText(this.getClassIcon(data.id), x + cardWidth / 2, y + 50);
            
            // 角色名称
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 18px sans-serif';
            ctx.fillText(data.name, x + cardWidth / 2, y + 90);
            
            // 描述
            ctx.fillStyle = '#aaaaaa';
            ctx.font = '12px sans-serif';
            const desc = data.description.split(',');
            ctx.fillText(desc[0] || '', x + cardWidth / 2, y + 115);
            
            // 属性
            ctx.font = '12px sans-serif';
            ctx.fillStyle = '#888888';
            ctx.fillText(`HP: ${data.stats.hp}  MP: ${data.stats.mp}`, x + cardWidth / 2, y + 150);
            ctx.fillText(`ATK: ${data.stats.atk}  DEF: ${data.stats.def}`, x + cardWidth / 2, y + 165);
            ctx.fillText(`SPD: ${data.stats.spd}  LUK: ${data.stats.luk}`, x + cardWidth / 2, y + 180);
            
            // 特点
            ctx.fillStyle = '#44ff44';
            const strengths = data.strength || [];
            for (let j = 0; j < Math.min(strengths.length, 2); j++) {
                ctx.fillText('+' + strengths[j], x + cardWidth / 2, y + 200 + j * 15);
            }
        }
        
        // 详细信息
        const selectedClass = this.characters[this.selectedIndex];
        const selectedData = this.characterData[selectedClass];
        
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 24px sans-serif';
        ctx.fillText(selectedData.name, this.width / 2, 450);
        
        ctx.fillStyle = '#aaaaaa';
        ctx.font = '14px sans-serif';
        ctx.fillText(selectedData.description, this.width / 2, 480);
        
        // 提示
        ctx.font = '14px sans-serif';
        ctx.fillStyle = '#666666';
        ctx.fillText('← → 选择职业    Enter 确认    ESC 返回', this.width / 2, this.height - 30);
    }
    
    getClassIcon(classId) {
        const icons = {
            warrior: '⚔',
            mage: '🔮',
            ranger: '🏹',
            cleric: '✝'
        };
        return icons[classId] || '?';
    }
}

export { CharacterSelectScreen };

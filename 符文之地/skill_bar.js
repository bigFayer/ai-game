/**
 * 符文之地 - 技能栏系统
 */

class SkillBar {
    constructor(game) {
        this.game = game;
        this.slots = 4; // 4个技能槽
        this.skills = []; // 当前装备的技能ID列表
        this.cooldowns = []; // 每个技能的冷却时间
        this.selectedSlot = 0;
        this.x = 0;
        this.y = 0;
        this.slotSize = 60;
        this.padding = 8;
        this.visible = true;
        
        for (let i = 0; i < this.slots; i++) {
            this.skills.push(null);
            this.cooldowns.push(0);
        }
    }
    
    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }
    
    equipSkill(skillId, slot) {
        if (slot >= 0 && slot < this.slots) {
            this.skills[slot] = skillId;
            return true;
        }
        return false;
    }
    
    unequipSkill(slot) {
        if (slot >= 0 && slot < this.slots) {
            this.skills[slot] = null;
            return true;
        }
        return false;
    }
    
    useSkill(slot) {
        if (slot < 0 || slot >= this.slots) return false;
        
        const skillId = this.skills[slot];
        if (!skillId) return false;
        
        const skill = this.game.skillManager?.getSkill(skillId);
        if (!skill) return false;
        
        // 检查冷却
        if (this.cooldowns[slot] > 0) {
            this.game.showNotification('技能冷却中');
            return false;
        }
        
        // 检查MP
        if (this.game.player.mp < skill.mpCost) {
            this.game.showNotification('MP不足');
            return false;
        }
        
        // 执行技能
        const result = this.game.skillManager?.executeSkill(skillId, this.game.player, this.game.currentEnemy, this.game.combatSystem);
        
        if (result?.success) {
            // 设置冷却
            this.cooldowns[slot] = skill.cooldown;
            
            // 播放特效
            if (result.damage > 0) {
                this.game.combatEffects?.skillEffect(
                    this.game.currentEnemy?.x || 0,
                    this.game.currentEnemy?.y || 0,
                    skill.element
                );
            }
            
            return true;
        }
        
        return false;
    }
    
    selectSlot(index) {
        if (index >= 0 && index < this.slots) {
            this.selectedSlot = index;
        }
    }
    
    update(dt) {
        // 更新冷却
        for (let i = 0; i < this.slots; i++) {
            if (this.cooldowns[i] > 0) {
                this.cooldowns[i] -= dt;
                if (this.cooldowns[i] < 0) this.cooldowns[i] = 0;
            }
        }
    }
    
    render(ctx) {
        if (!this.visible) return;
        
        const ctx = ctx;
        const totalWidth = this.slots * this.slotSize + (this.slots - 1) * this.padding;
        const startX = this.x - totalWidth / 2;
        const y = this.y;
        
        // 背景
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.fillRect(startX - 5, y - 5, totalWidth + 10, this.slotSize + 10);
        
        // 槽位
        for (let i = 0; i < this.slots; i++) {
            const x = startX + i * (this.slotSize + this.padding);
            const isSelected = i === this.selectedSlot;
            const skillId = this.skills[i];
            const cooldown = this.cooldowns[i];
            const skill = skillId ? this.game.skillManager?.getSkill(skillId) : null;
            
            // 槽位背景
            ctx.fillStyle = isSelected ? '#3a3a6a' : '#2a2a4a';
            ctx.fillRect(x, y, this.slotSize, this.slotSize);
            
            // 边框
            ctx.strokeStyle = isSelected ? '#8888ff' : '#4a4a6a';
            ctx.lineWidth = isSelected ? 3 : 1;
            ctx.strokeRect(x, y, this.slotSize, this.slotSize);
            
            // 技能图标
            if (skill) {
                // 图标背景
                ctx.fillStyle = this.getSkillColor(skill);
                ctx.fillRect(x + 5, y + 5, this.slotSize - 10, this.slotSize - 10);
                
                // 技能图标
                const icon = this.game.skillManager?.getSkillIcon(skillId);
                ctx.fillStyle = '#ffffff';
                ctx.font = '24px serif';
                ctx.textAlign = 'center';
                ctx.fillText(icon || '?', x + this.slotSize / 2, y + this.slotSize / 2 + 8);
                
                // MP消耗
                ctx.fillStyle = '#4488ff';
                ctx.font = '10px sans-serif';
                ctx.fillText(`${skill.mpCost}MP`, x + this.slotSize / 2, y + this.slotSize - 8);
                
                // 冷却遮罩
                if (cooldown > 0) {
                    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
                    const cooldownRatio = cooldown / skill.cooldown;
                    ctx.fillRect(x, y, this.slotSize, this.slotSize * cooldownRatio);
                    
                    // 冷却时间
                    ctx.fillStyle = '#ffffff';
                    ctx.font = 'bold 16px sans-serif';
                    ctx.fillText(`${Math.ceil(cooldown)}`, x + this.slotSize / 2, y + this.slotSize / 2 + 5);
                }
            }
            
            // 快捷键提示
            ctx.fillStyle = '#666666';
            ctx.font = '10px sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText(`${i + 1}`, x + 3, y + 12);
        }
    }
    
    getSkillColor(skill) {
        if (skill.element === 'fire') return '#ff4400';
        if (skill.element === 'ice') return '#00ffff';
        if (skill.element === 'lightning') return '#ffff00';
        if (skill.element === 'holy') return '#ffd700';
        if (skill.element === 'void') return '#8800ff';
        return '#4488ff';
    }
}

export { SkillBar };

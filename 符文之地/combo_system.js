/**
 * 符文之地 - 连击系统
 */

class ComboSystem {
    constructor(game) {
        this.game = game;
        this.combo = 0;
        this.maxCombo = GAME_CONFIG.COMBAT.MAX_COMBO;
        this.window = GAME_CONFIG.COMBAT.COMBO_WINDOW;
        this.timer = 0;
        this.bonus = 0;
        this.comboCount = 0;
        this.comboHits = [];
    }
    
    hit() {
        this.combo++;
        this.timer = this.window;
        this.comboCount++;
        
        // 计算伤害加成
        this.bonus = Math.min(this.combo, this.maxCombo) * GAME_CONFIG.COMBAT.COMBO_DAMAGE_BONUS;
        
        // 记录连击
        this.comboHits.push({
            combo: this.combo,
            timestamp: Date.now()
        });
        
        // 触发连击事件
        this.onComboIncrease();
        
        // 连击音效
        if (this.game.audioManager) {
            this.game.audioManager.play('combo');
        }
        
        // 连击特效
        if (this.game.particleSystem) {
            this.game.particleSystem.sparkles(
                this.game.player.x,
                this.game.player.y,
                Math.min(this.combo, 10)
            );
        }
    }
    
    miss() {
        this.reset();
    }
    
    reset() {
        this.combo = 0;
        this.timer = 0;
        this.bonus = 0;
    }
    
    update(dt) {
        if (this.timer > 0) {
            this.timer -= dt;
            
            if (this.timer <= 0) {
                // 连击中断
                this.onComboBreak();
                this.reset();
            }
        }
    }
    
    getBonus() {
        return this.bonus;
    }
    
    getComboDamageMultiplier() {
        return 1 + this.bonus;
    }
    
    getComboCount() {
        return this.combo;
    }
    
    isInCombo() {
        return this.combo > 0;
    }
    
    onComboIncrease() {
        const combo = this.combo;
        
        // 显示连击通知
        if (this.game.notificationManager) {
            if (combo >= 5) {
                this.game.notificationManager.show(`${combo} 连击!`, 'combo');
            }
        }
        
        // 连击特效
        if (combo >= 3 && this.game.shaderEffects) {
            const intensity = Math.min((combo - 3) / 7, 1);
            this.game.shaderEffects.setBrightness(1 + intensity * 0.2);
            setTimeout(() => {
                this.game.shaderEffects.setBrightness(1);
            }, 100);
        }
    }
    
    onComboBreak() {
        if (this.game.notificationManager && this.combo >= 5) {
            this.game.notificationManager.show(`连击中断: ${this.comboCount}次`, 'warning');
        }
        this.comboCount = 0;
    }
    
    // 连击技能
    getComboSkill() {
        if (this.combo >= 20) return 'ultimate_combo';
        if (this.combo >= 15) return 'mega_combo';
        if (this.combo >= 10) return 'super_combo';
        if (this.combo >= 5) return 'combo_boost';
        return null;
    }
    
    getComboSkillMultiplier() {
        if (this.combo >= 20) return 2.0;
        if (this.combo >= 15) return 1.8;
        if (this.combo >= 10) return 1.5;
        if (this.combo >= 5) return 1.3;
        return 1.0;
    }
}

class ComboMeter {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.displayCombo = 0;
        this.targetCombo = 0;
    }
    
    setCombo(combo) {
        this.targetCombo = combo;
    }
    
    update(dt) {
        // 平滑过渡
        this.displayCombo += (this.targetCombo - this.displayCombo) * 0.3;
    }
    
    render(ctx) {
        if (this.displayCombo < 1) return;
        
        // 背景
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // 边框
        ctx.strokeStyle = this.getComboColor();
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        
        // 连击数
        ctx.fillStyle = this.getComboColor();
        ctx.font = `bold ${this.height * 0.6}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${Math.floor(this.displayCombo)}x`, this.x + this.width / 2, this.y + this.height / 2);
    }
    
    getComboColor() {
        if (this.displayCombo >= 20) return '#ff00ff';
        if (this.displayCombo >= 15) return '#ff8800';
        if (this.displayCombo >= 10) return '#ffff00';
        if (this.displayCombo >= 5) return '#00ff00';
        return '#00aaff';
    }
}

export { ComboSystem, ComboMeter };

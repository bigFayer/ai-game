/**
 * 符文之地 - 完整锻造系统
 */

const CRAFTING_RECIPES_FULL = {
    // ===== 基础锻造 =====
    // 武器
    forge_iron_sword: {
        name: '锻造铁剑',
        type: 'forge',
        materials: { iron_ore: 5, coal: 3 },
        result: { id: 'iron_sword', quantity: 1 },
        skillRequired: null,
        level: 1,
        successRate: 1.0
    },
    
    forge_steel_sword: {
        name: '锻造钢剑',
        type: 'forge',
        materials: { steel_ingot: 3, leather: 2 },
        result: { id: 'steel_sword', quantity: 1 },
        skillRequired: null,
        level: 3,
        successRate: 0.9
    },
    
    forge_fire_sword: {
        name: '锻造火焰剑',
        type: 'forge',
        materials: { steel_ingot: 5, fire_essence: 5, coal: 10 },
        result: { id: 'fire_sword', quantity: 1 },
        skillRequired: null,
        level: 8,
        successRate: 0.7
    },
    
    // 防具
    forge_leather_armor: {
        name: '制作皮甲',
        type: 'forge',
        materials: { leather: 8 },
        result: { id: 'leather_armor', quantity: 1 },
        skillRequired: null,
        level: 1,
        successRate: 1.0
    },
    
    forge_chainmail: {
        name: '制作锁甲',
        type: 'forge',
        materials: { iron_ore: 10, leather: 3 },
        result: { id: 'chainmail', quantity: 1 },
        skillRequired: null,
        level: 4,
        successRate: 0.85
    },
    
    forge_plate_armor: {
        name: '制作板甲',
        type: 'forge',
        materials: { steel_ingot: 8, iron_ore: 15, leather: 5 },
        result: { id: 'plate_armor', quantity: 1 },
        skillRequired: null,
        level: 10,
        successRate: 0.7
    },
    
    // ===== 炼金术 =====
    craft_health_potion: {
        name: '制作生命药水',
        type: 'alchemy',
        materials: { herb: 3 },
        result: { id: 'health_potion', quantity: 1 },
        skillRequired: null,
        level: 1,
        successRate: 1.0
    },
    
    craft_mana_potion: {
        name: '制作魔法药水',
        type: 'alchemy',
        materials: { mana_herb: 3 },
        result: { id: 'mana_potion', quantity: 1 },
        skillRequired: null,
        level: 2,
        successRate: 0.95
    },
    
    craft_elixir: {
        name: '制作万能药',
        type: 'alchemy',
        materials: { herb: 5, mana_herb: 5, life_crystal: 1 },
        result: { id: 'elixir', quantity: 1 },
        skillRequired: null,
        level: 10,
        successRate: 0.5
    },
    
    craft_antidote: {
        name: '制作解毒剂',
        type: 'alchemy',
        materials: { herb: 2, mana_herb: 1 },
        result: { id: 'antidote', quantity: 1 },
        skillRequired: null,
        level: 3,
        successRate: 0.9
    },
    
    // ===== 附魔 =====
    enchant_weapon_fire: {
        name: '武器附魔-火焰',
        type: 'enchant',
        materials: { enchant_stone: 1, fire_essence: 3 },
        result: { id: 'fire_sword', quantity: 1, fromExisting: true },
        skillRequired: null,
        level: 5,
        successRate: 0.7
    },
    
    enchant_weapon_ice: {
        name: '武器附魔-冰霜',
        type: 'enchant',
        materials: { enchant_stone: 1, ice_crystal: 3 },
        result: { id: 'ice_sword', quantity: 1, fromExisting: true },
        skillRequired: null,
        level: 5,
        successRate: 0.7
    },
    
    enchant_armor_protection: {
        name: '护甲附魔-保护',
        type: 'enchant',
        materials: { enchant_stone: 2, iron_ore: 10 },
        result: { id: 'enchanted_armor', quantity: 1, fromExisting: true },
        skillRequired: null,
        level: 8,
        successRate: 0.6
    },
    
    // ===== 材料加工 =====
    smelt_steel: {
        name: '冶炼钢锭',
        type: 'smelt',
        materials: { iron_ore: 2, coal: 1 },
        result: { id: 'steel_ingot', quantity: 1 },
        skillRequired: null,
        level: 2,
        successRate: 1.0
    },
    
    refine_gold: {
        name: '精炼黄金',
        type: 'smelt',
        materials: { gold_ingot: 1 },
        result: { id: 'gold_ingot', quantity: 1 },
        skillRequired: null,
        level: 1,
        successRate: 1.0
    },
    
    // ===== 组合 =====
    combine_elements: {
        name: '元素组合',
        type: 'combine',
        materials: { fire_essence: 1, ice_essence: 1 },
        result: { id: 'void_essence', quantity: 1 },
        skillRequired: null,
        level: 15,
        successRate: 0.4
    },
    
    create_life_crystal: {
        name: '创造生命水晶',
        type: 'combine',
        materials: { herb: 10, mana_herb: 5, holy_essence: 2 },
        result: { id: 'life_crystal', quantity: 1 },
        skillRequired: null,
        level: 12,
        successRate: 0.5
    }
};

class CraftingRecipe {
    constructor(data) {
        Object.assign(this, data);
    }
    
    canCraft(inventory, playerLevel) {
        // 检查等级
        if (this.level && playerLevel < this.level) {
            return { canCraft: false, reason: `需要等级 ${this.level}` };
        }
        
        // 检查材料
        for (const [materialId, amount] of Object.entries(this.materials)) {
            if (!inventory.hasItem(materialId, amount)) {
                return { canCraft: false, reason: `缺少材料: ${materialId}` };
            }
        }
        
        return { canCraft: true };
    }
    
    getRequiredMaterials() {
        return { ...this.materials };
    }
}

class CraftingSystemFull {
    constructor(game) {
        this.game = game;
        this.recipes = new Map();
        this.currentRecipe = null;
        this.craftingProgress = 0;
        this.isCrafting = false;
        this.craftingTime = 0;
        
        this.loadRecipes();
    }
    
    loadRecipes() {
        for (const [id, data] of Object.entries(CRAFTING_RECIPES_FULL)) {
            this.recipes.set(id, new CraftingRecipe({ id, ...data }));
        }
    }
    
    getRecipesByType(type) {
        const results = [];
        for (const recipe of this.recipes.values()) {
            if (recipe.type === type) {
                results.push(recipe);
            }
        }
        return results;
    }
    
    getAvailableRecipes() {
        const available = [];
        for (const recipe of this.recipes.values()) {
            const check = recipe.canCraft(this.game.inventory, this.game.player?.level || 1);
            available.push({ recipe, ...check });
        }
        return available;
    }
    
    startCrafting(recipeId) {
        const recipe = this.recipes.get(recipeId);
        if (!recipe) return false;
        
        const check = recipe.canCraft(this.game.inventory, this.game.player?.level || 1);
        if (!check.canCraft) {
            this.game.notificationManager.showWarning(check.reason);
            return false;
        }
        
        // 消耗材料
        for (const [materialId, amount] of Object.entries(recipe.materials)) {
            this.game.inventory.removeItem(materialId, amount);
        }
        
        this.currentRecipe = recipe;
        this.isCrafting = true;
        this.craftingProgress = 0;
        this.craftingTime = this.calculateCraftingTime(recipe);
        
        this.game.notificationManager.show(`开始制作: ${recipe.name}...`);
        
        return true;
    }
    
    calculateCraftingTime(recipe) {
        // 基础时间 + 复杂度调整
        let time = 1.0;
        
        // 材料数量越多时间越长
        const materialCount = Object.keys(recipe.materials).length;
        time += materialCount * 0.5;
        
        // 等级越高时间越短
        const playerLevel = this.game.player?.level || 1;
        time *= Math.max(0.5, 1 - playerLevel * 0.02);
        
        return time;
    }
    
    update(dt) {
        if (!this.isCrafting || !this.currentRecipe) return;
        
        this.craftingProgress += dt / this.craftingTime;
        
        if (this.craftingProgress >= 1.0) {
            this.completeCrafting();
        }
    }
    
    completeCrafting() {
        if (!this.currentRecipe) return;
        
        const recipe = this.currentRecipe;
        
        // 成功判定
        const success = Math.random() < recipe.successRate;
        
        if (success) {
            // 成功
            const result = recipe.result;
            
            if (result.fromExisting) {
                // 附魔等需要原物品
                this.game.notificationManager.show(`${recipe.name} 成功!`);
            } else {
                this.game.inventory.addItem(result.id, result.quantity);
                this.game.notificationManager.showItem(`制作成功: ${result.quantity}x ${result.id}`);
            }
        } else {
            // 失败
            this.game.notificationManager.showWarning(`${recipe.name} 失败了!`);
        }
        
        this.isCrafting = false;
        this.currentRecipe = null;
        this.craftingProgress = 0;
    }
    
    cancelCrafting() {
        if (!this.isCrafting) return;
        
        // 返还部分材料
        if (this.currentRecipe) {
            for (const [materialId, amount] of Object.entries(this.currentRecipe.materials)) {
                this.game.inventory.addItem(materialId, Math.floor(amount * 0.5));
            }
        }
        
        this.isCrafting = false;
        this.currentRecipe = null;
        this.craftingProgress = 0;
        
        this.game.notificationManager.show('制作已取消，部分材料返还');
    }
    
    getCraftingProgress() {
        return {
            isCrafting: this.isCrafting,
            progress: this.craftingProgress,
            recipeName: this.currentRecipe?.name || null,
            timeRemaining: this.isCrafting ? (1 - this.craftingProgress) * this.craftingTime : 0
        };
    }
}

class CraftingUI {
    constructor(craftingSystem) {
        this.system = craftingSystem;
        this.game = craftingSystem.game;
        this.ctx = craftingSystem.game.ctx;
        this.selectedCategory = 'forge';
        this.selectedRecipe = null;
    }
    
    render() {
        const ctx = this.ctx;
        const width = this.game.width;
        const height = this.game.height;
        
        // 背景
        ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
        ctx.fillRect(0, 0, width, height);
        
        // 标题
        ctx.fillStyle = '#ffd700';
        ctx.font = 'bold 24px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('锻造系统', width / 2, 40);
        
        // 分类标签
        const categories = ['forge', 'alchemy', 'enchant', 'smelt', 'combine'];
        const categoryNames = { forge: '锻造', alchemy: '炼金', enchant: '附魔', smelt: '冶炼', combine: '组合' };
        
        for (let i = 0; i < categories.length; i++) {
            const x = 50 + i * 120;
            const y = 70;
            const isSelected = this.selectedCategory === categories[i];
            
            ctx.fillStyle = isSelected ? '#4488ff' : '#333355';
            ctx.fillRect(x, y, 100, 30);
            ctx.strokeStyle = isSelected ? '#66aaff' : '#555577';
            ctx.strokeRect(x, y, 100, 30);
            
            ctx.fillStyle = '#ffffff';
            ctx.font = '14px sans-serif';
            ctx.fillText(categoryNames[categories[i]], x + 50, y + 20);
        }
        
        // 配方列表
        const recipes = this.system.getRecipesByType(this.selectedCategory);
        for (let i = 0; i < recipes.length; i++) {
            const recipe = recipes[i];
            const y = 120 + i * 40;
            const isSelected = this.selectedRecipe === recipe;
            
            ctx.fillStyle = isSelected ? 'rgba(68, 136, 255, 0.3)' : 'rgba(50, 50, 80, 0.5)';
            ctx.fillRect(20, y, width - 40, 35);
            
            ctx.fillStyle = '#ffffff';
            ctx.font = '14px sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText(recipe.name, 30, y + 22);
            
            ctx.fillStyle = '#888888';
            ctx.textAlign = 'right';
            ctx.fillText(`成功率: ${Math.floor(recipe.successRate * 100)}%`, width - 30, y + 22);
        }
        
        // 制作按钮
        if (this.selectedRecipe) {
            const canCraft = this.selectedRecipe.canCraft(this.game.inventory, this.game.player?.level || 1);
            
            ctx.fillStyle = canCraft.canCraft ? '#44aa44' : '#aa4444';
            ctx.fillRect(width / 2 - 75, height - 80, 150, 40);
            
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 16px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(canCraft.canCraft ? '开始制作' : canCraft.reason, width / 2, height - 53);
        }
    }
}

export { CraftingSystemFull, CraftingRecipe, CraftingUI, CRAFTING_RECIPES_FULL };

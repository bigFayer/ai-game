/**
 * 符文之地 - 完整合成配方数据库
 */

const CRAFTING_RECIPES = {
    // 武器锻造
    weapons: {
        iron_sword: {
            name: '铁剑',
            materials: [
                { id: 'iron_ore', quantity: 5, name: '铁矿石' },
                { id: 'coal', quantity: 3, name: '煤炭' }
            ],
            tools: ['hammer'],
            station: 'forge',
            skill: 'smithing',
            skillLevel: 1,
            result: { id: 'iron_sword', quantity: 1 },
            goldCost: 50,
            expGain: 10
        },
        steel_sword: {
            name: '钢剑',
            materials: [
                { id: 'steel_ingot', quantity: 3, name: '钢锭' },
                { id: 'leather', quantity: 2, name: '皮革' }
            ],
            tools: ['hammer'],
            station: 'forge',
            skill: 'smithing',
            skillLevel: 5,
            result: { id: 'steel_sword', quantity: 1 },
            goldCost: 150,
            expGain: 25
        },
        fire_sword: {
            name: '火焰剑',
            materials: [
                { id: 'steel_sword', quantity: 1, name: '钢剑' },
                { id: 'fire_essence', quantity: 5, name: '火焰精华' },
                { id: 'fire_gem', quantity: 1, name: '火宝石' }
            ],
            tools: ['hammer', 'crucible'],
            station: 'forge',
            skill: 'smithing',
            skillLevel: 10,
            result: { id: 'fire_sword', quantity: 1 },
            goldCost: 400,
            expGain: 50
        },
        ice_sword: {
            name: '冰霜剑',
            materials: [
                { id: 'steel_sword', quantity: 1, name: '钢剑' },
                { id: 'ice_essence', quantity: 5, name: '冰霜精华' },
                { id: 'ice_crystal', quantity: 3, name: '冰晶' }
            ],
            tools: ['hammer', 'crucible'],
            station: 'forge',
            skill: 'smithing',
            skillLevel: 10,
            result: { id: 'ice_sword', quantity: 1 },
            goldCost: 400,
            expGain: 50
        },
        thunder_sword: {
            name: '雷电剑',
            materials: [
                { id: 'fire_sword', quantity: 1, name: '火焰剑' },
                { id: 'lightning_essence', quantity: 5, name: '雷电精华' },
                { id: 'thunder_gem', quantity: 2, name: '雷宝石' }
            ],
            tools: ['hammer', 'crucible'],
            station: 'forge',
            skill: 'smithing',
            skillLevel: 15,
            result: { id: 'thunder_sword', quantity: 1 },
            goldCost: 800,
            expGain: 100
        },
        dragon_sword: {
            name: '龙之剑',
            materials: [
                { id: 'thunder_sword', quantity: 1, name: '雷电剑' },
                { id: 'dragon_scale', quantity: 3, name: '龙鳞片' },
                { id: 'gold_ingot', quantity: 2, name: '金锭' },
                { id: 'phoenix_feather', quantity: 1, name: '凤凰羽毛' }
            ],
            tools: ['hammer', 'crucible', 'anvil'],
            station: 'forge',
            skill: 'master_smithing',
            skillLevel: 25,
            result: { id: 'dragon_sword', quantity: 1 },
            goldCost: 2000,
            expGain: 200
        }
    },
    
    // 护甲锻造
    armors: {
        leather_armor: {
            name: '皮甲',
            materials: [
                { id: 'leather', quantity: 5, name: '皮革' },
                { id: 'bone', quantity: 3, name: '骨头' }
            ],
            tools: ['needle'],
            station: 'workbench',
            skill: 'tailoring',
            skillLevel: 1,
            result: { id: 'leather_armor', quantity: 1 },
            goldCost: 40,
            expGain: 8
        },
        chainmail: {
            name: '锁甲',
            materials: [
                { id: 'iron_ore', quantity: 8, name: '铁矿石' },
                { id: 'leather', quantity: 4, name: '皮革' }
            ],
            tools: ['hammer', 'tongs'],
            station: 'forge',
            skill: 'smithing',
            skillLevel: 5,
            result: { id: 'chainmail', quantity: 1 },
            goldCost: 120,
            expGain: 20
        },
        plate_armor: {
            name: '板甲',
            materials: [
                { id: 'steel_ingot', quantity: 5, name: '钢锭' },
                { id: 'iron_ore', quantity: 10, name: '铁矿石' }
            ],
            tools: ['hammer', 'tongs', 'anvil'],
            station: 'forge',
            skill: 'smithing',
            skillLevel: 10,
            result: { id: 'plate_armor', quantity: 1 },
            goldCost: 300,
            expGain: 40
        },
        dragon_scale_armor: {
            name: '龙鳞甲',
            materials: [
                { id: 'plate_armor', quantity: 1, name: '板甲' },
                { id: 'dragon_scale', quantity: 5, name: '龙鳞片' },
                { id: 'gold_ingot', quantity: 3, name: '金锭' }
            ],
            tools: ['hammer', 'crucible', 'anvil'],
            station: 'forge',
            skill: 'master_smithing',
            skillLevel: 20,
            result: { id: 'dragon_scale_armor', quantity: 1 },
            goldCost: 1000,
            expGain: 150
        }
    },
    
    // 炼金术
    alchemy: {
        health_potion_small: {
            name: '生命药水',
            materials: [
                { id: 'herb', quantity: 2, name: '草药' },
                { id: 'water', quantity: 1, name: '清水' }
            ],
            tools: ['mortar'],
            station: 'alchemy_bench',
            skill: 'alchemy',
            skillLevel: 1,
            result: { id: 'health_potion', quantity: 2 },
            goldCost: 10,
            expGain: 5
        },
        health_potion_large: {
            name: '大生命药水',
            materials: [
                { id: 'herb', quantity: 5, name: '草药' },
                { id: 'pure_water', quantity: 2, name: '纯净水' },
                { id: 'life_crystal', quantity: 1, name: '生命水晶' }
            ],
            tools: ['mortar', 'calcinator'],
            station: 'alchemy_bench',
            skill: 'alchemy',
            skillLevel: 5,
            result: { id: 'health_potion_large', quantity: 2 },
            goldCost: 40,
            expGain: 15
        },
        mana_potion: {
            name: '魔法药水',
            materials: [
                { id: 'mana_herb', quantity: 2, name: '魔力草' },
                { id: 'water', quantity: 1, name: '清水' }
            ],
            tools: ['mortar'],
            station: 'alchemy_bench',
            skill: 'alchemy',
            skillLevel: 1,
            result: { id: 'mana_potion', quantity: 2 },
            goldCost: 12,
            expGain: 5
        },
        elixir: {
            name: '万能药',
            materials: [
                { id: 'health_potion_large', quantity: 1, name: '大生命药水' },
                { id: 'mana_potion_large', quantity: 1, name: '大魔法药水' },
                { id: 'phoenix_feather', quantity: 1, name: '凤凰羽毛' }
            ],
            tools: ['mortar', 'calcinator', 'philosopher_stone'],
            station: 'alchemy_bench',
            skill: 'advanced_alchemy',
            skillLevel: 15,
            result: { id: 'elixir', quantity: 1 },
            goldCost: 150,
            expGain: 50
        },
        antidote: {
            name: '解毒剂',
            materials: [
                { id: 'herb', quantity: 3, name: '草药' },
                { id: 'poison_gland', quantity: 1, name: '毒腺' }
            ],
            tools: ['mortar'],
            station: 'alchemy_bench',
            skill: 'alchemy',
            skillLevel: 3,
            result: { id: 'antidote', quantity: 2 },
            goldCost: 20,
            expGain: 8
        },
        phoenix_down: {
            name: '凤凰羽毛',
            materials: [
                { id: 'phoenix_eggshell', quantity: 1, name: '凤凰蛋壳' },
                { id: 'life_crystal', quantity: 5, name: '生命水晶' },
                { id: 'fire_essence', quantity: 10, name: '火焰精华' }
            ],
            tools: ['mortar', 'calcinator'],
            station: 'alchemy_bench',
            skill: 'advanced_alchemy',
            skillLevel: 20,
            result: { id: 'phoenix_down', quantity: 1 },
            goldCost: 300,
            expGain: 80
        }
    },
    
    // 附魔
    enchanting: {
        enchant_weapon_fire: {
            name: '武器附魔-火焰',
            materials: [
                { id: 'fire_essence', quantity: 3, name: '火焰精华' },
                { id: 'enchant_stone', quantity: 1, name: '附魔石' }
            ],
            tools: ['enchanting_table'],
            station: 'enchanting_station',
            skill: 'enchanting',
            skillLevel: 5,
            result: { id: 'enchant_fire', name: '火焰附魔' },
            goldCost: 200,
            expGain: 30
        },
        enchant_weapon_ice: {
            name: '武器附魔-冰霜',
            materials: [
                { id: 'ice_essence', quantity: 3, name: '冰霜精华' },
                { id: 'enchant_stone', quantity: 1, name: '附魔石' }
            ],
            tools: ['enchanting_table'],
            station: 'enchanting_station',
            skill: 'enchanting',
            skillLevel: 5,
            result: { id: 'enchant_ice', name: '冰霜附魔' },
            goldCost: 200,
            expGain: 30
        },
        enchant_armor_fire: {
            name: '护甲附魔-火焰抗性',
            materials: [
                { id: 'fire_essence', quantity: 5, name: '火焰精华' },
                { id: 'enchant_stone', quantity: 2, name: '附魔石' }
            ],
            tools: ['enchanting_table'],
            station: 'enchanting_station',
            skill: 'enchanting',
            skillLevel: 8,
            result: { id: 'enchant_fire_resist', name: '火焰抗性附魔' },
            goldCost: 350,
            expGain: 45
        },
        enchant_crit: {
            name: '附魔-暴击',
            materials: [
                { id: 'crit_essence', quantity: 3, name: '暴击精华' },
                { id: 'enchant_stone', quantity: 1, name: '附魔石' }
            ],
            tools: ['enchanting_table'],
            station: 'enchanting_station',
            skill: 'enchanting',
            skillLevel: 10,
            result: { id: 'enchant_crit', name: '暴击附魔' },
            goldCost: 400,
            expGain: 50
        }
    },
    
    // 材料加工
    processing: {
        iron_to_steel: {
            name: '铁矿石冶炼钢锭',
            materials: [
                { id: 'iron_ore', quantity: 3, name: '铁矿石' },
                { id: 'coal', quantity: 2, name: '煤炭' }
            ],
            tools: [],
            station: 'furnace',
            skill: 'smelting',
            skillLevel: 1,
            result: { id: 'steel_ingot', quantity: 1 },
            goldCost: 0,
            expGain: 3
        },
        ore_purify: {
            name: '矿石提纯',
            materials: [
                { id: 'raw_ore', quantity: 5, name: '粗矿' }
            ],
            tools: [],
            station: 'furnace',
            skill: 'smelting',
            skillLevel: 5,
            result: { id: 'iron_ore', quantity: 3 },
            goldCost: 0,
            expGain: 5
        }
    }
};

const CRAFTING_STATIONS = {
    forge: { name: '锻造炉', description: '用于锻造金属装备' },
    workbench: { name: '工作台', description: '用于制作皮甲和布甲' },
    alchemy_bench: { name: '炼金台', description: '用于制作药水和药剂' },
    enchanting_station: { name: '附魔台', description: '用于为装备附魔' },
    furnace: { name: '熔炉', description: '用于冶炼矿石' },
    loom: { name: '织布机', description: '用于制作布料物品' }
};

const CRAFTING_SKILLS = {
    smithing: { name: '锻造', maxLevel: 50, description: '锻造金属武器和护甲' },
    tailoring: { name: '裁缝', maxLevel: 50, description: '制作皮甲和布甲' },
    alchemy: { name: '炼金术', maxLevel: 50, description: '制作药水和药剂' },
    enchanting: { name: '附魔', maxLevel: 50, description: '为装备添加魔法效果' },
    smelting: { name: '冶炼', maxLevel: 30, description: '冶炼和提纯矿石' },
    master_smithing: { name: '大师锻造', maxLevel: 30, description: '传说级装备锻造' },
    advanced_alchemy: { name: '高级炼金术', maxLevel: 30, description: '稀有药水制作' }
};

class CraftingManager {
    constructor(game) {
        this.game = game;
        this.recipes = CRAFTING_RECIPES;
        this.stations = CRAFTING_STATIONS;
        this.skills = CRAFTING_SKILLS;
        this.playerSkills = {};
    }
    
    canCraft(recipeId, category = 'weapons') {
        const recipe = this.recipes[category]?.[recipeId];
        if (!recipe) return { canCraft: false, reason: '配方不存在' };
        
        // 检查等级
        const playerSkillLevel = this.playerSkills[recipe.skill] || 0;
        if (playerSkillLevel < recipe.skillLevel) {
            return { canCraft: false, reason: `需要${recipe.skillLevel}级${this.skills[recipe.skill]?.name || recipe.skill}` };
        }
        
        // 检查金币
        if (this.game.player.gold < recipe.goldCost) {
            return { canCraft: false, reason: '金币不足' };
        }
        
        // 检查材料
        for (const mat of recipe.materials) {
            if (!this.hasMaterial(mat.id, mat.quantity)) {
                return { canCraft: false, reason: `需要${mat.name}x${mat.quantity}` };
            }
        }
        
        return { canCraft: true };
    }
    
    hasMaterial(itemId, quantity) {
        const inv = this.game.player?.inventory || [];
        const item = inv.find(i => i.item.id === itemId);
        return item && item.quantity >= quantity;
    }
    
    craft(recipeId, category = 'weapons') {
        const recipe = this.recipes[category]?.[recipeId];
        if (!recipe) return { success: false, message: '配方不存在' };
        
        const check = this.canCraft(recipeId, category);
        if (!check.canCraft) return { success: false, message: check.reason };
        
        // 消耗材料
        for (const mat of recipe.materials) {
            this.consumeMaterial(mat.id, mat.quantity);
        }
        
        // 消耗金币
        this.game.player.gold -= recipe.goldCost;
        
        // 获得物品
        const result = { ...recipe.result };
        this.game.player.addItem(result);
        
        // 增加技能经验
        this.addSkillExp(recipe.skill, recipe.expGain);
        
        this.game.showNotification(`制作成功：${recipe.name}`);
        this.game.audioManager?.play('craft');
        
        return { success: true, result };
    }
    
    consumeMaterial(itemId, quantity) {
        const inv = this.game.player.inventory;
        for (let i = 0; i < inv.length; i++) {
            if (inv[i].item.id === itemId) {
                if (inv[i].quantity > quantity) {
                    inv[i].quantity -= quantity;
                } else {
                    inv.splice(i, 1);
                }
                return;
            }
        }
    }
    
    addSkillExp(skill, exp) {
        if (!this.playerSkills[skill]) {
            this.playerSkills[skill] = { level: 1, exp: 0 };
        }
        
        const skillData = this.playerSkills[skill];
        skillData.exp += exp;
        
        // 检查升级
        const maxLevel = this.skills[skill]?.maxLevel || 50;
        const expNeeded = skillData.level * 100;
        
        if (skillData.exp >= expNeeded && skillData.level < maxLevel) {
            skillData.level++;
            skillData.exp -= expNeeded;
            this.game.showNotification(`${this.skills[skill]?.name || skill} 升到 ${skillData.level} 级！`);
        }
    }
    
    getAvailableRecipes(category) {
        const recipes = this.recipes[category] || {};
        return Object.entries(recipes).map(([id, recipe]) => ({
            id,
            ...recipe,
            canCraft: this.canCraft(id, category).canCraft,
            reason: this.canCraft(id, category).reason
        }));
    }
    
    getPlayerSkillLevel(skill) {
        return this.playerSkills[skill]?.level || 0;
    }
}

export { CraftingManager, CRAFTING_RECIPES, CRAFTING_STATIONS, CRAFTING_SKILLS };

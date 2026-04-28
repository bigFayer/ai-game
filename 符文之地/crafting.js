/**
 * 符文之地 - 锻造与炼金系统
 * 装备升级 + 物品合成 + 附魔
 */

import { ElementType } from './combat.js';

class CraftingSystem {
    constructor(game) {
        this.game = game;
        this.forgeRecipes = this.initForgeRecipes();
        this.alchemyRecipes = this.initAlchemyRecipes();
        this.enchantRecipes = this.initEnchantRecipes();
    }
    
    initForgeRecipes() {
        return {
            // 武器锻造
            'forge_iron_sword': {
                name: '锻造铁剑',
                materials: [
                    { id: 'iron_ore', name: '铁矿石', quantity: 5 },
                    { id: 'coal', name: '煤炭', quantity: 3 }
                ],
                result: { id: 'iron_sword', name: '铁剑', stats: { atk: 5 } },
                requiredLevel: 1,
                goldCost: 50
            },
            'forge_steel_sword': {
                name: '锻造钢剑',
                materials: [
                    { id: 'steel_ingot', name: '钢锭', quantity: 3 },
                    { id: 'leather', name: '皮革', quantity: 2 }
                ],
                result: { id: 'steel_sword', name: '钢剑', stats: { atk: 10 } },
                requiredLevel: 5,
                goldCost: 150
            },
            'forge_fire_sword': {
                name: '锻造火焰剑',
                materials: [
                    { id: 'steel_sword', name: '钢剑', quantity: 1 },
                    { id: 'fire_essence', name: '火焰精华', quantity: 5 },
                    { id: 'fire_gem', name: '火宝石', quantity: 1 }
                ],
                result: { id: 'fire_sword', name: '火焰剑', stats: { atk: 15, fireResist: 20 }, element: 'fire' },
                requiredLevel: 10,
                goldCost: 400
            },
            // 护甲锻造
            'forge_chainmail': {
                name: '锻造锁甲',
                materials: [
                    { id: 'iron_ore', name: '铁矿石', quantity: 8 },
                    { id: 'leather', name: '皮革', quantity: 4 }
                ],
                result: { id: 'chainmail', name: '锁甲', stats: { def: 12 } },
                requiredLevel: 3,
                goldCost: 100
            },
            'forge_plate_armor': {
                name: '锻造板甲',
                materials: [
                    { id: 'steel_ingot', name: '钢锭', quantity: 5 },
                    { id: 'iron_ore', name: '铁矿石', quantity: 10 }
                ],
                result: { id: 'plate_armor', name: '板甲', stats: { def: 25, hp: 30 } },
                requiredLevel: 8,
                goldCost: 300
            },
            'upgrade_to_dragon': {
                name: '升级为龙鳞甲',
                materials: [
                    { id: 'plate_armor', name: '板甲', quantity: 1 },
                    { id: 'dragon_scale', name: '龙鳞片', quantity: 3 },
                    { id: 'gold_ingot', name: '金锭', quantity: 2 }
                ],
                result: { id: 'dragon_scale_armor', name: '龙鳞甲', stats: { def: 45, hp: 100, fireResist: 50 } },
                requiredLevel: 15,
                goldCost: 800
            }
        };
    }
    
    initAlchemyRecipes() {
        return {
            'potion_health_small': {
                name: '制作小生命药水',
                materials: [
                    { id: 'herb', name: '草药', quantity: 2 },
                    { id: 'water', name: '清水', quantity: 1 }
                ],
                result: { id: 'health_potion', name: '生命药水', quantity: 2 },
                requiredLevel: 1,
                goldCost: 10
            },
            'potion_health_large': {
                name: '制作大生命药水',
                materials: [
                    { id: 'herb', name: '草药', quantity: 5 },
                    { id: 'pure_water', name: '纯净水', quantity: 2 },
                    { id: 'life_crystal', name: '生命水晶', quantity: 1 }
                ],
                result: { id: 'health_potion_large', name: '大生命药水', quantity: 2 },
                requiredLevel: 5,
                goldCost: 30
            },
            'potion_mana_small': {
                name: '制作小魔法药水',
                materials: [
                    { id: 'mana_herb', name: '魔力草', quantity: 2 },
                    { id: 'water', name: '清水', quantity: 1 }
                ],
                result: { id: 'mana_potion', name: '魔法药水', quantity: 2 },
                requiredLevel: 1,
                goldCost: 12
            },
            'potion_elixir': {
                name: '制作万能药',
                materials: [
                    { id: 'health_potion_large', name: '大生命药水', quantity: 1 },
                    { id: 'mana_potion_large', name: '大魔法药水', quantity: 1 },
                    { id: 'phoenix_feather', name: '凤凰羽毛', quantity: 1 }
                ],
                result: { id: 'elixir', name: '万能药', quantity: 1 },
                requiredLevel: 10,
                goldCost: 100
            },
            'antidote': {
                name: '制作解毒剂',
                materials: [
                    { id: 'herb', name: '草药', quantity: 3 },
                    { id: 'poison_gland', name: '毒腺', quantity: 1 }
                ],
                result: { id: 'antidote', name: '解毒剂', quantity: 2 },
                requiredLevel: 3,
                goldCost: 20
            },
            'phoenix_down_craft': {
                name: '制作凤凰羽毛',
                materials: [
                    { id: 'phoenix_eggshell', name: '凤凰蛋壳', quantity: 1 },
                    { id: 'life_crystal', name: '生命水晶', quantity: 5 },
                    { id: 'fire_essence', name: '火焰精华', quantity: 10 }
                ],
                result: { id: 'phoenix_down', name: '凤凰羽毛', quantity: 1 },
                requiredLevel: 15,
                goldCost: 200
            }
        };
    }
    
    initEnchantRecipes() {
        return {
            'enchant_weapon_fire': {
                name: '武器附魔-火焰',
                materials: [
                    { id: 'fire_essence', name: '火焰精华', quantity: 3 },
                    { id: 'enchant_stone', name: '附魔石', quantity: 1 }
                ],
                result: { effect: { element: 'fire', atkBonus: 5 } },
                requiredLevel: 5,
                goldCost: 200
            },
            'enchant_weapon_ice': {
                name: '武器附魔-冰霜',
                materials: [
                    { id: 'ice_essence', name: '冰霜精华', quantity: 3 },
                    { id: 'enchant_stone', name: '附魔石', quantity: 1 }
                ],
                result: { effect: { element: 'ice', atkBonus: 5 } },
                requiredLevel: 5,
                goldCost: 200
            },
            'enchant_armor_fire': {
                name: '护甲附魔-火焰抗性',
                materials: [
                    { id: 'fire_essence', name: '火焰精华', quantity: 5 },
                    { id: 'enchant_stone', name: '附魔石', quantity: 2 }
                ],
                result: { effect: { fireResist: 30 } },
                requiredLevel: 8,
                goldCost: 350
            },
            'enchant_armor_ice': {
                name: '护甲附魔-冰霜抗性',
                materials: [
                    { id: 'ice_essence', name: '冰霜精华', quantity: 5 },
                    { id: 'enchant_stone', name: '附魔石', quantity: 2 }
                ],
                result: { effect: { iceResist: 30 } },
                requiredLevel: 8,
                goldCost: 350
            },
            'enchant_crit': {
                name: '附魔-暴击',
                materials: [
                    { id: 'crit_essence', name: '暴击精华', quantity: 3 },
                    { id: 'enchant_stone', name: '附魔石', quantity: 1 }
                ],
                result: { effect: { critRateBonus: 5 } },
                requiredLevel: 10,
                goldCost: 400
            }
        };
    }
    
    canForge(recipeId) {
        const recipe = this.forgeRecipes[recipeId];
        if (!recipe) return false;
        if (this.game.player.level < recipe.requiredLevel) return false;
        if (this.game.player.gold < recipe.goldCost) return false;
        
        // 检查材料
        for (const mat of recipe.materials) {
            if (!this.hasMaterial(mat.id, mat.quantity)) return false;
        }
        
        return true;
    }
    
    hasMaterial(itemId, quantity) {
        const inv = this.game.player.inventory;
        const item = inv.find(i => i.item.id === itemId);
        return item && item.quantity >= quantity;
    }
    
    forge(recipeId) {
        if (!this.canForge(recipeId)) {
            return { success: false, message: '无法锻造：材料不足或等级不够' };
        }
        
        const recipe = this.forgeRecipes[recipeId];
        
        // 消耗材料
        for (const mat of recipe.materials) {
            this.consumeMaterial(mat.id, mat.quantity);
        }
        
        // 消耗金币
        this.game.player.gold -= recipe.goldCost;
        
        // 获得物品
        const result = { ...recipe.result };
        this.game.player.addItem(result);
        
        this.game.showNotification(`锻造成功：${result.name}`);
        this.game.audioManager?.play('forge');
        
        return { success: true, result };
    }
    
    consumeMaterial(itemId, quantity) {
        const inv = this.game.player.inventory;
        const index = inv.findIndex(i => i.item.id === itemId);
        if (index >= 0) {
            if (inv[index].quantity > quantity) {
                inv[index].quantity -= quantity;
            } else {
                inv.splice(index, 1);
            }
        }
    }
    
    canAlchemy(recipeId) {
        return this.canForge(recipeId); // 通用检查
    }
    
    alchemy(recipeId) {
        const recipe = this.alchemyRecipes[recipeId];
        if (!recipe) return { success: false, message: '配方不存在' };
        
        if (!this.canAlchemy(recipeId)) {
            return { success: false, message: '无法炼制：材料不足或等级不够' };
        }
        
        // 消耗材料
        for (const mat of recipe.materials) {
            this.consumeMaterial(mat.id, mat.quantity);
        }
        
        // 消耗金币
        this.game.player.gold -= recipe.goldCost;
        
        // 获得物品
        const result = { ...recipe.result };
        if (result.quantity > 1) {
            for (let i = 0; i < result.quantity; i++) {
                this.game.player.addItem({ ...result, id: result.id + '_' + i });
            }
        } else {
            this.game.player.addItem(result);
        }
        
        this.game.showNotification(`炼金成功：${result.name}`);
        this.game.audioManager?.play('alchemy');
        
        return { success: true, result };
    }
    
    canEnchant(equipment, recipeId) {
        if (!equipment) return false;
        const recipe = this.enchantRecipes[recipeId];
        if (!recipe) return false;
        if (this.game.player.level < recipe.requiredLevel) return false;
        if (this.game.player.gold < recipe.goldCost) return false;
        
        for (const mat of recipe.materials) {
            if (!this.hasMaterial(mat.id, mat.quantity)) return false;
        }
        
        return true;
    }
    
    enchant(equipment, recipeId) {
        if (!this.canEnchant(equipment, recipeId)) {
            return { success: false, message: '无法附魔' };
        }
        
        const recipe = this.enchantRecipes[recipeId];
        
        // 消耗材料
        for (const mat of recipe.materials) {
            this.consumeMaterial(mat.id, mat.quantity);
        }
        
        // 消耗金币
        this.game.player.gold -= recipe.goldCost;
        
        // 应用附魔效果
        if (equipment.stats) {
            for (const [stat, value] of Object.entries(recipe.result.effect)) {
                if (stat === 'element') {
                    equipment.element = value;
                } else if (stat.endsWith('Resist')) {
                    equipment.stats[stat] = (equipment.stats[stat] || 0) + value;
                } else if (stat === 'atkBonus') {
                    equipment.stats.atk = (equipment.stats.atk || 0) + value;
                } else if (stat === 'critRateBonus') {
                    equipment.stats.critRate = (equipment.stats.critRate || 0) + value;
                }
            }
        }
        
        equipment.enchanted = true;
        equipment.enchantRecipe = recipeId;
        
        this.game.showNotification(`附魔成功：${equipment.name}`);
        this.game.audioManager?.play('enchant');
        
        return { success: true, equipment };
    }
    
    getAvailableRecipes() {
        const available = [];
        for (const [id, recipe] of Object.entries({...this.forgeRecipes, ...this.alchemyRecipes})) {
            if (this.game.player.level >= recipe.requiredLevel) {
                available.push({ id, ...recipe });
            }
        }
        return available;
    }
    
    getAvailableEnchants(equipment) {
        if (!equipment) return [];
        const available = [];
        for (const [id, recipe] of Object.entries(this.enchantRecipes)) {
            if (this.game.player.level >= recipe.requiredLevel) {
                available.push({ id, ...recipe });
            }
        }
        return available;
    }
}

export { CraftingSystem };

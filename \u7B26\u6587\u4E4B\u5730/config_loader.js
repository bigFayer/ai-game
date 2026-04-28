/**
 * 符文之地 - 配置加载器
 */

import { GAME_CONFIG } from './game_constants.js';
import { CharacterClassConfig } from './game_constants.js';
import { RarityConfig } from './game_constants.js';
import { ElementType } from './game_constants.js';
import { ITEM_DATABASE } from './item_database_full.js';
import { SKILL_DATABASE } from './skill_database_full.js';
import { ENEMY_DATABASE } from './enemies_full_config.js';
import { FULL_DIALOGUE_DATABASE } from './dialogue_database.js';
import { ACHIEVEMENT_DATABASE } from './achievement_database.js';

class ConfigLoader {
    constructor() {
        this.configs = {
            game: GAME_CONFIG,
            classes: CharacterClassConfig,
            rarities: RarityConfig,
            elements: ElementType,
            items: ITEM_DATABASE,
            skills: SKILL_DATABASE,
            enemies: ENEMY_DATABASE,
            dialogues: FULL_DIALOGUE_DATABASE,
            achievements: ACHIEVEMENT_DATABASE
        };
        
        this.initialized = false;
    }
    
    async init() {
        console.log('[ConfigLoader] 加载配置文件...');
        
        // 加载本地配置
        await this.loadLocalConfig();
        
        // 验证配置
        this.validate();
        
        this.initialized = true;
        console.log('[ConfigLoader] 配置加载完成');
    }
    
    async loadLocalConfig() {
        // 实际应用中会从服务器或本地存储加载
        // 这里使用内嵌配置
    }
    
    validate() {
        const errors = [];
        
        // 验证游戏配置
        if (!this.configs.game.CANVAS_WIDTH || !this.configs.game.CANVAS_HEIGHT) {
            errors.push('Canvas尺寸未配置');
        }
        
        // 验证职业配置
        for (const [id, cls] of Object.entries(this.configs.classes)) {
            if (!cls.stats) {
                errors.push(`职业${id}缺少stats`);
            }
        }
        
        // 验证物品配置
        for (const [id, item] of Object.entries(this.configs.items)) {
            if (!item.rarity) {
                errors.push(`物品${id}缺少rarity`);
            }
        }
        
        if (errors.length > 0) {
            console.warn('[ConfigLoader] 配置警告:', errors);
        }
    }
    
    get(category) {
        return this.configs[category];
    }
    
    getItem(id) {
        for (const category of Object.values(this.configs.items)) {
            if (category[id]) {
                return category[id];
            }
        }
        return null;
    }
    
    getEnemy(id) {
        return this.configs.enemies[id];
    }
    
    getSkill(id, characterClass = null) {
        if (characterClass && this.configs.skills[characterClass]) {
            return this.configs.skills[characterClass][id];
        }
        
        // 全局搜索
        for (const clsSkills of Object.values(this.configs.skills)) {
            if (clsSkills[id]) {
                return clsSkills[id];
            }
        }
        
        return null;
    }
    
    getAchievement(id) {
        return this.configs.achievements[id];
    }
    
    getAllAchievements() {
        return Object.values(this.configs.achievements);
    }
    
    getAchievementsByCategory(category) {
        return Object.values(this.configs.achievements).filter(a => a.category === category);
    }
    
    getAllDialogues(npcId = null) {
        if (npcId) {
            return this.configs.dialogues[npcId];
        }
        return this.configs.dialogues;
    }
}

export { ConfigLoader };

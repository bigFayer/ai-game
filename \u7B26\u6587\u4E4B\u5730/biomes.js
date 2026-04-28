/**
 * 符文之地 - 地区/生物群系系统
 */

const BIOME_DATA = {
    forest: {
        id: 'forest',
        name: '阴暗森林',
        description: '曾经是精灵的家园，如今布满危险的怪物。',
        floors: '1-10',
        themeColor: '#2d5a2d',
        floorColor: '#1a3a1a',
        wallColor: '#2a4a2a',
        accentColor: '#4a8a4a',
        enemies: ['goblin', 'wolf', 'skeleton', 'spider', 'bear', 'goblin_chief'],
        eliteTypes: ['spider_queen', 'wolf_alpha'],
        boss: { id: 'forest_troll', name: '巨魔首领', floor: 10 },
        shopTypes: ['potion', 'basic_gear'],
        events: ['random_enemy', 'chest', 'trap', 'healing_spring'],
        music: 'forest_theme',
        difficulty: 1.0,
        dropTable: {
            common: ['herb', 'leather', 'bone'],
            uncommon: ['elf_dust', 'wolf_pelt'],
            rare: ['spider_silk', 'ancient_wood']
        }
    },
    desert: {
        id: 'desert',
        name: '荒芜沙漠',
        description: '曾经的繁华帝国，如今只剩废墟和诅咒。',
        floors: '11-20',
        themeColor: '#c2a64d',
        floorColor: '#3a3020',
        wallColor: '#5a4a30',
        accentColor: '#c2a64d',
        enemies: ['scorpion', 'mummy', 'sandworm', 'cobra', 'pharaoh_guard'],
        eliteTypes: ['desert_knight', 'sandworm_alpha'],
        boss: { id: 'desert_pharaoh', name: '法老王', floor: 20 },
        shopTypes: ['potion', 'desert_gear'],
        events: ['random_enemy', 'chest', 'mummy_curse', 'oasis'],
        music: 'desert_theme',
        difficulty: 1.5,
        dropTable: {
            common: ['sand', 'bone', 'ancient_coin'],
            uncommon: ['scarab', 'desert_rose'],
            rare: ['pharaoh_gem', 'ancient_tome']
        }
    },
    ice: {
        id: 'ice',
        name: '冰霜要塞',
        description: '远古巨人族的遗迹，冰雪覆盖的塔楼中封印着古老的力量。',
        floors: '21-30',
        themeColor: '#6a9fb5',
        floorColor: '#1a2a3a',
        wallColor: '#3a5a7a',
        accentColor: '#6a9fb5',
        enemies: ['golem', 'wraith', 'ice_elemental', 'ice_giant'],
        eliteTypes: ['frost_wyrm', 'ice_lich'],
        boss: { id: 'ice_dragon', name: '冰霜巨龙', floor: 30 },
        shopTypes: ['potion', 'ice_gear', 'rare_materials'],
        events: ['random_enemy', 'chest', 'ice_trap', 'frost_nova'],
        music: 'ice_theme',
        difficulty: 2.0,
        dropTable: {
            common: ['ice_crystal', 'frost_ore', 'ancient_bone'],
            uncommon: ['golem_core', 'wraith_essence'],
            rare: ['dragon_scale', 'frost_heart']
        }
    },
    fire: {
        id: 'fire',
        name: '烈焰地狱',
        description: '火山活跃的区域，火焰领主统治着这片燃烧的土地。',
        floors: '31-40',
        themeColor: '#b54a2a',
        floorColor: '#3a1a1a',
        wallColor: '#5a2a2a',
        accentColor: '#b54a2a',
        enemies: ['imp', 'drake', 'fire_elemental', 'fire_demon'],
        eliteTypes: ['inferno', 'flame_serpent'],
        boss: { id: 'fire_lord', name: '火焰领主', floor: 40 },
        shopTypes: ['potion', 'fire_gear', 'enchanting'],
        events: ['random_enemy', 'chest', 'fire_trap', 'lava_flow'],
        music: 'fire_theme',
        difficulty: 2.5,
        dropTable: {
            common: ['sulfur', 'magma_rock', 'demon_horn_shard'],
            uncommon: ['fire_essence', 'dragon_tooth'],
            rare: ['phoenix_feather', 'infernal_core']
        }
    },
    void: {
        id: 'void',
        name: '虚空神殿',
        description: '大灾变的中心，虚空力量最浓郁的地方。',
        floors: '41-50',
        themeColor: '#4a2d5a',
        floorColor: '#1a1a2a',
        wallColor: '#3a2a4a',
        accentColor: '#6a4a8a',
        enemies: ['abomination', 'lich', 'specter', 'void_wraith'],
        eliteTypes: ['void_herald', 'soul_harvester'],
        boss: { id: 'void_overlord', name: '虚空君主', floor: 50 },
        shopTypes: ['rare_gear', 'void_materials', 'mythic'],
        events: ['random_enemy', 'chest', 'void_trap', 'dimension_rift'],
        music: 'void_theme',
        difficulty: 3.0,
        dropTable: {
            common: ['void_shard', 'dark_essence'],
            uncommon: ['soul_essence', 'void_crystal'],
            rare: ['rune_heart_shard', 'void_armor']
        }
    }
};

class BiomeManager {
    constructor(game) {
        this.game = game;
        this.biomes = BIOME_DATA;
        this.currentBiome = null;
    }
    
    getBiomeForFloor(floor) {
        if (floor <= 10) return this.biomes.forest;
        if (floor <= 20) return this.biomes.desert;
        if (floor <= 30) return this.biomes.ice;
        if (floor <= 40) return this.biomes.fire;
        return this.biomes.void;
    }
    
    getBiomeName(floor) {
        return this.getBiomeForFloor(floor)?.name || '未知区域';
    }
    
    getBiomeTheme(floor) {
        return this.getBiomeForFloor(floor)?.themeColor || '#333333';
    }
    
    getDifficulty(floor) {
        return this.getBiomeForFloor(floor)?.difficulty || 1.0;
    }
    
    getEnemyTypes(floor) {
        return this.getBiomeForFloor(floor)?.enemies || [];
    }
    
    getBossForFloor(floor) {
        const biome = this.getBiomeForFloor(floor);
        return biome?.boss || null;
    }
    
    isBossFloor(floor) {
        const biome = this.getBiomeForFloor(floor);
        return biome?.boss?.floor === floor;
    }
    
    getDropTable(floor, rarity) {
        const biome = this.getBiomeForFloor(floor);
        if (!biome?.dropTable) return [];
        return biome.dropTable[rarity] || [];
    }
    
    getRandomDrop(floor) {
        const biome = this.getBiomeForFloor(floor);
        if (!biome?.dropTable) return null;
        
        const roll = Math.random();
        let rarity;
        if (roll < 0.7) rarity = 'common';
        else if (roll < 0.9) rarity = 'uncommon';
        else rarity = 'rare';
        
        const drops = biome.dropTable[rarity];
        if (!drops || drops.length === 0) return null;
        
        return drops[Math.floor(Math.random() * drops.length)];
    }
    
    getBiomeDescription(floor) {
        return this.getBiomeForFloor(floor)?.description || '';
    }
    
    getAllBiomes() {
        return Object.values(this.biomes);
    }
    
    getBiomeProgress(currentFloor) {
        const result = [];
        for (const biome of Object.values(this.biomes)) {
            const [start, end] = biome.floors.split('-').map(Number);
            const completed = currentFloor > end;
            const inProgress = currentFloor >= start && currentFloor <= end;
            result.push({
                id: biome.id,
                name: biome.name,
                floors: biome.floors,
                completed,
                inProgress,
                progress: inProgress ? Math.min(100, Math.floor((currentFloor - start) / (end - start + 1) * 100)) : 0
            });
        }
        return result;
    }
}

export { BiomeManager, BIOME_DATA };

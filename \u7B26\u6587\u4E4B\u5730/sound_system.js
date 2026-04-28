/**
 * 符文之地 - 声音系统
 */

class SoundManager {
    constructor() {
        this.audioContext = null;
        this.masterVolume = 1.0;
        this.musicVolume = 0.5;
        this.sfxVolume = 0.7;
        this.musicEnabled = true;
        this.sfxEnabled = true;
        this.currentMusic = null;
        this.musicGain = null;
        this.sounds = {};
        this.buffers = {};
    }
    
    init() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // 创建增益节点
            this.masterGain = this.audioContext.createGain();
            this.masterGain.connect(this.audioContext.destination);
            
            this.musicGain = this.audioContext.createGain();
            this.musicGain.connect(this.masterGain);
            this.musicGain.gain.value = this.musicVolume;
            
            this.sfxGain = this.audioContext.createGain();
            this.sfxGain.connect(this.masterGain);
            this.sfxGain.gain.value = this.sfxVolume;
            
            console.log('[Sound] 音频系统初始化完成');
        } catch (e) {
            console.warn('[Sound] 音频系统初始化失败:', e);
        }
    }
    
    setMasterVolume(volume) {
        this.masterVolume = Math.max(0, Math.min(1, volume));
        this.masterGain.gain.value = this.masterVolume;
    }
    
    setMusicVolume(volume) {
        this.musicVolume = Math.max(0, Math.min(1, volume));
        this.musicGain.gain.value = this.musicVolume;
    }
    
    setSfxVolume(volume) {
        this.sfxVolume = Math.max(0, Math.min(1, volume));
        this.sfxGain.gain.value = this.sfxVolume;
    }
    
    playMusic(name, loop = true) {
        if (!this.musicEnabled || !this.audioContext) return;
        
        // 停止当前音乐
        if (this.currentMusic) {
            this.currentMusic.stop();
        }
        
        // 生成简单的音乐
        this.generateMusic(name, loop);
    }
    
    generateMusic(name, loop) {
        const ctx = this.audioContext;
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.value = this.getMusicFrequency(name);
        
        gainNode.gain.value = 0.1;
        
        oscillator.connect(gainNode);
        gainNode.connect(this.musicGain);
        
        oscillator.start();
        
        this.currentMusic = {
            stop: () => {
                oscillator.stop();
            },
            setVolume: (v) => {
                gainNode.gain.value = v;
            }
        };
    }
    
    getMusicFrequency(name) {
        const frequencies = {
            title: 220,
            forest: 330,
            desert: 440,
            ice: 370,
            fire: 495,
            void: 185,
            combat: 440,
            boss: 220,
            victory: 523,
            gameover: 147
        };
        return frequencies[name] || 440;
    }
    
    play(soundName) {
        if (!this.sfxEnabled || !this.audioContext) return;
        
        const ctx = this.audioContext;
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        oscillator.type = this.getSoundType(soundName);
        oscillator.frequency.value = this.getSoundFrequency(soundName);
        
        gainNode.gain.value = 0.2;
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        
        oscillator.connect(gainNode);
        gainNode.connect(this.sfxGain);
        
        oscillator.start();
        oscillator.stop(ctx.currentTime + 0.3);
    }
    
    getSoundType(name) {
        if (name.includes('hit') || name.includes('attack')) return 'sawtooth';
        if (name.includes('magic') || name.includes('skill')) return 'triangle';
        return 'sine';
    }
    
    getSoundFrequency(name) {
        const frequencies = {
            attack: 200,
            hit: 150,
            critical: 300,
            death: 100,
            levelup: 523,
            item: 660,
            gold: 880,
            skill: 440,
            buy: 550,
            sell: 440,
            notify: 660,
            combo: 770,
            achievement: 880
        };
        
        for (const key of Object.keys(frequencies)) {
            if (name.includes(key)) return frequencies[key];
        }
        
        return 440;
    }
    
    playBackgroundAmbience(biome) {
        // 环境音
    }
    
    stopMusic() {
        if (this.currentMusic) {
            this.currentMusic.stop();
            this.currentMusic = null;
        }
    }
    
    resume() {
        if (this.audioContext?.state === 'suspended') {
            this.audioContext.resume();
        }
    }
    
    suspend() {
        if (this.audioContext?.state === 'running') {
            this.audioContext.suspend();
        }
    }
}

export { SoundManager };

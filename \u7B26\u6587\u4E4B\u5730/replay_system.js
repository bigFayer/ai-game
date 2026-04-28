/**
 * 符文之地 - 回放系统
 */

class ReplayRecorder {
    constructor(game) {
        this.game = game;
        this.recording = false;
        this.frames = [];
        this.frameIndex = 0;
        this.startTime = 0;
        this.maxFrames = 100000;
        this.compressionEnabled = true;
        
        this.gameStateFrames = [];
        this.actionFrames = [];
    }
    
    startRecording() {
        if (this.recording) return;
        
        this.recording = true;
        this.frames = [];
        this.gameStateFrames = [];
        this.actionFrames = [];
        this.frameIndex = 0;
        this.startTime = Date.now();
        
        // 记录初始状态
        this.recordInitialState();
        
        console.log('[Replay] 开始录制');
    }
    
    stopRecording() {
        if (!this.recording) return;
        
        this.recording = false;
        const duration = Date.now() - this.startTime;
        
        console.log(`[Replay] 停止录制，时长: ${(duration / 1000).toFixed(1)}秒，帧数: ${this.frames.length}`);
        
        return this.getReplayData();
    }
    
    recordInitialState() {
        const state = {
            player: this.game.player?.getSaveData?.() || null,
            dungeon: this.game.currentDungeon,
            floor: this.game.currentFloor,
            biome: this.game.currentBiome,
            settings: this.game.settings
        };
        
        this.gameStateFrames.push({ index: 0, state });
    }
    
    recordFrame() {
        if (!this.recording) return;
        
        // 记录游戏状态（每隔几帧）
        if (this.frameIndex % 10 === 0) {
            this.recordGameState();
        }
        
        // 记录输入动作
        this.recordActions();
        
        this.frameIndex++;
        
        if (this.frames.length >= this.maxFrames) {
            console.warn('[Replay] 达到最大帧数限制');
            return this.stopRecording();
        }
    }
    
    recordGameState() {
        const state = {
            player: {
                x: this.game.player?.x,
                y: this.game.player?.y,
                hp: this.game.player?.hp,
                mp: this.game.player?.mp,
                state: this.game.player?.state
            },
            enemies: this.game.enemies?.map(e => ({
                id: e.id,
                x: e.x,
                y: e.y,
                hp: e.hp,
                state: e.state
            })),
            floor: this.game.currentFloor
        };
        
        this.gameStateFrames.push({ index: this.frameIndex, state });
    }
    
    recordActions() {
        // 记录玩家输入
        const actions = this.game.inputManager?.getRecentActions?.();
        if (actions && actions.length > 0) {
            this.actionFrames.push({
                index: this.frameIndex,
                actions,
                timestamp: Date.now() - this.startTime
            });
        }
    }
    
    getReplayData() {
        return {
            version: '1.0',
            game: '符文之地',
            recordedAt: new Date().toISOString(),
            duration: Date.now() - this.startTime,
            totalFrames: this.frameIndex,
            gameStateFrames: this.compressionEnabled ? this.compressStates() : this.gameStateFrames,
            actionFrames: this.compressionEnabled ? this.compressActions() : this.actionFrames,
            metadata: {
                floor: this.game.currentFloor,
                playerClass: this.game.player?.characterClass,
                seed: this.game.seed
            }
        };
    }
    
    compressStates() {
        // 简单的差分压缩
        const compressed = [];
        let lastState = null;
        
        for (const frame of this.gameStateFrames) {
            const diff = this.diffState(lastState, frame.state);
            compressed.push({ index: frame.index, state: diff });
            lastState = frame.state;
        }
        
        return compressed;
    }
    
    compressActions() {
        // 只保留关键动作
        const keyActions = this.actionFrames.filter(f => f.actions.some(a => a.type === 'attack' || a.type === 'skill'));
        return keyActions;
    }
    
    diffState(oldState, newState) {
        if (!oldState) return newState;
        
        const diff = {};
        
        for (const key of Object.keys(newState)) {
            if (JSON.stringify(oldState[key]) !== JSON.stringify(newState[key])) {
                diff[key] = newState[key];
            }
        }
        
        return diff;
    }
}

class ReplayPlayer {
    constructor(game, replayData) {
        this.game = game;
        this.replayData = replayData;
        this.playing = false;
        this.paused = false;
        this.frameIndex = 0;
        this.playbackSpeed = 1.0;
        this.stateIndex = 0;
        this.actionIndex = 0;
    }
    
    play() {
        if (this.playing) return;
        
        this.playing = true;
        this.paused = false;
        
        console.log('[Replay] 开始播放');
    }
    
    pause() {
        this.paused = true;
    }
    
    resume() {
        this.paused = false;
    }
    
    stop() {
        this.playing = false;
        this.paused = false;
        this.frameIndex = 0;
        
        console.log('[Replay] 停止播放');
    }
    
    seekTo(frameIndex) {
        this.frameIndex = Math.max(0, Math.min(frameIndex, this.replayData.totalFrames));
        
        // 找到对应的状态
        while (this.stateIndex < this.replayData.gameStateFrames.length - 1 &&
               this.replayData.gameStateFrames[this.stateIndex + 1].index <= this.frameIndex) {
            this.stateIndex++;
        }
    }
    
    update(dt) {
        if (!this.playing || this.paused) return;
        
        this.frameIndex += dt * 60 * this.playbackSpeed;
        
        // 检查是否播放完毕
        if (this.frameIndex >= this.replayData.totalFrames) {
            this.stop();
            return;
        }
        
        // 应用游戏状态
        this.applyState();
        
        // 执行动作
        this.applyActions();
    }
    
    applyState() {
        // 找到当前帧对应的状态
        while (this.stateIndex < this.replayData.gameStateFrames.length - 1 &&
               this.replayData.gameStateFrames[this.stateIndex + 1].index <= this.frameIndex) {
            this.stateIndex++;
        }
        
        if (this.stateIndex < this.replayData.gameStateFrames.length) {
            const frame = this.replayData.gameStateFrames[this.stateIndex];
            this.reconstructState(frame.state);
        }
    }
    
    applyActions() {
        while (this.actionIndex < this.replayData.actionFrames.length &&
               this.replayData.actionFrames[this.actionIndex].index <= this.frameIndex) {
            const frame = this.replayData.actionFrames[this.actionIndex];
            // 重放动作
            this.replayAction(frame.actions);
            this.actionIndex++;
        }
    }
    
    reconstructState(state) {
        // 重建游戏状态
        if (state.player) {
            if (this.game.player) {
                Object.assign(this.game.player, state.player);
            }
        }
        
        if (state.enemies) {
            for (const enemyState of state.enemies) {
                const enemy = this.game.enemies.find(e => e.id === enemyState.id);
                if (enemy) {
                    enemy.x = enemyState.x;
                    enemy.y = enemyState.y;
                    enemy.hp = enemyState.hp;
                    enemy.state = enemyState.state;
                }
            }
        }
        
        if (state.floor !== undefined) {
            this.game.currentFloor = state.floor;
        }
    }
    
    replayAction(actions) {
        // 重放动作
        for (const action of actions) {
            switch (action.type) {
                case 'move':
                    this.game.player?.move(action.x, action.y);
                    break;
                case 'attack':
                    // 播放攻击动画
                    break;
                case 'skill':
                    // 播放技能
                    break;
            }
        }
    }
    
    setPlaybackSpeed(speed) {
        this.playbackSpeed = Math.max(0.25, Math.min(4.0, speed));
    }
    
    getProgress() {
        return this.frameIndex / this.replayData.totalFrames;
    }
    
    getCurrentTime() {
        const duration = this.replayData.duration;
        return (this.frameIndex / this.replayData.totalFrames) * duration;
    }
}

export { ReplayRecorder, ReplayPlayer };

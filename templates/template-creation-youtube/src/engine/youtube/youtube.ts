/// <reference path="../types/sdk.d.ts" />

declare global {
    interface Window {
        ytgame: typeof ytgame;
    }
}

interface YouTubePlayablesConfig {
    onStart?: () => void;
    onPause?: () => void;
    onResume?: () => void;
    onMute?: () => void;
    onUnmute?: () => void;
    onSaveData?: (data: unknown) => void;
    onLoadData?: () => unknown;
    onSubmitScore?: (score: number) => void;
    onGetScore?: () => number;
}

/** YouTube Playables SDK integration */
export class YouTube {
    public currentScore = 0;
    private config: YouTubePlayablesConfig;

    constructor(config: YouTubePlayablesConfig = {}) {
        this.config = config;
        this.init();
    }

    private init(): void {
        // Initialize YouTube Playables SDK listeners
        if (!window.ytgame) {
            console.warn('YouTube Playables SDK not found. Make sure to include it in your index.html');
            return;
        }

        this.setupEventListeners();
    }

    private setupEventListeners(): void {
        const ytgame = window.ytgame;
        if (!ytgame) return;

        // Setup pause/resume handlers
        ytgame.system.onPause(() => {
            this.config.onPause?.();
        });

        ytgame.system.onResume(() => {
            this.config.onResume?.();
        });

        // Setup audio handlers
        ytgame.system.onAudioEnabledChange((enabled) => {
            if (enabled) {
                this.config.onUnmute?.();
            } else {
                this.config.onMute?.();
            }
        });
    }

    /** Signal first frame ready - call this when you can show a loading screen */
    public firstFrameReady(): void {
        const ytgame = window.ytgame;
        if (ytgame) {
            ytgame.game.firstFrameReady();
        }
    }

    /** Signal game ready - call this after all assets are loaded and game can start */
    public ready(): void {
        const ytgame = window.ytgame;
        if (ytgame) {
            ytgame.game.gameReady();
        }
    }

    /** Start the game */
    public start(): void {
        const ytgame = window.ytgame;
        if (ytgame) {
            this.config.onStart?.();
        }
    }

    /** Pause the game */
    public pause(): void {
        const ytgame = window.ytgame;
        if (ytgame) {
            this.config.onPause?.();
        }
    }

    /** Resume the game */
    public resume(): void {
        const ytgame = window.ytgame;
        if (ytgame) {
            this.config.onResume?.();
        }
    }

    /** Mute game audio */
    public mute(): void {
        const ytgame = window.ytgame;
        if (ytgame) {
            this.config.onMute?.();
        }
    }

    /** Unmute game audio */
    public unmute(): void {
        const ytgame = window.ytgame;
        if (ytgame) {
            this.config.onUnmute?.();
        }
    }

    /** Save game data */
    public async saveData(data: unknown): Promise<void> {
        const ytgame = window.ytgame;
        if (ytgame) {
            if (this.config.onSaveData) {
                this.config.onSaveData(data);
            }
            const jsonString = JSON.stringify(data);
            await ytgame.game.saveData(jsonString);
        }
    }

    /** Load game data */
    public async loadData(): Promise<unknown> {
        const ytgame = window.ytgame;
        if (ytgame) {
            if (this.config.onLoadData) {
                return this.config.onLoadData();
            }
            const jsonString = await ytgame.game.loadData();
            return jsonString ? JSON.parse(jsonString) : null;
        }
        return null;
    }

    /** Submit a score */
    public async submitScore(score: number): Promise<void> {
        const ytgame = window.ytgame;
        if (ytgame) {
            // Update current score
            this.currentScore = score;
            
            // Save score to persistent storage
            await this.saveData({ score });

            // Notify callback if provided
            if (this.config.onSubmitScore) {
                this.config.onSubmitScore(score);
            }

            // Submit to YouTube
            await ytgame.engagement.sendScore({ value: score });
        }
    }

    /** Get the player's score */
    public async getScore(): Promise<number> {
        const ytgame = window.ytgame;
        if (ytgame) {
            // Try to get score from callback first
            if (this.config.onGetScore) {
                return this.config.onGetScore();
            }

            // Try to load score from storage
            const data = await this.loadData();
            if (data && typeof data === 'object' && 'score' in data) {
                this.currentScore = (data as { score: number }).score;
            }

            return this.currentScore;
        }
        return 0;
    }
}

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
        
        // Signal first frame ready
        window.ytgame.game.firstFrameReady();
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

    /** Ready the game */
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
            if (this.config.onSubmitScore) {
                this.config.onSubmitScore(score);
            }
            await ytgame.engagement.sendScore({ value: score });
        }
    }

    /** Get the player's score */
    public async getScore(): Promise<number> {
        // Note: There is no direct getScore method in the SDK
        // We'll return the callback value if provided
        const ytgame = window.ytgame;
        if (ytgame && this.config.onGetScore) {
            return this.config.onGetScore();
        }
        return 0;
    }
}

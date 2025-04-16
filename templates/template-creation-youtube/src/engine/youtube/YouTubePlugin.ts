import { sound } from '@pixi/sound';
import { ExtensionType } from 'pixi.js';
import type { Application, ExtensionMetadata } from 'pixi.js';

import type { CreationEngine } from '../engine';

import { YouTube } from './youtube';

declare module 'pixi.js' {
    interface Application {
        youtube: YouTube;
    }
}

/**
 * Middleware for Application's YouTube Playables SDK functionality.
 *
 * Adds the following to Application:
 * * Application#youtube
 */
export class YouTubePlugin {
    /** @ignore */
    public static extension: ExtensionMetadata = ExtensionType.Application;

    /**
     * Initialize the plugin with scope of application instance
     */
    public static init(): void {
        const app = this as unknown as CreationEngine;

        // Create and attach the YouTube instance with audio handlers
        app.youtube = new YouTube({
            onMute: () => sound.muteAll(),
            onUnmute: () => sound.unmuteAll(),
            onPause: () => sound.pauseAll(),
            onResume: () => sound.resumeAll(),
        });
    }

    /**
     * Clean up resources, scoped to application
     */
    public static destroy(): void {
        const app = this as unknown as Application;
        app.youtube = null as unknown as YouTube;
    }
}

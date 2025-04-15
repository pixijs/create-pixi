import { Application, ExtensionMetadata, ExtensionType } from 'pixi.js';
import { YouTube } from './youtube';

declare module 'pixi.js' {
    interface Application {
        youtube: YouTube;
    }
}

/** Plugin that adds YouTube Playables SDK support to the CreationEngine */
export class YouTubePlugin {
    public static extension: ExtensionMetadata = ExtensionType.Application;

    constructor(app: Application) {
        // Create and attach the YouTube instance
        const youtube = new YouTube();
        (app as any).youtube = youtube;
    }

    public destroy(app: Application): void {
        // Cleanup any resources
        (app as any).youtube = null;
    }
}

# PixiJS YouTube Playables Template

This template provides a starting point for creating YouTube Playable games using PixiJS. It includes the YouTube Playables SDK integration and a convenient plugin system to handle all YouTube-specific functionality.

## Features

- Full YouTube Playables SDK integration
- Built-in plugin for handling YouTube game lifecycle
- TypeScript support
- Asset management system
- Audio support with automatic pause/resume
- Responsive design

## Getting Started

1. Create a new project using this template:
```bash
npm create pixi@latest
```
2. Name your project and choose the "Youtube" template under "Creation Templates"

3. Then simply run:
```bash
  cd <PROJECT_NAME>
  npm install
  npm run dev
```

4. Test your game in the YouTube SDK Test Suite:
   - Go to [YouTube Playables Test Suite](https://developers.google.com/youtube/gaming/playables/test_suite)
   - Enter `http://localhost:8080` as the Game URL
   - Test your game's integration with the YouTube SDK

## User Settings & Persistence

This template saves user settings and game state **persistently** using the official YouTube Playables API (`ytgame.game.saveData`/`loadData`) when running in the Playables environment, and falls back to `localStorage` for local development/testing.

All settings are stored as a single JSON object. The provided `StorageWrapper` class exposes an async API for getting and setting values of various types:

```typescript
// Get/set a string value
await storage.setString('username', 'Alice');
const username = await storage.getString('username');

// Get/set a number value
await storage.setNumber('highScore', 12345);
const score = await storage.getNumber('highScore');

// Get/set a boolean value
await storage.setBool('musicEnabled', true);
const musicEnabled = await storage.getBool('musicEnabled');

// Get/set an object
await storage.setObject('settings', { volume: 0.5, theme: 'dark' });
const settings = await storage.getObject<{ volume: number; theme: string }>('settings');
```

### How it works
- In YouTube Playables: Uses `ytgame.game.saveData` and `ytgame.game.loadData` for persistence.
- Locally: Falls back to `localStorage` using a single key (`user_settings`).
- All storage APIs are **async** and should be awaited.

### Example: Saving and Loading User Settings
```typescript
// Save settings
await storage.setObject('user', { masterVolume: 0.8, sfxVolume: 0.5 });

// Load settings
const userSettings = await storage.getObject<{ masterVolume: number; sfxVolume: number }>('user');
```

## YouTube Plugin Usage

The template includes a `YouTubePlugin` for Playables-specific features:

```typescript
import { engine } from "../../getEngine";

// The plugin is automatically initialized with the engine

const currentScore = await engine().youtube.getScore();

if (add) {
    this.score += 1;
} else if (this.score > 0) {
    this.score -= 1;
}

// Update display
this.updateScoreDisplay();

// Submit to YouTube
await engine().youtube.submitScore(currentScore);
```

## Project Structure

- `src/engine/youtube/YouTubePlugin.ts` - YouTube integration plugin
- `src/app/screens/` - Game screens (LoadScreen, MainScreen)
- `src/app/ui/` - UI components
- `src/app/popups/` - Popup components
- `raw-assets/` - Source assets
- `public/` - Static assets and styles


## YouTube Playables Requirements

Make sure your game follows YouTube's requirements:

1. SDK loaded before any game code
2. Initial bundle < 15 MiB
3. firstFrameReady called before gameReady
4. gameReady called
5. Cloud save data < 3 MiB
6. JS heap size < 512 MiB

## Documentation

- [YouTube Playables SDK Documentation](https://developers.google.com/youtube/gaming/playables/reference/sdk)
- [PixiJS Documentation](https://pixijs.com/docs)


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
npm create pixi@latest my-youtube-game -- --template creation-youtube
```

2. Install dependencies:
```bash
cd my-youtube-game
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Test your game in the YouTube SDK Test Suite:
   - Go to [YouTube Playables Test Suite](https://developers.google.com/youtube/gaming/playables/test_suite)
   - Enter `http://localhost:8080` as the Game URL
   - Test your game's integration with the YouTube SDK

## YouTube Plugin Usage

The template includes a `YouTubePlugin` that provides easy access to YouTube Playables SDK functionality:

```typescript
// The plugin is automatically initialized with the CreationEngine
const app = new CreationEngine();
await app.init();

// Start the game
app.youtube.start();

// Save game data
await app.youtube.saveData({ score: 100, level: 5 });

// Load game data
const data = await app.youtube.loadData();

// Submit a score
await app.youtube.submitScore(100);

// Get the player's score
const score = await app.youtube.getScore();

// Handle mute/unmute
app.youtube.mute();
app.youtube.unmute();
```

## Project Structure

- `src/engine/youtube/YouTubePlugin.ts` - YouTube integration plugin
- `src/app/screens/` - Game screens (LoadScreen, MainScreen)
- `src/app/ui/` - UI components
- `src/app/popups/` - Popup components
- `raw-assets/` - Source assets
- `public/` - Static assets and styles

## Building for Production

1. Build your game:
```bash
npm run build
```

2. Test the production build:
```bash
npm run preview
```

3. Deploy the contents of the `dist` directory to your hosting provider

## YouTube Playables Requirements

Make sure your game follows YouTube's requirements:

1. Must respond to pause/resume events
2. Must support mute/unmute functionality
3. Should save and restore game state
4. Must work in the YouTube player iframe
5. Should adapt to different screen sizes

## Documentation

- [YouTube Playables SDK Documentation](https://developers.google.com/youtube/gaming/playables/reference/sdk)
- [PixiJS Documentation](https://pixijs.com/docs)

## License

This template is MIT licensed.

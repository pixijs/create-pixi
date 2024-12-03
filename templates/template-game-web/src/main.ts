import { GameEngine } from "./engine/engine";
import { setEngine } from "./game/getEngine";
import { GameScreen } from "./game/screens/game/GameScreen";
import { LoadScreen } from "./game/screens/LoadScreen";
import { userSettings } from "./game/utils/userSettings";

/**
 * Importing these modules will automatically register there plugins with the engine.
 */
import "@esotericsoftware/spine-pixi-v8";
import "@pixi/sound";

// Create a new game engine instance
const engine = new GameEngine();
setEngine(engine);

(async () => {
  // Initialize the game engine instance
  await engine.init({
    background: "#1E1E1E",
    resizeOptions: { minWidth: 768, minHeight: 1024, letterbox: false },
  });

  // Initialize the user settings
  userSettings.init();

  // Show the load screen
  await engine.navigation.showScreen(LoadScreen);
  // Show the game screen once the load screen is dismissed
  await engine.navigation.showScreen(GameScreen);
})();

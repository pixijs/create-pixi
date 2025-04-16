import { FancyButton } from "@pixi/ui";
import { animate } from "motion";
import type { AnimationPlaybackControls } from "motion/react";
import type { Ticker } from "pixi.js";
import { Color, Container, FillGradient, Text, TextStyle } from "pixi.js";

import { engine } from "../../getEngine";
import { PausePopup } from "../../popups/PausePopup";
import { SettingsPopup } from "../../popups/SettingsPopup";
import { Button } from "../../ui/Button";

import { Bouncer } from "./Bouncer";

/** The screen that holds the app */
export class MainScreen extends Container {
  /** Assets bundles required by this screen */
  public static assetBundles = ["main"];

  public mainContainer: Container;
  private pauseButton: FancyButton;
  private settingsButton: FancyButton;
  private addButton: FancyButton;
  private removeButton: FancyButton;
  private bouncer: Bouncer;
  private scoreText: Text;
  private score: number = 0;
  private paused = false;

  constructor() {
    super();

    this.mainContainer = new Container();
    this.addChild(this.mainContainer);
    this.bouncer = new Bouncer();
    
    // Load saved score
    this.prepare();

    const buttonAnimations = {
      hover: {
        props: {
          scale: { x: 1.1, y: 1.1 },
        },
        duration: 100,
      },
      pressed: {
        props: {
          scale: { x: 0.9, y: 0.9 },
        },
        duration: 100,
      },
    };

    // Create gradient fill
    const fill = new FillGradient(0, 0, 0, 10);

    const colors = [0xffffff, 0x00ff99].map((color) => Color.shared.setValue(color).toNumber());

    colors.forEach((number, index) =>
    {
        const ratio = index / colors.length;

        fill.addColorStop(ratio, number);
    });

    const style = new TextStyle({
      fontFamily: 'Arial',
      fontSize: 36,
      fontStyle: 'italic',
      fontWeight: 'bold',
      fill: { fill },
      stroke: { color: '#4a1850', width: 5, join: 'round' },
      dropShadow: {
          color: '#000000',
          blur: 4,
          angle: Math.PI / 6,
          distance: 6,
      },
      wordWrap: true,
      wordWrapWidth: 440,
  });
    this.pauseButton = new FancyButton({
      defaultView: "icon-pause.png",
      anchor: 0.5,
      animations: buttonAnimations,
    });
    this.pauseButton.onPress.connect(() =>
      engine().navigation.presentPopup(PausePopup),
    );
    this.addChild(this.pauseButton);

    this.settingsButton = new FancyButton({
      defaultView: "icon-settings.png",
      anchor: 0.5,
      animations: buttonAnimations,
    });
    this.settingsButton.onPress.connect(() =>
      engine().navigation.presentPopup(SettingsPopup),
    );
    this.addChild(this.settingsButton);

    this.addButton = new Button({
      text: "Add",
      width: 175,
      height: 110,
    });
    this.addButton.onPress.connect(() => {
      this.bouncer.add();
      this.updateScore(true);
    });
    this.addChild(this.addButton);

    this.removeButton = new Button({
      text: "Remove",
      width: 175,
      height: 110,
    });
    this.removeButton.onPress.connect(() => {
      this.bouncer.remove();
      this.updateScore(false);
    });
    this.addChild(this.removeButton);

    this.scoreText = new Text({ 
      anchor: 0.5,
      text: `Score: 0`,
      style,
    });

    this.addChild(this.scoreText);
    console.log(window.ytgame?.SDK_VERSION);
  }

  /** Prepare the screen just before showing */
  public async prepare() {
    // Initialize score
    engine().youtube.currentScore = Bouncer.LOGO_COUNT;

    // Load saved score when screen is shown
    await this.loadScore();
  }

  /** Update the screen */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public update(_time: Ticker) {
    if (this.paused) return;
    this.bouncer.update();
  }

  /** Pause gameplay - automatically fired when a popup is presented */
  public async pause() {
    this.mainContainer.interactiveChildren = false;
    this.paused = true;
  }

  /** Resume gameplay */
  public async resume() {
    this.mainContainer.interactiveChildren = true;
    this.paused = false;
  }

  /** Load saved score from YouTube */
  private async loadScore() {
    const savedScore = await engine().youtube.getScore();
    this.score = savedScore;
    this.updateScoreDisplay();
  }

  /** Update the score */
  public async updateScore(add: boolean) {
    // Get score from bouncer
    if (add) {
      this.score += 1;
    } else if (this.score > 0) {
      this.score -= 1;
    }
    
    // Update display
    this.updateScoreDisplay();

    // Submit to YouTube
    await engine().youtube.submitScore(this.score);
  }

  /** Update score display */
  private updateScoreDisplay() {
    this.scoreText.text = `Score: ${this.score}`;
  }

  /** Fully reset */
  public async reset() {
    this.score = Bouncer.LOGO_COUNT;
    this.updateScoreDisplay();
    await engine().youtube.submitScore(this.score);
  }

  /** Resize the screen, fired whenever window size changes */
  public resize(width: number, height: number) {
    const centerX = width * 0.5;
    const centerY = height * 0.5;

    this.mainContainer.x = centerX;
    this.mainContainer.y = centerY;
    this.pauseButton.x = 30;
    this.pauseButton.y = 30;
    this.settingsButton.x = width - 30;
    this.settingsButton.y = 30;
    this.removeButton.x = width / 2 - 100;
    this.removeButton.y = height - 75;
    this.addButton.x = width / 2 + 100;
    this.addButton.y = height - 75;
    this.scoreText.x = width / 2;
    this.scoreText.y = 100;

    this.bouncer.resize(width, height);
  }

  /** Show screen with animations */
  public async show(): Promise<void> {
    engine().audio.bgm.play("main/sounds/bgm-main.mp3", { volume: 0.5 });

    const elementsToAnimate = [
      this.pauseButton,
      this.settingsButton,
      this.addButton,
      this.removeButton,
    ];

    let finalPromise!: AnimationPlaybackControls;
    for (const element of elementsToAnimate) {
      element.alpha = 0;
      finalPromise = animate(
        element,
        { alpha: 1 },
        { duration: 0.3, delay: 0.75, ease: "backOut" },
      );
    }

    await finalPromise;
    this.bouncer.show(this);
  }

  /** Hide screen with animations */
  public async hide() {}

  /** Auto pause the app when window go out of focus */
  public blur() {
    if (!engine().navigation.currentPopup) {
      engine().navigation.presentPopup(PausePopup);
    }
  }
}

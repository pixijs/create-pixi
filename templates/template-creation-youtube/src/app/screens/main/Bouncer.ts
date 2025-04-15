import { animate } from "motion";

import { randomFloat } from "../../../engine/utils/random";
import { waitFor } from "../../../engine/utils/waitFor";

import { DIRECTION, Logo } from "./Logo";
import type { MainScreen } from "./MainScreen";

export class Bouncer {
  private static readonly LOGO_COUNT = 3;
  private static readonly ANIMATION_DURATION = 1;
  private static readonly WAIT_DURATION = 0.5;

  public screen!: MainScreen;

  private allLogoArray: Logo[] = [];
  private activeLogoArray: Logo[] = [];
  private yMin = -400;
  private yMax = 400;
  private xMin = -400;
  private xMax = 400;

  public async show(screen: MainScreen): Promise<void> {
    this.screen = screen;
    for (let i = 0; i < Bouncer.LOGO_COUNT; i++) {
      this.add();
      await waitFor(Bouncer.WAIT_DURATION);
    }
  }

  public add(): void {
    const width = randomFloat(this.xMin, this.xMax);
    const height = randomFloat(this.yMin, this.yMax);
    const logo = new Logo();

    logo.alpha = 0;
    logo.position.set(width, height);
    animate(logo, { alpha: 1 }, { duration: Bouncer.ANIMATION_DURATION });
    this.screen.mainContainer.addChild(logo);
    this.allLogoArray.push(logo);
    this.activeLogoArray.push(logo);
  }

  public remove(): void {
    const logo = this.activeLogoArray.pop();
    if (logo) {
      animate(logo, { alpha: 0 }, { duration: Bouncer.ANIMATION_DURATION })
        .then(() => {
          this.screen.mainContainer.removeChild(logo);
          const index = this.allLogoArray.indexOf(logo);
          if (index !== -1) this.allLogoArray.splice(index, 1);
        })
        .catch((error) => {
          console.error("Error during logo removal animation:", error);
        });
    }
  }

  public update(): void {
    this.allLogoArray.forEach((entity) => {
      this.setDirection(entity);
      this.setLimits(entity);
    });
  }

  private setDirection(logo: Logo): void {
    switch (logo.direction) {
      case DIRECTION.NE:
        logo.x += logo.speed;
        logo.y -= logo.speed;
        break;
      case DIRECTION.NW:
        logo.x -= logo.speed;
        logo.y -= logo.speed;
        break;
      case DIRECTION.SE:
        logo.x += logo.speed;
        logo.y += logo.speed;
        break;
      case DIRECTION.SW:
        logo.x -= logo.speed;
        logo.y += logo.speed;
        break;
    }
  }

  private setLimits(logo: Logo): void {
    const { position, top, bottom, left, right } = logo;
    let { direction } = logo;

    if (position.y + top <= this.yMin) {
      direction = direction === DIRECTION.NW ? DIRECTION.SW : DIRECTION.SE;
    }
    if (position.y + bottom >= this.yMax) {
      direction = direction === DIRECTION.SE ? DIRECTION.NE : DIRECTION.NW;
    }
    if (position.x + left <= this.xMin) {
      direction = direction === DIRECTION.NW ? DIRECTION.NE : DIRECTION.SE;
    }
    if (position.x + right >= this.xMax) {
      direction = direction === DIRECTION.NE ? DIRECTION.NW : DIRECTION.SW;
    }

    logo.direction = direction;
  }

  public resize(w: number, h: number): void {
    this.xMin = -w / 2;
    this.xMax = w / 2;
    this.yMin = -h / 2;
    this.yMax = h / 2;
  }
}

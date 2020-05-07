import { LedMatrixInstance } from "rpi-led-matrix";
import { rgbToHex } from "../utils/rendering";
import { CollisionMap } from "./CollisionMap";
import TWEEN from "@tweenjs/tween.js"


type Tween = TWEEN.Tween;
const defaultColor = { r: 100, g: 100, b: 100 };

export class WallsRenderer {

  private tween: TWEEN.Tween | undefined;

  private color = { ...defaultColor };

  constructor(private collision: CollisionMap) {

  }

  render(matrix: LedMatrixInstance) {
    matrix.fgColor(rgbToHex(this.color.r, this.color.g, this.color.b));

    for (let y = 0; y < this.collision.rows.length; y++) {
      const row = this.collision.rows[y];
      for (let x = 0; x < row.length; x++) {
        const cell = row[x];
        if (cell)
          matrix.setPixel(x, y);
      }
    }
  }

  mrNibblesKilled() {
    if (this.tween) this.tween.stop();
    const components = { r: 100, g: 0, b: 0 };
    this.tween = new TWEEN.Tween(components)
      .to({ ...defaultColor }, 2000)
      .easing(TWEEN.Easing.Quadratic.Out)
      .onUpdate(() => this.color = { ...components })
      .onComplete(() => this.tween = undefined)
      .start();
  }

  spiderKilled() {
    if (this.tween) this.tween.stop();
    const components = { r: 100, g: 0, b: 100 };
    this.tween = new TWEEN.Tween(components)
      .to({ ...defaultColor }, 1000)
      .easing(TWEEN.Easing.Quadratic.Out)
      .onUpdate(() => this.color = { ...components })
      .onComplete(() => this.tween = undefined)
      .start();
  }

  nibbleCollected() {
    if (this.tween) return;
    const components = { r: 100, g: 120, b: 100 };
    this.tween = new TWEEN.Tween(components)
      .to({ ...defaultColor }, 100)
      .easing(TWEEN.Easing.Quadratic.Out)
      .onUpdate(() => this.color = { ...components })
      .onComplete(() => this.tween = undefined)
      .start();
  }

  mrNibblesEnterSuperMode() {
    if (this.tween) this.tween.stop();
    const components = { r: 50, g: 100, b: 50 };
    this.tween = new TWEEN.Tween(components)
      .to({ ...defaultColor }, 500)
      .easing(TWEEN.Easing.Quadratic.Out)
      .onUpdate(() => this.color = { ...components })
      .onComplete(() => this.tween = undefined)
      .repeat(Infinity)
      .yoyo(true)
      .start()
  }

  mrNibblesExitSuperMode() {
    if (this.tween) this.tween.stop();
  }


}
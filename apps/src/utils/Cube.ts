import { LedMatrixInstance } from "rpi-led-matrix";
import { CubeFace } from "./CubeFace";
import { narray } from "../../../src/utils/misc";
import { facesCount, faceWidth, faceHeight } from "./const";
import { Point2D } from "../maze/Point2D";



export class Cube {

  public readonly faces: CubeFace[];

  constructor(public readonly matrix: LedMatrixInstance) {
    this.faces = narray(facesCount).map((i) => new CubeFace(this, i));
  }

  animate(tickFn: (delta: number) => any, msPerFrame = 100) {
    let timeSinceLastFrame = 0;
    this.matrix.afterSync((mat, dt, t) => {
      timeSinceLastFrame += dt;
      if (timeSinceLastFrame > msPerFrame) {
        tickFn(timeSinceLastFrame);
        timeSinceLastFrame = 0;
      }

      // Defer sink to next tick
      setTimeout(() => {
        this.matrix.sync();
      }, 0);
    });
    this.matrix.sync();
  };

}
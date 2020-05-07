import { LedMatrixInstance } from "rpi-led-matrix";
import { multiplyColor } from "../utils/rendering";
import { Trail } from "./Trail";

export class TrailRenderer {

  constructor(public readonly trail: Trail, public readonly color: number) { }

  render(matrix: LedMatrixInstance) {
    const step = 1 / this.trail.maxLength;

    for (let i = 0; i < this.trail.segments.length; i++) {
      const color = multiplyColor(this.color, step * i);
      matrix.fgColor(color).setPixel(this.trail.segments[i].x, this.trail.segments[i].y);
    }
  }

}
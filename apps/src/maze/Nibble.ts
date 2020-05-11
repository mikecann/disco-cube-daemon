import { LedMatrixInstance } from "rpi-led-matrix";
import { Point2D } from "./Point2D";
import { rgbToHex } from "../utils/rendering";
import { Maze } from "./Maze";

export class Nibble {
  constructor(public position = Point2D.zero) {}

  update() {}

  render(matrix: LedMatrixInstance) {
    const color = rgbToHex(0, 50, 0);
    matrix.fgColor(color).setPixel(this.position.x, this.position.y);
  }
}

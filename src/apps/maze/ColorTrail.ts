import { LedMatrixInstance } from "rpi-led-matrix";
import { Point2D } from "./Point2D";
import { rgbToHex, multiplyColor } from "../../utils/rendering";
import { Maze } from "./Maze";



export class ColorTrail {

  private segments: Point2D[] = []

  constructor(private maze: Maze, public readonly color: number, public readonly maxLength = 10) { }

  addSegment(position: Point2D) {
    this.segments.push(position);
    if (this.segments.length > this.maxLength) this.segments.shift();
  }

  render(matrix: LedMatrixInstance) {

    const step = 1 / this.maxLength;

    for (let i = 0; i < this.segments.length; i++) {
      const color = multiplyColor(this.color, step * i);
      matrix.fgColor(color);
      this.maze.renderPixel(this.segments[i], matrix);
    }

  }

}
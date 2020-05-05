import { LedMatrixInstance } from "rpi-led-matrix";
import { Point2D } from "./Point2D";
import { Maze } from "./Maze";
import { multiplyColor } from "../utils/rendering";



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
      matrix.fgColor(color).setPixel(this.segments[i].x, this.segments[i].y);
    }

  }

  contains(segment: Point2D) {
    return this.segments.find(s => s.equals(segment))
  }

}
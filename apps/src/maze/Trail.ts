import { Point2D } from "./Point2D";

export class Trail {

  public readonly segments: Point2D[] = []

  constructor(public readonly maxLength = 10) { }

  addSegment(position: Point2D) {
    this.segments.push(position);
    if (this.segments.length > this.maxLength) this.segments.shift();
  }

  contains(segment: Point2D) {
    return this.segments.find(s => s.equals(segment))
  }

  getAge(segment: Point2D) {
    return this.segments.length - this.segments.findIndex(s => s.equals(segment))
  }
}
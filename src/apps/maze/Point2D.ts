

export class Point2D {
  constructor(public readonly x = 0, public readonly y = 0) { }

  public sum(p2: Point2D) {
    return new Point2D(this.x + p2.x, this.y + p2.y);
  }

  public toString() {
    return `${this.x}, ${this.y}`
  }

  public static zero = () => new Point2D();
  public static randomDirection = () => new Point2D(Math.random() < 0.5 ? -1 : 1, Math.random() < 0.5 ? -1 : 1);
}



export class Point2D {
  constructor(public readonly x = 0, public readonly y = 0) { }

  public sum(p2: Point2D) {
    return new Point2D(this.x + p2.x, this.y + p2.y);
  }

  public toString() {
    return `${this.x}, ${this.y}`
  }

  public equals(p2: Point2D) {
    return this.x == p2.x && this.y == p2.y;
  }

  public isOppositeDirectionTo(p2: Point2D) {
    if (this.x == -1 && p2.x == 1) return true;
    if (this.y == -1 && p2.y == 1) return true;
    if (this.x == 1 && p2.x == -1) return true;
    if (this.y == 1 && p2.y == -1) return true;
    return false;
  }

  public static readonly zero = new Point2D();
  public static readonly north = new Point2D(0, 1);
  public static readonly south = new Point2D(0, -1);
  public static readonly east = new Point2D(-1, 0);
  public static readonly west = new Point2D(1, 0);

  public static readonly directions: ReadonlyArray<Point2D> =
    [Point2D.north, Point2D.south, Point2D.east, Point2D.west]

  public static randomDirection = () => new Point2D(Math.random() < 0.5 ? -1 : 1, Math.random() < 0.5 ? -1 : 1);
}

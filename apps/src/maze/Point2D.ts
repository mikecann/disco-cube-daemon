import { randomOne } from "../../../src/utils/misc";


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

  public left() {
    if (this.equals(Point2D.north)) {
      return Point2D.west;
    }
    if (this.equals(Point2D.east)) {
      return Point2D.north;
    }
    if (this.equals(Point2D.south)) {
      return Point2D.east;
    }
    if (this.equals(Point2D.west)) {
      return Point2D.south;
    }
    throw new Error(`not a valid direction '${this}'`)
  }

  public static readonly zero = new Point2D();
  public static readonly north = new Point2D(0, 1);
  public static readonly south = new Point2D(0, -1);
  public static readonly east = new Point2D(1, 0);
  public static readonly west = new Point2D(-1, 0);

  public static readonly directions: Point2D[] =
    [Point2D.north, Point2D.south, Point2D.east, Point2D.west]

  public static randomDirection = () => randomOne(Point2D.directions);
}

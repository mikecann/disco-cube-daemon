import { Maze } from "./Maze";
import { Point2D } from "./Point2D";


export class CollisionMap {

  public readonly width: number;
  public readonly height: number;

  private collision: boolean[][];

  constructor(private maze: Maze) {

    this.height = 
    this.width = (maze.cellsWide * 2) + 1;

    this.collision = narray(this.collisionHeight).map(_ => narray(this.collisionWidth).map(__ => false));

    for (let y = 0; y < rows.length; y++) {
      const row = rows[y];
      for (let x = 0; x < row.length; x++) {
        const cell = row[x];

        const cellXInPixels = 1 + (x * 2);
        const cellYInPixels = 1 + (y * 2);

        if (cell.left) {
          this.collision[cellYInPixels - 1][cellXInPixels - 1] = true;
          this.collision[cellYInPixels - 0][cellXInPixels - 1] = true;
          this.collision[cellYInPixels + 1][cellXInPixels - 1] = true;
        }

        if (cell.right) {
          this.collision[cellYInPixels - 1][cellXInPixels + 1] = true;
          this.collision[cellYInPixels - 0][cellXInPixels + 1] = true;
          this.collision[cellYInPixels + 1][cellXInPixels + 1] = true;
        }

        if (cell.top) {
          this.collision[cellYInPixels - 1][cellXInPixels - 1] = true;
          this.collision[cellYInPixels - 1][cellXInPixels + 0] = true;
          this.collision[cellYInPixels - 1][cellXInPixels + 1] = true;
        }

        if (cell.bottom) {
          this.collision[cellYInPixels + 1][cellXInPixels - 1] = true;
          this.collision[cellYInPixels + 1][cellXInPixels + 0] = true;
          this.collision[cellYInPixels + 1][cellXInPixels + 1] = true;
        }
      }
    }

  }

  mazeToPixelPosition(mazePosition: Point2D) {
    const cellXInPixels = 1 + (mazePosition.x * 2);
    const cellYInPixels = 1 + (mazePosition.y * 2);
    return new Point2D(cellXInPixels, cellYInPixels);
  }

  renderWalls(matrix: LedMatrixInstance) {
    for (let y = 0; y < this.collision.length; y++) {
      const row = this.collision[y];
      for (let x = 0; x < row.length; x++) {
        const cell = row[x];
        if (cell)
          matrix.setPixel(x, y);
      }
    }
  }

  getIsWall(pos: Point2D) {
    const row = this.collision[pos.y];
    if (!row) throw new Error(`pos out of cell bounds '${pos}'`);
    const cell = row[pos.x];
    if (!cell) throw new Error(`pos out of cell bounds '${pos}'`);
    return cell;
  }

  canPass(fromPos: Point2D, velocity: Point2D) {
    const nextPos = fromPos.sum(velocity);
    if (this.isOutOfBounds(nextPos))
      return false;

    return !this.getIsWall(nextPos);
  }

  isOutOfBounds(pos: Point2D) {
    if (pos.x < 0 || pos.x >= this.cellsWide) return true;
    if (pos.y < 0 || pos.y >= this.cellsHigh) return true;
    return false;
  }

  getPossibleDirections(fromPos: Point2D): Point2D[] {
    return Point2D.directions.filter(d => this.canPass(fromPos, d));
  }

}
import { Maze } from "./Maze";
import { Point2D } from "./Point2D";
import { LedMatrixInstance } from "rpi-led-matrix";
import { narray } from "../../../src/utils/misc";
import { rgbToHex } from "../utils/rendering";

export class CollisionMap {

  public readonly width: number;
  public readonly height: number;

  public rows: boolean[][];

  constructor(private maze: Maze) {

    this.height = (maze.height * 2) + 2;
    this.width = (maze.width * 2) + 2;

    this.rows = narray(this.height).map(_ => narray(this.width).map(__ => false));

    // Fill in the bulk of the maze
    for (let y = 0; y < maze.rows.length; y++) {
      const row = maze.rows[y];
      for (let x = 0; x < row.length; x++) {
        const cell = row[x];

        const cellXInPixels = 1 + (x * 2);
        const cellYInPixels = 1 + (y * 2);

        if (cell.left) {
          this.rows[cellYInPixels - 1][cellXInPixels - 1] = true;
          this.rows[cellYInPixels - 0][cellXInPixels - 1] = true;
          this.rows[cellYInPixels + 1][cellXInPixels - 1] = true;
        }

        if (cell.right) {
          this.rows[cellYInPixels - 1][cellXInPixels + 1] = true;
          this.rows[cellYInPixels - 0][cellXInPixels + 1] = true;
          this.rows[cellYInPixels + 1][cellXInPixels + 1] = true;
        }

        if (cell.top) {
          this.rows[cellYInPixels - 1][cellXInPixels - 1] = true;
          this.rows[cellYInPixels - 1][cellXInPixels + 0] = true;
          this.rows[cellYInPixels - 1][cellXInPixels + 1] = true;
        }

        if (cell.bottom) {
          this.rows[cellYInPixels + 1][cellXInPixels - 1] = true;
          this.rows[cellYInPixels + 1][cellXInPixels + 0] = true;
          this.rows[cellYInPixels + 1][cellXInPixels + 1] = true;
        }
      }
    }

    // Now hack the right hand side of the maze to open it 

  }

  mazeToPixelPosition(mazePosition: Point2D) {
    const cellXInPixels = 1 + (mazePosition.x * 2);
    const cellYInPixels = 1 + (mazePosition.y * 2);
    return new Point2D(cellXInPixels, cellYInPixels);
  }


  getIsWall(pos: Point2D) {
    const row = this.rows[pos.y];
    if (!row) throw new Error(`pos out of Y bounds '${pos}'`);
    const cell = row[pos.x];
    if (cell == undefined) throw new Error(`pos out of X bounds '${pos}'`);
    return cell == true;
  }


  public shootRay(from: Point2D, direction: Point2D) {
    const positions = [];
    let pos = from;
    while (!this.getIsWall(pos)) {
      positions.push(pos);
      pos = pos.sum(direction);
    }
    return positions;
  }

  canPass(fromPos: Point2D, velocity: Point2D) {
    const nextPos = fromPos.sum(velocity);
    if (this.isOutOfBounds(nextPos))
      return false;

    return !this.getIsWall(nextPos);
  }

  isOutOfBounds(pos: Point2D) {
    if (pos.x < 0 || pos.x >= this.width) return true;
    if (pos.y < 0 || pos.y >= this.height) return true;
    return false;
  }

  getPossibleDirections(fromPos: Point2D): Point2D[] {
    return Point2D.directions.filter(d => this.canPass(fromPos, d));
  }

  enumerateCells = () => narray(this.height).map(y => narray(this.width).map(x => {
    const pos = new Point2D(x, y);
    return ({ pos, isWall: this.getIsWall(pos) })
  })).flat();

}
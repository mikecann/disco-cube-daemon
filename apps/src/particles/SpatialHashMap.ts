import { narray } from "../../../src/utils/misc";
import { Point2D } from "../maze/Point2D";
import { clamp } from "../utils/misc";

type Particle = {
  position: Point2D
}

export class SpatialHashMap {

  public grid: (Particle | null)[][];

  constructor(public width: number, public height: number) {
    this.grid = narray(height).map((_, y) => narray(width).map((_, x) => null))
  }

  set(position: Point2D, particle: Particle) {
    const x = clamp(Math.round(position.x), 0, this.width - 1);
    const y = clamp(Math.round(position.y), 0, this.height - 1);
    this.grid[y][x] = particle;
  }

  get(position: Point2D) {
    const x = clamp(Math.round(position.x), 0, this.width - 1);
    const y = clamp(Math.round(position.y), 0, this.height - 1);
    return this.grid[y][x];
  }

  remove(position: Point2D) {
    const x = clamp(Math.round(position.x), 0, this.width - 1);
    const y = clamp(Math.round(position.y), 0, this.height - 1);
    this.grid[y][x] = null;
  }

  has(position: Point2D, except: Particle) {
    const p = this.get(position);
    return p && p != except;
  }

  clear() {
    for (let y = 0; y < this.grid.length; y++) {
      const row = this.grid[y];
      for (let x = 0; x < row.length; x++) {
        row[x] = null;
      }
    }
  }


}
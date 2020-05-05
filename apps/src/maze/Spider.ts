import { LedMatrixInstance } from "rpi-led-matrix";
import { rgbToHex } from "../utils/rendering";
import { Point2D } from "./Point2D";
import { Game } from "./Game";
import { ColorTrail } from "./ColorTrail";
import { randomOne } from "../../../src/utils/misc";

export type SpiderState = "searching" | "hunting" | "dead" | "respawning"

export class Spider {

  public position: Point2D;
  private trail: ColorTrail;
  private state: SpiderState;
  private velocity: Point2D;

  constructor(private game: Game) { this.reset() }

  reset() {
    this.state = "hunting";
    this.trail = new ColorTrail(this.game.maze, rgbToHex(100, 0, 100));
    this.position = this.game.collision.mazeToPixelPosition(this.game.maze.getRandomPoint());
    this.velocity = Point2D.randomDirection();
  }

  update() {

    if (this.state == "hunting") {

      const possibles = this.game.collision.getPossibleDirections(this.position);

      const sortedPossibles = possibles.map(dir => {
        let score = 1;

        const newPos = this.position.sum(dir);

        const hasTrial = this.trail.contains(newPos);
        if (hasTrial) score -= 1;

        const isOppositeDir = dir.isOppositeDirectionTo(this.velocity);
        if (isOppositeDir) score -= 1;

        return { dir, score };
      }).sort((a, b) => b.score - a.score).map(o => o.dir)

      this.velocity = sortedPossibles[0];

      //console.log(`update position: ${this.position}, velocity: ${this.velocity}`);

      this.position = this.position.sum(this.velocity);
      this.trail.addSegment(this.position);
    }
  }

  render(matrix: LedMatrixInstance) {
    this.trail.render(matrix);

    matrix.fgColor(rgbToHex(255, 0, 255)).setPixel(this.position.x, this.position.y);
  }

}
import { LedMatrixInstance } from "rpi-led-matrix";
import { rgbToHex } from "../utils/rendering";
import { Point2D } from "./Point2D";
import { Game } from "./Game";
import { randomOne, shuffle } from "../../../src/utils/misc";
import { sortPossibleDirections } from "./utils";
import { TrailRenderer } from "./TrailRenderer";
import { Trail } from "./Trail";

export type SpiderState = "searching" | "hunting" | "dead" | "respawning"

export class Spider {

  public position: Point2D;
  private colorTrail: Trail;
  private trailRenderer: TrailRenderer;
  private state: SpiderState;
  private historyTrail: Trail;
  private velocity: Point2D;

  constructor(private game: Game) { this.reset() }

  reset() {
    this.state = "hunting";
    this.colorTrail = new Trail(10);
    this.historyTrail = new Trail(200);
    this.trailRenderer = new TrailRenderer(this.colorTrail, rgbToHex(100, 0, 100));
    this.position = this.game.collision.mazeToPixelPosition(this.game.maze.getRandomPoint());
    this.velocity = Point2D.randomDirection();
  }

  update() {

    if (this.state == "hunting") {

      const getNewVelocity = () => {
        const left = this.velocity.left();

        const isWallToLeft = this.game.collision.getIsWall(this.position.sum(left));
        if (!isWallToLeft) return left;

        const isWallForward = this.game.collision.getIsWall(this.position.sum(this.velocity));
        if (!isWallForward)
          return this.velocity;

        const possibles = this.game.collision.getPossibleDirections(this.position);
        if (possibles.length == 0) throw new Error(`there are no possibles, this is impossible`);

        const sorted = sortPossibleDirections(possibles, dir =>
          this.historyTrail.getAge(this.position.sum(dir))
        )

        return sorted[0];
      }


      this.velocity = getNewVelocity();

      this.position = this.position.sum(this.velocity);
      this.colorTrail.addSegment(this.position);
      this.historyTrail.addSegment(this.position);
    }
  }

  render(matrix: LedMatrixInstance) {
    this.trailRenderer.render(matrix);

    matrix.fgColor(rgbToHex(255, 0, 255)).setPixel(this.position.x, this.position.y);
  }

}
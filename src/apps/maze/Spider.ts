import { LedMatrixInstance } from "rpi-led-matrix";
import { rgbToHex } from "../../utils/rendering";
import { Point2D } from "./Point2D";
import { Game } from "./Game";
import { ColorTrail } from "./ColorTrail";
import { randomOne } from "../../utils/misc";

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
    this.position = this.game.maze.getRandomPoint();
    this.velocity = Point2D.randomDirection();
  }

  update() {

    if (this.state == "hunting") {

      const canPass = this.game.maze.canPass(this.position, this.velocity);
      const possibles = this.game.maze.getPossibleDirections(this.position);

      // Keep going in that direction if we can
      if (canPass) {

        // Rarely have a chance to change direction
        // if (Math.random() < 0.1) {
        //   const nonOpposite = possibles.filter(p => !p.isOppositeDirectionTo(this.velocity));
        //   if (nonOpposite.length > 0) {
        //     this.velocity = randomOne(nonOpposite);
        //     console.log(`changed my mind, heading in ${this.velocity}`)
        //   }
        // }

      }

      // If we cant keep going then lets go a different way
      else {
        this.velocity = randomOne(possibles);
        console.log(`cant go that way, changed to ${this.velocity}`);
      }
    }

    console.log(`update position: ${this.position}, velocity: ${this.velocity}`);

    this.position = this.position.sum(this.velocity);
    this.trail.addSegment(this.position);
  }

  render(matrix: LedMatrixInstance) {
    this.trail.render(matrix);

    matrix.fgColor(rgbToHex(255, 0, 255)).setPixel(this.position.x, this.position.y);
  }

}
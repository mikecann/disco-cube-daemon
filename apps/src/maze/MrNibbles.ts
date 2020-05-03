import { LedMatrixInstance } from "rpi-led-matrix";
import { Point2D } from "./Point2D";
import { ColorTrail } from "./ColorTrail";
import { rgbToHex } from "../utils/rendering";
import { Game } from "./Game";

export class MrNibbles {

  private trail: ColorTrail;
  private position: Point2D;
  private velocity: Point2D;

  constructor(private game: Game) {
    this.reset();
  }

  reset() {
    this.trail = new ColorTrail(this.game.maze, rgbToHex(255, 255, 0));
    this.position = this.game.maze.getRandomPoint();
    this.velocity = Point2D.randomDirection();
  }

  update() {


    this.trail.addSegment(this.position);
  }

  render(matrix: LedMatrixInstance) {
    this.trail.render(matrix);
  }

}
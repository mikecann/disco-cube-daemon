import { LedMatrixInstance } from "rpi-led-matrix";
import { rgbToHex } from "../../utils/rendering";
import { Point2D } from "./Point2D";
import { Game } from "./Game";
import { ColorTrail } from "./ColorTrail";

export type SpiderState = "searching" | "hunting" | "dead" | "respawning"

export class Spider {

  public position: Point2D;
  private trail: ColorTrail;
  private state: SpiderState;
  private velocity: Point2D;

  constructor(private game: Game) { this.reset() }

  reset() {
    this.state = "hunting";
    this.trail = new ColorTrail(this.game.maze, rgbToHex(255, 0, 255));
    this.position = this.game.maze.getRandomPoint();
    this.velocity = Point2D.randomDirection();
  }

  update() {

    if (this.state == "hunting") {

      const canPass = this.game.maze.canPass(this.position, this.velocity);

      if (canPass)
        this.position = this.position.sum(this.velocity);

        else 

    }

  }

  render(matrix: LedMatrixInstance) {

    const color = rgbToHex(255, 0, 0);
    matrix.fgColor(color);

    this.game.maze.renderPixel(this.position, matrix);
  }

}
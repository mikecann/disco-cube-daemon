import { LedMatrixInstance } from "rpi-led-matrix";
import { Point2D } from "./Point2D";
import { ColorTrail } from "./ColorTrail";
import { rgbToHex } from "../utils/rendering";
import { Game } from "./Game";
import { sortPossibleDirections } from "./utils";

export type MrNibblesState = "searching" | "hunting" | "dead" | "respawning"

export class MrNibbles {

  public position: Point2D;
  private trail: ColorTrail;
  private state: MrNibblesState;
  private velocity: Point2D;

  constructor(private game: Game) { this.reset() }

  reset() {
    this.state = "hunting";
    this.trail = new ColorTrail(this.game.maze, rgbToHex(100, 100, 0));
    this.position = this.game.collision.mazeToPixelPosition(this.game.maze.getRandomPoint());
    this.velocity = Point2D.randomDirection();
  }

  update() {

    if (this.state == "hunting") {

      const possibles = this.game.collision.getPossibleDirections(this.position);

      const sortedPossibles = sortPossibleDirections(possibles, (dir) => {
        let score = 10;

        const newPos = this.position.sum(dir);

        // Dont go somewhere we have already been
        const hasTrial = this.trail.contains(newPos);
        if (hasTrial)
          score -= 2;

        // Favor trying out different paths
        if (!dir.equals(this.velocity) && possibles.length > 2)
          score += 1;

        // Dont backtrack
        const isOppositeDir = dir.isOppositeDirectionTo(this.velocity);
        if (isOppositeDir) score -= 3;

        return score;

      })

      this.velocity = sortedPossibles[0];

      //console.log(`update position: ${this.position}, velocity: ${this.velocity}`);

      this.position = this.position.sum(this.velocity);
      this.trail.addSegment(this.position);
    }

    const nibble = this.game.nibbles.find(n => n.position.equals(this.position));
    if (nibble) this.game.destoryNibble(nibble);

    const superNibble = this.game.nibbles.find(n => n.position.equals(this.position));
    if (superNibble) this.game.destorySuperNibble(superNibble);
  }

  render(matrix: LedMatrixInstance) {
    this.trail.render(matrix);

    matrix.fgColor(rgbToHex(255, 255, 0)).setPixel(this.position.x, this.position.y);
  }

}
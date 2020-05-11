import { LedMatrixInstance } from "rpi-led-matrix";
import { Point2D } from "./Point2D";
import { TrailRenderer } from "./TrailRenderer";
import { rgbToHex } from "../utils/rendering";
import { Game } from "./Game";
import { sortPossibleDirections } from "./utils";
import { Trail } from "./Trail";
import { shuffle, randomOne } from "../../../src/utils/misc";

export type MrNibblesState = "normal" | "super";

const startingSuperTicks = 100;

export class MrNibbles {
  public position: Point2D;
  private trailRenderer: TrailRenderer;
  private colorTrail: Trail;
  private historyTrail: Trail;

  private state: MrNibblesState;
  private velocity: Point2D;
  private remainingSuperTicks: number;

  constructor(private game: Game) {
    this.reset();
  }

  reset() {
    this.remainingSuperTicks = 0;
    this.state = "normal";
    this.colorTrail = new Trail(10);
    this.historyTrail = new Trail(200);
    this.trailRenderer = new TrailRenderer(this.colorTrail, rgbToHex(100, 100, 0));
    this.position = this.game.collision.mazeToPixelPosition(this.game.maze.getRandomPoint());
    this.velocity = Point2D.randomDirection();
  }

  update() {
    const getNewVelocity = () => {
      const left = this.velocity.left();
      const possibles = this.game.collision.getPossibleDirections(this.position);

      const possibleDiretionsWithNibbles = possibles.filter((dir) => {
        const pos = this.position.sum(dir);
        const nibble = this.game.nibbles.find((n) => n.position.equals(pos));
        if (nibble) return true;
        const superNibble = this.game.nibbles.find((n) => n.position.equals(pos));
        if (superNibble) return true;
        return false;
      });

      if (possibleDiretionsWithNibbles.length > 0) return randomOne(possibleDiretionsWithNibbles);

      const isWallToLeft = this.game.collision.getIsWall(this.position.sum(left));
      if (!isWallToLeft) return left;

      const isWallForward = this.game.collision.getIsWall(this.position.sum(this.velocity));
      if (!isWallForward) return this.velocity;

      if (possibles.length == 0) throw new Error(`there are no possibles, this is impossible`);

      const sorted = sortPossibleDirections(possibles, (dir) =>
        this.historyTrail.getAge(this.position.sum(dir))
      );

      return sorted[0];
    };

    if (this.state == "normal") {
      this.velocity = getNewVelocity();
    } else if (this.state == "super") {
      this.velocity = getNewVelocity();

      this.remainingSuperTicks--;
      if (this.remainingSuperTicks == 0) {
        this.state = "normal";
        this.game.wallsRenderer.mrNibblesExitSuperMode();
      }
    }

    this.position = this.position.sum(this.velocity);

    this.colorTrail.addSegment(this.position);
    this.historyTrail.addSegment(this.position);

    const nibble = this.game.nibbles.find((n) => n.position.equals(this.position));
    if (nibble) {
      this.game.destoryNibble(nibble);
      this.game.wallsRenderer.nibbleCollected();
    }

    const superNibble = this.game.superNibbles.find((n) => n.position.equals(this.position));
    if (superNibble) {
      this.game.destorySuperNibble(superNibble);
      this.state = "super";
      this.remainingSuperTicks = startingSuperTicks;
      this.game.wallsRenderer.mrNibblesEnterSuperMode();
    }

    const spider = this.game.spiders.find((n) => n.position.equals(this.position));
    if (spider) {
      if (this.state == "super") spider.die();
      else this.die();
    }
  }

  die() {
    this.reset();
    this.game.wallsRenderer.mrNibblesKilled();
  }

  render(matrix: LedMatrixInstance) {
    this.trailRenderer.render(matrix);

    const byte = this.state == "super" ? (this.remainingSuperTicks % 2 == 0 ? 255 : 0) : 255;
    matrix.fgColor(rgbToHex(byte, byte, 0)).setPixel(this.position.x, this.position.y);
  }
}

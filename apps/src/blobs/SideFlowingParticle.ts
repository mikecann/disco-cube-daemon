import { Point2D } from "../maze/Point2D";
import { LedMatrixInstance } from "rpi-led-matrix";
import { randomColor } from "../utils/rendering";
import { CubeFace } from "../utils/CubeFace";
import { flowAcrossFace } from "../utils/flowAcrossFace";

export class SideFlowingParticle {
  constructor(
    private face: CubeFace,
    public position = Point2D.zero,
    public velocity = Point2D.zero,
    private color = randomColor()
  ) { }

  public update(delta: number) {

    this.position = this.position.sum(this.velocity.multiplyBy(delta / 32));

    const output = flowAcrossFace({ position: this.position, velocity: this.velocity, face: this.face });

    this.position = output.position;
    this.velocity = output.velocity;
    this.face = output.face;
  }

  applyForce(force: Point2D) {
    this.velocity = this.velocity.sum(force);
  }

  public render() {
    this.face.setPixel(Math.floor(this.position.x), Math.floor(this.position.y), this.color);
  }
}
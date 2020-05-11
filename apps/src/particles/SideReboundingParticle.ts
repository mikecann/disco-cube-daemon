import { Point2D } from "../maze/Point2D";
import { LedMatrixInstance } from "rpi-led-matrix";
import { rgbToHex, randomColor } from "../utils/rendering";
import { matrixWidth, matrixHeight, faceWidth, faceHeight } from "../utils/const";
import { CubeFace } from "../utils/CubeFace";
import { getQuaternionDifference } from "../utils/quaternion";

const dampen = 0.5;
const gravity = new Point2D(0, 0.9);

export class SideReboundingParticle {
  constructor(
    private face: CubeFace,
    private particles: SideReboundingParticle[],
    public position = Point2D.zero,
    public velocity = Point2D.zero,
    private color = randomColor()
  ) { }

  public update(delta: number) {
    this.velocity = this.velocity.sum(gravity.multiplyBy(delta / 300));

    const deltaV = this.velocity.multiplyBy(delta / 32);
    let newPos = this.position.sum(deltaV);

    if (this.collidesWithOthers(new Point2D(newPos.x, this.position.y))) {
      newPos = newPos.setX(this.position.x);
      this.velocity = this.velocity.invertX().multiplyBy(dampen);
    }

    if (this.collidesWithOthers(new Point2D(this.position.x, newPos.y))) {
      newPos = newPos.setY(this.position.y);
      this.velocity = this.velocity.invertY().multiplyBy(dampen);
    }

    this.position = newPos;

    this.containWithFace();
  }

  private collidesWithOthers(atPos: Point2D) {
    for (let particle of this.particles) {
      if (particle == this) continue;
      const x = Math.round(particle.position.x);
      const y = Math.round(particle.position.y);
      if (x == atPos.x && y == atPos.y) return true;
    };
    return false;
  }

  private containWithFace() {
    if (this.position.x < 0) {
      this.position = this.position.setX(-this.position.x);
      this.velocity = new Point2D(-this.velocity.x * dampen, this.velocity.y * dampen);
    }

    if (this.position.x >= faceWidth) {
      this.position = this.position.setX(faceWidth - (this.position.x - faceWidth));
      this.velocity = new Point2D(-this.velocity.x * dampen, this.velocity.y * dampen);
    }

    if (this.position.y < 0) {
      this.position = this.position.setY(-this.position.y);
      this.velocity = new Point2D(this.velocity.x * dampen, -this.velocity.y * dampen);
    }

    if (this.position.y >= faceHeight) {
      this.position = this.position.setY(faceHeight - (this.position.y - faceHeight));
      this.velocity = new Point2D(this.velocity.x * dampen, -this.velocity.y * dampen);
    }
  }

  applyForce(force: Point2D) {
    this.velocity = this.velocity.sum(force);
  }

  public render() {
    this.face.setPixel(Math.floor(this.position.x), Math.floor(this.position.y), this.color);
  }
}

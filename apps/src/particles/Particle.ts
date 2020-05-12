import { Point2D } from "../maze/Point2D";
import { LedMatrixInstance } from "rpi-led-matrix";
import { rgbToHex, randomColor } from "../utils/rendering";
import { matrixWidth, matrixHeight, faceWidth, faceHeight } from "../utils/const";
import { CubeFace } from "../utils/CubeFace";
import { getQuaternionDifference } from "../utils/quaternion";
import { SpatialHashMap } from "./SpatialHashMap";

const dampen = 0.5;
const gravity = new Point2D(0, 0.9);

export class Particle {
  constructor(
    private face: CubeFace,
    private hashmap: SpatialHashMap,
    public position = Point2D.zero,
    public velocity = Point2D.zero,
    private color = randomColor()
  ) { }

  public update(delta: number) {
    this.velocity = this.velocity.sum(gravity.multiplyBy(delta / 300));

    const deltaV = this.velocity.multiplyBy(delta / 32);
    let newPos = this.position.sum(deltaV);

    if (this.hashmap.has(new Point2D(newPos.x, this.position.y), this)) {
      newPos = newPos.setX(this.position.x);
      this.velocity = this.velocity.invertX().multiplyBy(dampen);
    }

    if (this.hashmap.has(new Point2D(this.position.x, newPos.y), this)) {
      newPos = newPos.setY(this.position.y);
      this.velocity = this.velocity.invertY().multiplyBy(dampen);
    }

    newPos = this.containWithFace(newPos);

    if (!this.hashmap.has(newPos, this)) {
      this.hashmap.remove(this.position);
      this.position = newPos;
      this.hashmap.set(this.position, this);
    }
  }

  private containWithFace(newPos: Point2D) {
    if (this.position.x < 0) {
      newPos = this.position.setX(-this.position.x);
      this.velocity = new Point2D(-this.velocity.x * dampen, this.velocity.y * dampen);
    }

    if (this.position.x >= faceWidth) {
      newPos = this.position.setX(faceWidth - (this.position.x - faceWidth));
      this.velocity = new Point2D(-this.velocity.x * dampen, this.velocity.y * dampen);
    }

    if (this.position.y < 0) {
      newPos = this.position.setY(-this.position.y);
      this.velocity = new Point2D(this.velocity.x * dampen, -this.velocity.y * dampen);
    }

    if (this.position.y >= faceHeight) {
      newPos = this.position.setY(faceHeight - (this.position.y - faceHeight));
      this.velocity = new Point2D(this.velocity.x * dampen, -this.velocity.y * dampen);
    }

    return newPos;
  }

  applyForce(force: Point2D) {
    this.velocity = this.velocity.sum(force);
  }

  public render() {
    this.face.setPixel(Math.floor(this.position.x), Math.floor(this.position.y), this.color);
  }
}

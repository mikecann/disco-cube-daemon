import { Point2D } from "../maze/Point2D";
import { randomColor } from "../utils/rendering";
import { CubeFace } from "../utils/CubeFace";
import { flowAcrossFace } from "../utils/flowAcrossFace";
import { SpatialHashMap } from "../particles/SpatialHashMap";

const dampen = 0.5;
const gravity = new Point2D(0, 0.9);

export class SideFlowingCollidingParticle {
  constructor(
    private face: CubeFace,
    private hashmaps: SpatialHashMap[],
    public position = Point2D.zero,
    public velocity = Point2D.zero,
    private color = randomColor()
  ) { }

  public update(delta: number) {
    this.velocity = this.velocity.sum(gravity.multiplyBy(delta / 300)).multiplyBy(0.9);
    const hashmap = this.hashmaps[this.face.index];

    const deltaV = this.velocity.multiplyBy(delta / 32);
    let newPos = this.position.sum(deltaV);

    const output = flowAcrossFace({ position: newPos, velocity: this.velocity, face: this.face });


    // if (hashmap.has(new Point2D(newPos.x, this.position.y), this)) {
    //   newPos = newPos.setX(this.position.x);
    //   this.velocity = this.velocity.invertX().multiplyBy(dampen);
    // }

    // if (hashmap.has(new Point2D(this.position.x, newPos.y), this)) {
    //   newPos = newPos.setY(this.position.y);
    //   this.velocity = this.velocity.invertY().multiplyBy(dampen);
    // }

    const newHashmap = this.hashmaps[output.face.index];

    if (!newHashmap.has(output.position, this)) {
      hashmap.remove(this.position);
      newHashmap.set(output.position, this);
      this.position = output.position;
      this.velocity = output.velocity;
      this.face = output.face;
    }
    else {
      this.velocity = this.velocity.invert().multiplyBy(dampen);
    }
  }

  applyForce(force: Point2D) {
    this.velocity = this.velocity.sum(force);
  }

  public render() {
    this.face.setPixel(Math.floor(this.position.x), Math.floor(this.position.y), this.color);
  }
}
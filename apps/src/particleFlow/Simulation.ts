import { pixelsPerFace, matrixWidth, matrixHeight, faceWidth, faceHeight, facesCount } from "../utils/const";
import { Point2D } from "../maze/Point2D";
import { randomIntRange, randomRange } from "../utils/misc";
import { LedMatrixInstance } from "rpi-led-matrix";
import { Cube } from "../utils/Cube";
import { Accelerometer } from "../utils/Accelerometer";
import { SpatialHashMap } from "../particles/SpatialHashMap";
import { narray } from "../../../src/utils/misc";
import { SideFlowingCollidingParticle } from "./SideFlowingCollidingParticle";

export class Simulation {
  private particles: SideFlowingCollidingParticle[];
  private hashmaps: SpatialHashMap[];

  constructor(private cube: Cube, private accel: Accelerometer) {
    this.init();
  }

  init() {
    const numParticles = (pixelsPerFace) * 1;

    this.particles = [];
    this.hashmaps = narray(facesCount).map(_ => new SpatialHashMap(faceWidth, faceHeight))

    for (let i = 0; i < numParticles; i++)
      this.particles.push(new SideFlowingCollidingParticle(
        this.cube.faces[randomIntRange(0, 5)],
        this.hashmaps,
        new Point2D(randomIntRange(0, faceWidth), randomIntRange(0, faceHeight)),
        new Point2D(randomRange(-0.2, 0.2), randomRange(-0.2, 0.2))
      ));
  }

  update(delta: number) {

    const accelForce = new Point2D(this.accel.accel[1], -this.accel.accel[2]).multiplyBy(delta / 100);

    for (let particle of this.particles) {
      particle.applyForce(accelForce);
      particle.update(delta);
    }
  }

  render(matrix: LedMatrixInstance) {
    for (let particle of this.particles) particle.render();
  }
}

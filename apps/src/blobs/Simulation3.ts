import { pixelsPerFace, matrixWidth, matrixHeight, faceWidth, faceHeight, facesCount } from "../utils/const";
import { Point2D } from "../maze/Point2D";
import { randomIntRange, randomRange } from "../utils/misc";
import { LedMatrixInstance } from "rpi-led-matrix";
import { rgbToHex } from "../utils/rendering";
import { Cube } from "../utils/Cube";
import { Accelerometer } from "../utils/Accelerometer";
import { SpatialHashMap } from "../particles/SpacialHashmap";
import { SideReboundingParticle } from "../particles/SideReboundingParticle";
import { SideFlowingParticle } from "./SideFlowingParticle";

export class Simulation3 {
  private particles: SideFlowingParticle[];

  constructor(private cube: Cube, private accel: Accelerometer) {
    this.init();
  }

  init() {
    const numParticles = (pixelsPerFace + pixelsPerFace / 2) / 10;
    this.particles = [];

    for (let i = 0; i < numParticles; i++)
      this.particles.push(new SideFlowingParticle(
        this.cube.faces[0],
        new Point2D(randomIntRange(0, faceWidth), randomIntRange(0, faceHeight)),
        new Point2D(randomRange(-0.2, 0.2), randomRange(-0.2, 0.2))
      ));

    // this.particles.push(
    //   new SideFlowingParticle(
    //     this.cube.faces[4],
    //     new Point2D((faceWidth / 2), faceHeight / 2),
    //     new Point2D(0.5, 0.15),
    //     rgbToHex(255, 0, 0)
    //   )
    // );
  }

  update(delta: number) {

    const accelForce = new Point2D(this.accel.accel[1], -this.accel.accel[2]).multiplyBy(delta / 100);

    for (let particle of this.particles) {
      particle.applyForce(accelForce);
      particle.update(delta);
      particle.velocity = particle.velocity.multiplyBy(0.9);
    }
  }

  render(matrix: LedMatrixInstance) {
    for (let particle of this.particles) particle.render();
  }
}

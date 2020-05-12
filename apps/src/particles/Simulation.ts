import { pixelsPerFace, faceWidth, faceHeight, facesCount } from "../utils/const";
import { Point2D } from "../maze/Point2D";
import { randomIntRange, randomRange } from "../utils/misc";
import { LedMatrixInstance } from "rpi-led-matrix";
import { Accelerometer } from "../utils/Accelerometer";
import { Particle } from "./Particle";
import { CubeFace } from "../utils/CubeFace";
import { SpatialHashMap } from "./SpatialHashMap";

export class Simulation {
  private particles: Particle[];
  private hashmap: SpatialHashMap;

  constructor(private face: CubeFace, private accel: Accelerometer) {
    this.init();
  }

  init() {
    const numParticles = 400;
    this.particles = [];
    this.hashmap = new SpatialHashMap(faceWidth, faceHeight);

    for (let i = 0; i < numParticles; i++)
      this.particles.push(new Particle(
        this.face,
        this.hashmap,
        new Point2D(randomIntRange(0, faceWidth), randomIntRange(0, faceHeight)),
        new Point2D(randomRange(-0.5, 0.5), randomRange(-0.5, 0.5))
      ));

  }

  update(delta: number) {
    const accelForce = new Point2D(this.accel.accel[1], -this.accel.accel[2]).multiplyBy(delta / 100);

    for (let i = 0; i < this.particles.length; i++) {
      const particle = this.particles[i];
      particle.applyForce(accelForce);
      particle.update(delta);
    }
  }

  render(matrix: LedMatrixInstance) {
    for (let particle of this.particles) particle.render();
  }
}

import { Particle } from "./Particle";
import { pixelsPerSide, matrixWidth, matrixHeight } from "../utils/const";
import { Point2D } from "../maze/Point2D";
import { randomIntRange, randomRange } from "../utils/misc";
import { LedMatrixInstance } from "rpi-led-matrix";

export class Simulation {

  private particles: Particle[];

  constructor() {
    this.init();
  }

  init() {
    const numParticles = (pixelsPerSide + pixelsPerSide / 2) / 10;
    this.particles = [];
    for (let i = 0; i < numParticles; i++)
      this.particles.push(new Particle(
        new Point2D(randomIntRange(0, matrixWidth), randomIntRange(0, matrixHeight)),
        new Point2D(randomRange(-0.1, 0.1), randomRange(-0.1, 0.1))
      ));
  }

  update(delta: number) {
    for (let particle of this.particles)
      particle.update(delta);
  }

  render(matrix: LedMatrixInstance) {
    for (let particle of this.particles)
      particle.render(matrix);
  }

}
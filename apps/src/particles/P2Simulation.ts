import { pixelsPerFace, faceWidth, faceHeight, facesCount } from "../utils/const";
import { Point2D } from "../maze/Point2D";
import { randomIntRange, randomRange } from "../utils/misc";
import { LedMatrixInstance } from "rpi-led-matrix";
import { Accelerometer } from "../utils/Accelerometer";
import { SpatialHashMap } from "./SpacialHashmap";
import { SideReboundingParticle } from "./SideReboundingParticle";
import { CubeFace } from "../utils/CubeFace";
import { P2Particle } from "./P2Particle";
import p2 from "p2";
import { randomColor } from "../utils/rendering";

export class P2Simulation {
  private particles: P2Particle[];
  private world: p2.World;

  constructor(private face: CubeFace, private accel: Accelerometer) {
    this.init();
  }

  init() {
    const numParticles = 200;// (pixelsPerFace + pixelsPerFace / 2) / 10;
    this.particles = [];

    this.world = new p2.World({
      gravity: [0., -9.82]
    })

    for (let i = 0; i < numParticles; i++) {
      const particle = new P2Particle(
        this.face,
        new Point2D(randomIntRange(0, faceWidth), randomIntRange(0, faceHeight)),
        randomColor()
      );
      this.particles.push(particle);
      this.world.addBody(particle.body);
    }


    const groundBody = new p2.Body({ mass: 0 });
    const groundShape = new p2.Plane();
    groundBody.addShape(groundShape);
    this.world.addBody(groundBody);

    const leftWall = new p2.Body({ mass: 0 });
    const leftWallShape = new p2.Plane({
      position: [0, 0],
      angle: 90
    });
    leftWall.addShape(leftWallShape);
    this.world.addBody(leftWall);

    const rightWall = new p2.Body({ mass: 0 });
    const rightWallShape = new p2.Plane({
      position: [64, 0],
      angle: 90
    });
    rightWall.addShape(rightWallShape);
    this.world.addBody(rightWall);

  }

  update(deltaMs: number) {
    //console.log(this.accel.accel)
    //const accelForce = new Point2D(this.accel.accel[1], -this.accel.accel[2]).multiplyBy(delta / 100);

    //this.hashmap.clear();

    const fixedTimeStep = 1 / 60; // seconds
    const maxSubSteps = 10; // Max sub steps to catch up with the wall clock

    this.world.step(fixedTimeStep, deltaMs / 1000, maxSubSteps);


    //for (let i = 0; i < this.particles.length; i++) {
    //const particle = this.particles[i];
    //particle.applyForce(accelForce);
    //particle.update(delta);
    //this.hashmap.add(particle.position.x, particle.position.y, i);
    //}

    // For each cell query then resolve collisions
    // for(let cell of this.hashmap.grid) {
    //   if (cell.length < 2) continue;
    //   for(let particleI of cell) {
    //     const 
    //   }
    // }


    // for (let groupI = 0; groupI < this.hashmap.length; groupI++) {
    //   this.hashmap[groupI].clear();
    //   for (let particle of this.particles[groupI]) {
    //     const query = this.hashmap[groupI].query(particle.position.x, particle.position.y);
    //     if (query.length) {
    //       particle.position = particle.oldPosition;
    //       particle.velocity = particle.velocity.multiplyBy(0.5);
    //     }
    //   }
    // }

  }

  render(matrix: LedMatrixInstance) {
    for (let particle of this.particles) particle.render();
  }
}

// import { pixelsPerFace, faceWidth, faceHeight, facesCount } from "../utils/const";
// import { Point2D } from "../maze/Point2D";
// import { randomIntRange, randomRange } from "../utils/misc";
// import { LedMatrixInstance } from "rpi-led-matrix";
// import { Accelerometer } from "../utils/Accelerometer";
// import { SpatialHashMap } from "./SpacialHashmap";
// import { SideReboundingParticle } from "./SideReboundingParticle";
// import { CubeFace } from "../utils/CubeFace";
// import { P2Particle } from "./P2Particle";
// import p2 from "p2";
// import { randomColor } from "../utils/rendering";
// import { Worker } from "worker_threads";


// export class P2Simulation {
//   private particles: Float32Array[];

//   constructor(private face: CubeFace, private accel: Accelerometer) {
//     this.init();
//   }

//   init() {

//     const worker = new Worker(__dirname + "/p2simThread.js", {
//       workerData: { foo: "bar" }
//     });

//     worker.on('message', (msg) => {
//       this.particles = msg;
//       //console.log("GOT MESSAGE FROM WORKER", msg)
//     });

//     worker.on('error', err => {
//       console.log("GOT ERROR FROM WORKER")
//     });

//     worker.on('exit', (code) => {
//       console.log("WORKDER EXIT", code);
//     });

//     // const numParticles = 400;// (pixelsPerFace + pixelsPerFace / 2) / 10;
//     // this.particles = [];

//     // this.world = new p2.World({
//     //   gravity: [0., -9.82],
//     //   islandSplit: true
//     // });


//     // for (let i = 0; i < numParticles; i++) {
//     //   const particle = new P2Particle(
//     //     this.face,
//     //     new Point2D(randomIntRange(0, faceWidth), randomIntRange(0, faceHeight)),
//     //     randomColor()
//     //   );
//     //   this.particles.push(particle);
//     //   this.world.addBody(particle.body);
//     // }


//     // const groundBody = new p2.Body({ mass: 0 });
//     // const groundShape = new p2.Plane();
//     // groundBody.addShape(groundShape);
//     // this.world.addBody(groundBody);

//     // const leftWall = new p2.Body({ mass: 0 });
//     // const leftWallShape = new p2.Box({
//     //   position: [100, -100],
//     //   width: 10,
//     //   height: 200
//     // });
//     // leftWall.addShape(leftWallShape);
//     // this.world.addBody(leftWall);

//     // const rightWall = new p2.Body({ mass: 0 });
//     // const rightWallShape = new p2.Box({
//     //   position: [-100, -100],
//     //   width: 10,
//     //   height: 200
//     // });
//     // rightWall.addShape(rightWallShape);
//     // this.world.addBody(rightWall);

//     // const rightWall = new p2.Body({ mass: 0 });
//     // const rightWallShape = new p2.Plane({
//     //   position: [50, 0],
//     //   angle: 90
//     // });
//     // rightWall.addShape(rightWallShape);
//     // this.world.addBody(rightWall);

//   }

//   update(deltaMs: number) {


//     // const fixedTimeStep = 1 / 30;
//     // const maxSubSteps = 1;

//     // this.world.step(fixedTimeStep, deltaMs / 1000, maxSubSteps);

//     //blockCpuFor(200);
//   }

//   render(matrix: LedMatrixInstance) {
//     if (!this.particles) return;
//     for (let particle of this.particles) {
//       //console.log(particle);
//       this.face.setPixel(
//         Math.floor(particle[0]),
//         Math.floor(particle[1]),
//         0xff0000
//       );
//     }
//   }
// }


// function blockCpuFor(ms: number) {
//   const startTime = new Date().getTime();
//   let result = 0
//   while (new Date().getTime() - startTime < ms) {
//     result += Math.random() * Math.random();
//   }

// }
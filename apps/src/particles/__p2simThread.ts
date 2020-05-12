// import { hang } from "../../../src/utils/misc";
// import { parentPort } from "worker_threads";
// import p2 from "p2";
// import { P2Particle } from "./P2Particle";
// import { randomIntRange } from "../utils/misc";
// import { faceWidth } from "../utils/const";

// async function bootstrap() {
//   if (!parentPort) throw new Error(`no parent port, should be put inside a parent thread`);

//   const numParticles = 400;// (pixelsPerFace + pixelsPerFace / 2) / 10;
//   const particles: p2.Body[] = [];

//   const world = new p2.World({
//     gravity: [0., -9.82],
//     islandSplit: true
//   });


//   for (let i = 0; i < numParticles; i++) {
//     const body = new p2.Body({
//       mass: 1,
//       position: [randomIntRange(0, faceWidth), randomIntRange(0, faceWidth)]
//     });

//     const shape = new p2.Circle({ radius: 0.5 });
//     body.addShape(shape);

//     particles.push(body);
//     world.addBody(body);
//   }

//   const groundBody = new p2.Body({ mass: 0 });
//   const groundShape = new p2.Plane();
//   groundBody.addShape(groundShape);
//   world.addBody(groundBody);

//   // const leftWall = new p2.Body({ mass: 0 });
//   // const leftWallShape = new p2.Box({
//   //   position: [100, -100],
//   //   width: 10,
//   //   height: 200
//   // });
//   // leftWall.addShape(leftWallShape);
//   // world.addBody(leftWall);

//   // const leftWall = new p2.Body({ mass: 0 });
//   // const leftWallShape = new p2.Box({
//   //   position: [-10, 0],
//   //   width: 10,
//   //   height: 200
//   // });
//   // rightWall.addShape(rightWallShape);
//   // world.addBody(rightWall);

//   // const rightWall = new p2.Body({ mass: 0 });
//   // const rightWallShape = new p2.Plane({
//   //   position: [50, 0],
//   //   angle: 90
//   // });
//   // rightWall.addShape(rightWallShape);
//   // world.addBody(rightWall);

//   let lastFrameTime = Date.now();
//   const tick = () => {
//     const delta = Date.now() - lastFrameTime;
//     lastFrameTime = Date.now();

//     const fixedTimeStep = 1 / 30;
//     const maxSubSteps = 10;
//     world.step(fixedTimeStep, delta / 1000, maxSubSteps);

//     //console.log(particles[0].interpolatedPosition)

//     if (parentPort)
//       parentPort.postMessage(particles.map(p => p.interpolatedPosition));

//     setTimeout(tick, 32);
//   }

//   tick();

//   await hang();
// }

// bootstrap().catch((e) => console.error(`ERROR: `, e));

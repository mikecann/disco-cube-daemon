// import { pixelsPerFace, faceWidth, faceHeight, facesCount } from "../utils/const";
// import { Point2D } from "../maze/Point2D";
// import { randomIntRange, randomRange } from "../utils/misc";
// import { LedMatrixInstance } from "rpi-led-matrix";
// import { Accelerometer } from "../utils/Accelerometer";
// import { SpatialHashMap } from "./SpacialHashmap";
// import { SideReboundingParticle } from "./SideReboundingParticle";
// import { CubeFace } from "../utils/CubeFace";
// import { P2Particle } from "./P2Particle";
// import { randomColor } from "../utils/rendering";
// import { Box2DParticle } from "./__Box2DParticle";
// import * as box2d from "box2d.ts";
// import { b2BodyDef, b2ChainShape, b2Vec2, b2ParticleSystemDef, b2PolygonShape, b2ParticleGroupDef, b2ParticleSystem, b2ParticleGroup } from "box2d.ts";

// export class Box2DSimulation {
//   private particles: Box2DParticle[];
//   private world: box2d.b2World;

//   private particleSystem: b2ParticleSystem;
//   private particleGroup: b2ParticleGroup;

//   constructor(private face: CubeFace, private accel: Accelerometer) {
//     this.init();
//   }

//   init() {
//     this.particles = [];

//     let gravity = new box2d.b2Vec2(0, -9.8)
//     this.world = new box2d.b2World(gravity);

//     this.createWalls();

//     var psd = new b2ParticleSystemDef();
//     psd.radius = 0.025;
//     psd.dampingStrength = 0.2;
//     psd.maxCount = 200;
//     this.particleSystem = this.world.CreateParticleSystem(psd);

//     // Create the particles.
//     const shape = new b2PolygonShape;
//     shape.SetAsBox(10, 1, new b2Vec2(0.0, 1.01), 0);
//     var pd = new b2ParticleGroupDef;
//     pd.shape = shape;

//     this.particleGroup = this.particleSystem.CreateParticleGroup(pd);


//     // const particleSystem = this.world.CreateParticleSystem(new box2d.b2ParticleSystemDef());
//     // particleSystem.SetGravityScale(0.4);
//     // particleSystem.SetDensity(1.2);
//     // particleSystem.SetRadius(0.035 * 2);

//     // const shape = new box2d.b2CircleShape();
//     // shape.m_p.Set(0, 3);
//     // shape.m_radius = 2;
//     // const pd = new box2d.b2ParticleGroupDef();
//     // pd.flags = box2d.b2ParticleFlag.b2_waterParticle;
//     // pd.shape = shape;
//     // const group = particleSystem.CreateParticleGroup(pd);
//     // group.
//     // if (pd.flags & box2d.b2ParticleFlag.b2_colorMixingParticle) {
//     //   this.ColorParticleGroup(group, 0);
//     // }



//     // for (let i = 0; i < numParticles; i++) {
//     //   const particle = new Box2DParticle(
//     //     this.face,
//     //     this.world,
//     //     new Point2D(randomIntRange(0, faceWidth), randomIntRange(0, faceHeight)),
//     //     randomColor()
//     //   );
//     //   this.particles.push(particle);
//     // }



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

//   public createWalls() {
//     const boxLeft = -32;
//     const boxRight = 32;
//     const boxBottom = 0;
//     const boxTop = 32;

//     // Create the containing box.
//     var bd = new b2BodyDef;
//     var ground = this.world.CreateBody(bd);

//     var shape = new b2ChainShape;

//     shape.CreateLoop([
//       new b2Vec2(boxLeft, boxBottom),
//       new b2Vec2(boxRight, boxBottom),
//       new b2Vec2(boxRight, boxTop),
//       new b2Vec2(boxLeft, boxTop)
//     ])

//     ground.CreateFixture(shape, 0.0);
//   }

//   // public CreateWalls() {
//   //   // Create the walls of the world.
//   //   const bd = new box2d.b2BodyDef();
//   //   const ground = this.world.CreateBody(bd);

//   //   // Top
//   //   ground.CreateFixture(this.createWall(-10, -10, faceWidth + 20, 10), 0.0);

//   //   // Right
//   //   ground.CreateFixture(this.createWall(faceWidth - 10, -10, 20, faceHeight + 20), 0.0);

//   //   // Bottom
//   //   ground.CreateFixture(this.createWall(-20, faceHeight - 10, faceWidth + 20, 20), 0.0);

//   //   // Left
//   //   ground.CreateFixture(this.createWall(-10, -10, 20, faceHeight + 20), 0.0);
//   // }

//   // createWall(x: number, y: number, width: number, height: number) {
//   //   const shape = new box2d.b2PolygonShape();
//   //   const vertices = [
//   //     new box2d.b2Vec2(x, y),
//   //     new box2d.b2Vec2(x + width, y),
//   //     new box2d.b2Vec2(x + width, y + height),
//   //     new box2d.b2Vec2(x, y + height),
//   //   ];
//   //   shape.Set(vertices, 4);
//   //   return shape;
//   // }

//   update(deltaMs: number) {
//     this.world.Step(deltaMs, 5, 5);

//   }

//   render(matrix: LedMatrixInstance) {
//     const particles = this.particleSystem.GetPositionBuffer();

//     for (let particle of particles) this.face.setPixel(
//       Math.floor(particle.x),
//       Math.floor(particle.y),
//       0xff0000
//     );
//   }
// }

// import { Point2D } from "../maze/Point2D";
// import { LedMatrixInstance } from "rpi-led-matrix";
// import { rgbToHex, randomColor } from "../utils/rendering";
// import { matrixWidth, matrixHeight, faceWidth, faceHeight } from "../utils/const";
// import { CubeFace } from "../utils/CubeFace";
// import { getQuaternionDifference } from "../utils/quaternion";
// import * as box2d from "box2d.ts"


// export class Box2DParticle {

//   public body: box2d.b2Body;

//   constructor(
//     private face: CubeFace,
//     private world: any,
//     startingPosition: Point2D,
//     private color: number
//   ) {
//     // Define body
//     const bd = new box2d.b2BodyDef();
//     bd.type = box2d.b2BodyType.b2_dynamicBody;
//     this.body = world.CreateBody(bd);

//     this.body.SetPosition({ x: 32, y: 32 })

//     const shape = new box2d.b2CircleShape();
//     shape.m_p.Set(1, 1);
//     shape.m_radius = 0.5;
//     this.body.CreateFixture(shape);
//   }

//   public update(delta: number) {

//   }


//   public render() {
//     const pos = this.body.GetPosition();
//     this.face.setPixel(
//       Math.floor(pos.x),
//       Math.floor(pos.y),
//       this.color
//     );
//   }
// }

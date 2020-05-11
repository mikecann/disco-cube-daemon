import { Point2D } from "../maze/Point2D";
import { LedMatrixInstance } from "rpi-led-matrix";
import { rgbToHex, randomColor } from "../utils/rendering";
import { matrixWidth, matrixHeight, faceWidth, faceHeight } from "../utils/const";
import { CubeFace } from "../utils/CubeFace";
import { getQuaternionDifference } from "../utils/quaternion";
import p2 from "p2"

const dampen = 0.5;
const gravity = new Point2D(0, 0.9);

export class P2Particle {

  public body: p2.Body;

  constructor(
    private face: CubeFace,
    startingPosition: Point2D,
    private color: number
  ) {
    this.body = new p2.Body({
      mass: 5,
      position: [startingPosition.x, startingPosition.y]
    });

    const shape = new p2.Circle({ radius: 0.5 });
    this.body.addShape(shape);
  }

  public update(delta: number) {

  }


  public render() {
    this.face.setPixel(
      Math.floor(this.body.interpolatedPosition[0]),
      Math.floor(this.body.interpolatedPosition[1]),
      this.color
    );
  }
}

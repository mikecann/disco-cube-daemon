import { Point2D } from "../maze/Point2D";
import { LedMatrixInstance } from "rpi-led-matrix";
import { rgbToHex, randomColor } from "../utils/rendering";
import { matrixWidth, matrixHeight } from "../utils/const";


export class Particle {

  constructor(public position = Point2D.zero, public velocity = Point2D.zero, private color = randomColor()) {

  }

  public update(delta: number) {
    this.position = this.position.sum(this.velocity.multiplyBy(delta / 32));

    if (this.position.x < 0) {
      this.position = new Point2D(0, this.position.y);
      this.velocity = new Point2D(-this.velocity.x, this.velocity.y)
    }

    if (this.position.y < 0) {
      this.position = new Point2D(this.position.x, 0);
      this.velocity = new Point2D(this.velocity.x, -this.velocity.y)
    }

    if (this.position.x >= matrixWidth) {
      this.position = new Point2D(matrixWidth - 1, this.position.y);
      this.velocity = new Point2D(-this.velocity.x, this.velocity.y)
    }

    if (this.position.y >= matrixHeight) {
      this.position = new Point2D(this.position.x, matrixHeight - 1);
      this.velocity = new Point2D(this.velocity.x, -this.velocity.y)
    }

  }

  public render(matrix: LedMatrixInstance) {
    matrix.fgColor(this.color);
    matrix.setPixel(Math.floor(this.position.x), Math.floor(this.position.y));
  }

}
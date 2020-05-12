import { Cube } from "./Cube";
import { faceLength, bufferSizePerFace, faceNeighbours, faceWidth, faceHeight, faceOrientations } from "./const";
import { Point2D } from "../maze/Point2D";
import { rotatePixel, rgbToHex } from "./rendering";
import { clamp } from "./misc";

export class CubeFace {

  private pixelOffset: number;

  constructor(public readonly cube: Cube, public readonly index: number) {
    this.pixelOffset = index * faceLength;
  }

  fill(color: number) {
    for (let y = 0; y < faceLength; y++) {
      for (let x = 0; x < faceLength; x++) {
        //const indx = ((y * sideLength) + x) * 3;
        this.cube.matrix.fgColor(color);
        this.cube.matrix.setPixel(x, this.pixelOffset + y);
        // buffer[bufferOffset + indx + 0] = r;
        // buffer[bufferOffset + indx + 1] = g;
        // buffer[bufferOffset + indx + 2] = b;
      }
    }
  };


  drawRect(x: number, y: number, width: number, height: number) {
    this.cube.matrix.drawRect(x, this.pixelOffset + y, width, height);
  };

  drawText(text: string, x: number, y: number) {
    this.cube.matrix.drawText(text, x, this.pixelOffset + y);
  };

  setPixel(x: number, y: number, color?: number) {
    if (color != undefined) this.cube.matrix.fgColor(color);

    // Clamp
    x = clamp(x, 0, faceWidth - 1);
    y = clamp(y, 0, faceHeight - 1);

    // Rotate Pixel    
    const pixel = rotatePixel(x, y, faceOrientations[this.index].w);

    // Offet Pixel
    pixel.y += this.pixelOffset;

    this.cube.matrix.setPixel(pixel.x, pixel.y);
  };

  setPixels(rgb: number[]) {
    if (rgb.length != bufferSizePerFace)
      throw new Error(
        `unexpected number of rgb values, there were '${rgb.length}' provided but '${bufferSizePerFace}' expected`
      );

    for (let y = 0; y < faceLength; y++) {
      for (let x = 0; x < faceLength; x++) {
        const index = (faceLength * y + x) * 3;
        const r = rgb[index + 0];
        const g = rgb[index + 1];
        const b = rgb[index + 2];
        this.setPixel(x, y, rgbToHex(r, g, b));
      }
    }
  };

  getFaceForLocalPosition(position: Point2D): CubeFace {
    const neighbours = faceNeighbours[this.index];

    if (position.x < 0)
      return this.cube.faces[neighbours.left];

    if (position.y < 0)
      return this.cube.faces[neighbours.top];

    if (position.x >= faceWidth)
      return this.cube.faces[neighbours.right];

    if (position.y >= faceHeight)
      return this.cube.faces[neighbours.bottom];

    return this;
  }

  getNeighbour(directon: "top" | "bottom" | "left" | "right") {
    const neighbours = faceNeighbours[this.index];
    return this.cube.faces[neighbours[directon]];
  }

  getOrientation() {
    return faceOrientations[this.index];
  }

  drawOrientationCross() {
    const quater = faceLength / 4;
    const half = quater * 2;
    const threequater = quater * 3

    for (let i = quater; i < half; i++)
      this.setPixel(half, i, rgbToHex(255, 50, 50))

    for (let i = half; i < threequater; i++)
      this.setPixel(half, i, rgbToHex(50, 50, 255))

    for (let i = quater; i < half; i++)
      this.setPixel(i, half, rgbToHex(50, 255, 50))

    for (let i = half; i < threequater; i++)
      this.setPixel(i, half, rgbToHex(50, 255, 255))
  }
}


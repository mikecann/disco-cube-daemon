import {
  LedMatrix,
  LedMatrixUtils,
  Font,
  LedMatrixInstance,
  PixelMapperType,
} from "rpi-led-matrix";
import { hang } from "../../src/utils/misc";
import { createMatrix } from "./utils/matrix";
import { randomByte, randomColor, rgbToHex } from "./utils/rendering";
import { faceLength, faceHeight, faceWidth } from "./utils/const";
import { Cube } from "./utils/Cube";
import { Accelerometer } from "./utils/Accelerometer";
import { zeroPad } from "./utils/misc";
import * as jimp from "jimp";

async function bootstrap() {
  const matrix = createMatrix();

  console.log({ w: matrix.width(), h: matrix.height(), len: matrix.width() * matrix.height() * 3 });

  matrix.clear();

  let image = await jimp.read(`${process.cwd()}/apps/images/cubemap3.png`);
  image = image.rotate(-90);

  const cube = new Cube(matrix);

  const pixelOffsets = [
    { x: faceWidth * 1, y: faceHeight * 1 }, // 0
    { x: faceWidth * 0, y: faceHeight * 1 }, // 1
    { x: faceWidth * 1, y: faceHeight * 3 }, // 2
    { x: faceWidth * 1, y: faceHeight * 2 }, // 3
    { x: faceWidth * 2, y: faceHeight * 1 }, // 4
    { x: faceWidth * 1, y: faceHeight * 0 }, // 5
  ]

  for (let faceI = 0; faceI < 6; faceI++) {
    for (let y = 0; y < faceHeight; y++) {
      for (let x = 0; x < faceWidth; x++) {
        const data = image.getPixelColor(pixelOffsets[faceI].x + x, pixelOffsets[faceI].y + y);
        const { r, g, b } = jimp.intToRGBA(data);
        cube.faces[faceI].setPixel(x, y, rgbToHex(r, g, b))
      }
    }
  }

  matrix.sync();

  await hang();
}

bootstrap().catch((e) => console.error(`ERROR: `, e));

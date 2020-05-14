import {
  LedMatrix,
  LedMatrixUtils,
  Font,
  LedMatrixInstance,
  PixelMapperType,
} from "rpi-led-matrix";
import { hang } from "../../../src/utils/misc";
import { createMatrix } from "../utils/matrix";
import { randomByte, randomColor, rgbToHex } from "../utils/rendering";
import { faceLength } from "../utils/const";
import { Cube } from "../utils/Cube";
import { Accelerometer } from "../utils/Accelerometer";
import { zeroPad } from "../utils/misc";

async function bootstrap() {
  const matrix = createMatrix();

  console.log({ w: matrix.width(), h: matrix.height(), len: matrix.width() * matrix.height() * 3 });

  matrix.clear();

  const bigFont = new Font("helvR12", `${process.cwd()}/apps/fonts/spleen-16x32.bdf`);
  const smallFont = new Font("helvR12", `${process.cwd()}/apps/fonts/spleen-5x8.bdf`);

  const cube = new Cube(matrix);

  const accel = new Accelerometer();

  cube.animate(() => {
    for (let i = 0; i < 6; i++) {
      cube.faces[i].fill(rgbToHex(randomByte() * 0.1, randomByte() * 0.1, randomByte() * 0.1));
      cube.faces[i].drawRect(0, 0, faceLength - 1, faceLength - 1);

      matrix.fgColor(rgbToHex(255, 255, 255));

      cube.faces[i].drawRect(0, 0, faceLength - 1, faceLength - 1);

      matrix.font(bigFont);
      cube.faces[i].drawText(i + "", 25, 18);

      matrix.font(smallFont);
      cube.faces[i].drawText(accel.accel.map(n => zeroPad(Math.floor(n * 100), 2)).join(", "), 5, 5)
    }
  });

  await hang();
}

bootstrap().catch((e) => console.error(`ERROR: `, e));

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
import { faceLength } from "./utils/const";
import { Cube } from "./utils/Cube";
import SerialPort from "serialport";
import Readline from "@serialport/parser-readline";
import { clamp } from "./utils/misc"
import { Accelerometer } from "./utils/Accelerometer";

async function bootstrap() {
  const matrix = createMatrix({
    showRefreshRate: false,
  },
    {
      gpioSlowdown: 4,
    });

  console.log({ w: matrix.width(), h: matrix.height(), len: matrix.width() * matrix.height() * 3 });

  matrix.clear();

  const accel = new Accelerometer();

  const cube = new Cube(matrix);

  cube.animate(() => {
    for (let i = 0; i < 6; i++) {
      cube.faces[i].fill(rgbToHex(255 * accel.accel[0], 255 * accel.accel[1], 255 * accel.accel[2]));
    }
  });

  await hang();
}

bootstrap().catch((e) => console.error(`ERROR: `, e));

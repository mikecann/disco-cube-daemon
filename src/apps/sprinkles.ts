import { LedMatrix, LedMatrixUtils, Font, LedMatrixInstance, PixelMapperType } from "rpi-led-matrix";
import { hang } from "../utils/misc";
import { createMatrix } from "../utils/matrix";
import { createCube, randomByte, randomColor } from "../utils/rendering";

const sideLength = 64;

async function bootstrap() {
  const matrix = createMatrix();

  console.log({ w: matrix.width(), h: matrix.height(), len: matrix.width() * matrix.height() * 3 });

  matrix.clear();

  matrix.afterSync((mat, dt, t) => {
    matrix.fgColor(randomColor())
      .setPixel(Math.floor(sideLength * Math.random()), Math.floor(sideLength * 6 * Math.random()))

    return matrix;
  });

  matrix.sync();

  await hang();
}

bootstrap().catch(e => console.error(`ERROR: `, e))
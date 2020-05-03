import { LedMatrix, LedMatrixUtils, Font, LedMatrixInstance, PixelMapperType } from "rpi-led-matrix";
import { hang } from "../../src/utils/misc";
import { createMatrix } from "../../src/utils/matrix";
import { createCube, randomByte, randomColor } from "../../src/utils/rendering";

const sideLength = 64;

async function bootstrap() {
  const matrix = createMatrix();

  console.log({ w: matrix.width(), h: matrix.height(), len: matrix.width() * matrix.height() * 3 });

  matrix.clear();

  matrix.font(new Font('helvR12', `${process.cwd()}/fonts/spleen-16x32.bdf`));

  const cube = createCube(matrix);

  cube.animate(() => {
    for (let i = 0; i < 6; i++) {
      cube.sides[i].fill(randomColor());
      cube.sides[i].drawRect(0, 0, sideLength - 1, sideLength - 1);
      cube.sides[i].drawText(i + "", 25, 18);
    }
  })

  await hang();
}

bootstrap().catch(e => console.error(`ERROR: `, e))
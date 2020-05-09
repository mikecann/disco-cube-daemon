import { LedMatrix, LedMatrixUtils, Font, LedMatrixInstance, PixelMapperType } from "rpi-led-matrix";
import { hang } from "../../src/utils/misc";
import { createMatrix } from "./utils/matrix";
import { createCube, randomByte, randomColor, rgbToHex } from "./utils/rendering";
import { sideLength } from "./utils/const";

async function bootstrap() {
  const matrix = createMatrix();

  console.log({ w: matrix.width(), h: matrix.height(), len: matrix.width() * matrix.height() * 3 });

  matrix.clear();

  matrix.font(new Font('helvR12', `${process.cwd()}/apps/fonts/spleen-16x32.bdf`));

  const cube = createCube(matrix);


  // cube.animate(() => {
  //   for (let i = 0; i < 6; i++) {
  //     cube.sides[i].fill(randomColor());
  //     cube.sides[i].drawRect(0, 0, sideLength - 1, sideLength - 1);

  //     matrix.fgColor(rgbToHex(255, 0, 0));
  //     cube.sides[i].drawRect(0, 0, sideLength - 1, 10);

  //     matrix.fgColor(rgbToHex(0, 255, 0));
  //     cube.sides[i].drawRect(0, sideLength - 1 - 10, sideLength - 1, sideLength - 1);

  //     matrix.fgColor(rgbToHex(0, 0, 255));
  //     cube.sides[i].drawRect(0, 0, 10, sideLength - 1);

  //     matrix.fgColor(rgbToHex(255, 0, 255));
  //     cube.sides[i].drawRect(sideLength - 1 - 10, 0, sideLength - 1, sideLength - 1);

  //     cube.sides[i].drawText(i + "", 25, 18);
  //   }
  // })

  cube.animate(() => {
    for (let i = 0; i < 6; i++) {

      const side = cube.sides[i];


      for (let i = 0; i < sideLength / 2; i++)
        side.setPixel(sideLength / 2, i, rgbToHex(255, 50, 50))

      for (let i = sideLength / 2; i < sideLength; i++)
        side.setPixel(sideLength / 2, i, rgbToHex(50, 50, 255))


      matrix.fgColor(rgbToHex(255, 255, 255));
      cube.sides[i].drawText(i + "", 25, 18);
    }
  })

  await hang();
}

bootstrap().catch(e => console.error(`ERROR: `, e))
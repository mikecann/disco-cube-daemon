import { LedMatrix, LedMatrixUtils, Font, LedMatrixInstance, PixelMapperType } from "rpi-led-matrix";
import { hang } from "../utils/misc";
import { createMatrix } from "../utils/matrix";

const sideLength = 64;

async function bootstrap() {
  const matrix = createMatrix();

  console.log({ w: matrix.width(), h: matrix.height(), len: matrix.width() * matrix.height() * 3 });

  matrix.clear();

  matrix.font(new Font('helvR12', `${process.cwd()}/fonts/spleen-16x32.bdf`));

  fillSides(matrix);
  drawBorders(matrix);
  drawSideNumber(matrix);

  await hang();
}

const fillSides = (matrix: LedMatrixInstance) => {
  const fillWithPixels = (r: number, g: number, b: number) => {
    const arr = new Array(sideLength * sideLength * 3);
    for (let y = 0; y < sideLength; y++) {
      for (let x = 0; x < sideLength; x++) {
        const indx = ((y * sideLength) + x) * 3;
        arr[indx + 0] = r;
        arr[indx + 1] = g;
        arr[indx + 2] = b;
      }
    }
    return arr;
  }

  const buffer = Buffer.of(
    ...[
      ...fillWithPixels(255, 0, 0),
      ...fillWithPixels(0, 255, 0),
      ...fillWithPixels(0, 0, 255),

      ...fillWithPixels(255, 255, 0),
      ...fillWithPixels(255, 0, 255),
      ...fillWithPixels(0, 255, 255),
    ]
  );
  matrix.drawBuffer(buffer).sync();
}

const drawBorders = (matrix: LedMatrixInstance) => {
  for (let i = 0; i < 6; i++) {
    matrix.fgColor(0xFFFFFF)
      .drawRect(0, i * 64, sideLength - 1, sideLength - 1);
  }
  matrix.sync();
}

const drawSideNumber = (matrix: LedMatrixInstance) => {
  for (let i = 0; i < 6; i++) {
    matrix.fgColor(0xFFFFFF)
      .drawText(i + "", 25, 18 + (i * 64))
  }
  matrix.sync();
}

bootstrap().catch(e => console.error(`ERROR: `, e))
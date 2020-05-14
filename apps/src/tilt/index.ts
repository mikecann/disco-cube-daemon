import { hang } from "../../../src/utils/misc";
import { createMatrix } from "../utils/matrix";
import { rgbToHex } from "../utils/rendering";
import { Cube } from "../utils/Cube";
import { Accelerometer } from "../utils/Accelerometer";
import { clamp } from "../utils/misc";

async function bootstrap() {
  const matrix = createMatrix();

  matrix.clear();

  const accel = new Accelerometer();

  const cube = new Cube(matrix);

  let actualR = 0;
  let actualG = 0;
  let actualB = 0;

  const getAxis = (axis: number) => clamp((accel.accel[axis] + 1) / 2, 0, 1);
  const getAxisByte = (axis: number) => Math.floor(clamp(255 * getAxis(axis), 0, 255));

  cube.animate(() => {
    const targetR = getAxisByte(0);
    const targetG = getAxisByte(1);
    const targetB = getAxisByte(2);

    const deltaR = targetR - actualR;
    const deltaG = targetG - actualG;
    const deltaB = targetB - actualB;

    actualR += deltaR * 0.1;
    actualG += deltaG * 0.1;
    actualB += deltaB * 0.1;

    for (let i = 0; i < 6; i++) {
      cube.faces[i].fill(rgbToHex(Math.floor(actualR), Math.floor(actualG), Math.floor(actualB)));
    }
  }, 16);

  await hang();
}

bootstrap().catch((e) => console.error(`ERROR: `, e));

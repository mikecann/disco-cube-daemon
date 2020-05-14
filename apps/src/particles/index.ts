import { hang, narray } from "../../../src/utils/misc";
import { createMatrix } from "../utils/matrix";
import { Simulation } from "./Simulation";
import { Font } from "rpi-led-matrix";
import { Cube } from "../utils/Cube";
import { Accelerometer } from "../utils/Accelerometer";

async function bootstrap() {
  const matrix = createMatrix();

  matrix.font(new Font("helvR12", `${process.cwd()}/apps/fonts/spleen-16x32.bdf`));

  const cube = new Cube(matrix);
  const accel = new Accelerometer();
  const sims = narray(6).map(i => new Simulation(cube.faces[i], accel));

  cube.animate((delta) => {
    matrix.clear();

    for (let i = 0; i < 6; i++) {
      // Draw Orientation Cross
      //cube.faces[i].drawOrientationCross();

      //matrix.fgColor(rgbToHex(255, 255, 255));
      //cube.faces[i].drawText(i + "", 25, 18);
    }

    for (let sim of sims) {
      sim.update(delta);
      sim.render(matrix);
    }

  }, 32);


  await hang();
}

bootstrap().catch((e) => console.error(`ERROR: `, e));


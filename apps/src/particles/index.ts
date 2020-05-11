import { hang } from "../../../src/utils/misc";
import { createMatrix } from "../utils/matrix";
import SerialPort from "serialport";
import Readline from "@serialport/parser-readline";
import { pixelsPerFace, faceLength } from "../utils/const";
import { Simulation } from "./Simulation";
import { createSim } from "./LiquidSimulation";
import { randomColor, rgbToHex } from "../utils/rendering";
import { Font } from "rpi-led-matrix";
import { Cube } from "../utils/Cube";
import { Accelerometer } from "../utils/Accelerometer";
import { Simulation3 } from "../blobs/Simulation3";
import { P2Simulation } from "./P2Simulation";

async function bootstrap() {
  const matrix = createMatrix(
    {
      showRefreshRate: false,
    },
    {
      gpioSlowdown: 3,

    }
  );

  // const port = new SerialPort("/dev/ttyACM0", {
  //   baudRate: 115200,
  // });

  // const parser = new Readline();
  // port.pipe(parser);
  // parser.on("data", console.log);

  matrix.font(new Font("helvR12", `${process.cwd()}/apps/fonts/spleen-16x32.bdf`));

  //const sim = createSim();

  const cube = new Cube(matrix);
  const accel = new Accelerometer();
  const sim = new P2Simulation(cube.faces[0], accel);

  cube.animate((delta) => {
    matrix.clear();

    for (let i = 0; i < 6; i++) {

      // Draw Orientation Cross
      cube.faces[i].drawOrientationCross();

      //matrix.fgColor(rgbToHex(255, 255, 255));
      cube.faces[i].drawText(i + "", 25, 18);
    }

    sim.update(delta);
    sim.render(matrix);
  }, 16);

  await hang();
}

bootstrap().catch((e) => console.error(`ERROR: `, e));


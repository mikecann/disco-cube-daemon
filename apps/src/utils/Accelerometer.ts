import SerialPort from "serialport"; import { clamp } from "lodash";
import Readline from "@serialport/parser-readline";

export class Accelerometer {

  accel: number[] = [];

  constructor() {
    const port = new SerialPort("/dev/ttyACM0", {
      baudRate: 115200,
    });
    const parser = new Readline();

    port.pipe(parser);
    parser.on("data", (data: string) => {
      const parts = data.trim().split(",").map(s => clamp(Number.parseInt(s) / 1000, -1, 1)).map(n => Number.isNaN(n) ? 0 : n)
      if (parts.length != 3) return;
      this.accel = parts;
    });

  }
}
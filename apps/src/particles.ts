import { hang } from "../../src/utils/misc";
import { createMatrix } from "./utils/matrix";
import SerialPort from "serialport";
import Readline from "@serialport/parser-readline"

async function bootstrap() {
  const port = new SerialPort("/dev/ttyACM0", {
    baudRate: 115200,
  });

  const parser = new Readline();
  port.pipe(parser);
  parser.on("data", console.log);

  await hang();
}


bootstrap().catch(e => console.error(`ERROR: `, e))

/*

-32,-28,-1028
-36,-32,-1028
-40,-32,-1036
-36,-24,-1032
-32,-24,-1032
-40,-20,-1020
-36,-24,-1020
-40,-24,-1020
-32,-32,-1032
-32,-32,-1028
-32,-24,-1028

*/
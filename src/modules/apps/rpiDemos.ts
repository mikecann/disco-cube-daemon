import { spawn } from "child_process";
import { RpiDemosState } from "../../sharedTypes";
import * as log4js from 'log4js';

const executablePath = `/home/pi/rpi-rgb-led-matrix`;

const logger = log4js.getLogger(`rpiDemo`);

export const startRpiDemo = (demoId: string) => {
  logger.debug(`starting rpi demo`, demoId);

  const command = `sudo ${executablePath}/examples-api-use/demo -${demoId} --led-rows=64 --led-cols=64 --led-chain=1 --led-parallel=1 --led-slowdown-gpio=2`;

  const proc = spawn(command);

  proc.stdout.on("data", (data) => {
    logger.debug(`rpi demo stdout: ${data}`);
  });

  proc.stderr.on("data", (data) => {
    logger.error(`stderr: ${data}`);
  });

  proc.on("close", (code) => {
    logger.debug(`child process exited with code ${code}`);
  });

  return () => {
    logger.debug(`stopping rpi demo`);
    proc.kill("SIGINT");
  };
};

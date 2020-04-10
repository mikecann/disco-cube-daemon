import { spawn, ChildProcessWithoutNullStreams, exec } from "child_process";
import { RpiDemosState } from "../../sharedTypes";
import * as log4js from "log4js";
import kill from "tree-kill";

const executablePath = `/home/pi/rpi-rgb-led-matrix`;

const logger = log4js.getLogger(`rpiDemo`);

export const startRpiDemo = (demoId: string) => {
  logger.debug(`starting rpi demo`, demoId);

  //const command = `sudo ${executablePath}/examples-api-use/demo -${demoId} --led-rows=64 --led-cols=64 --led-chain=1 --led-parallel=1 --led-slowdown-gpio=2`;

  // const proc = exec(command, (error, stdout, stderr) => {
  //   logger.debug(`command finished`, { error, stdout, stderr });
  // });

  let proc: ChildProcessWithoutNullStreams | undefined = undefined;
  try {
    proc = spawn(`sudo`, [
      `${executablePath}/examples-api-use/demo`,
      `-${demoId}`,
      `--led-rows=64`,
      `--led-cols=64`,
      `--led-chain=2`,
      `--led-parallel=3`,
      // `--led-brightness=80`,
      `--led-slowdown-gpio=2`,
    ]);

    proc.stdout.on("data", (data) => {
      logger.debug(`rpi demo stdout: ${data}`);
    });

    proc.stderr.on("data", (data) => {
      logger.error(`stderr: ${data}`);
    });

    proc.on("close", (code) => {
      logger.debug(`child process exited with code ${code}`);
    });
  } catch (e) {
    logger.error(`rpi demo spawn error`, e);
  }

  return () => {
    logger.debug(`stopping rpi demo`);
    if (proc) kill(proc.pid);
  };
};

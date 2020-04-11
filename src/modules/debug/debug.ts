import { spawn, ChildProcessWithoutNullStreams, exec } from "child_process";
import * as log4js from "log4js";
import kill from "tree-kill";

const logger = log4js.getLogger(`debugApp`);

export const startDebugApp = () => {
  logger.debug(`starting..`);

  let proc: ChildProcessWithoutNullStreams | undefined = undefined;
  try {
    proc = spawn(`/usr/bin/node`, [
      // `-r`,
      // `${process.cwd()}/node_modules/ts-node/register`,
      `${process.cwd()}/dist/apps/debug.js`,
    ]);

    proc.stdout.on("data", (data) => {
      logger.debug(`stdout: ${data}`);
    });

    proc.stderr.on("data", (data) => {
      logger.error(`stderr: ${data}`);
    });

    proc.on("close", (code) => {
      logger.debug(`child process exited with code ${code}`);
    });
  } catch (e) {
    logger.error(`spawn error`, e);
  }

  return () => {
    logger.debug(`stopping..`);
    if (proc) kill(proc.pid);
  };
};

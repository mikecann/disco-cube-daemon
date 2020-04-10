import * as log4js from "log4js";

const logger = log4js.getLogger(`shutdown`);

export let isStopped = false;

export const setupShutdown = (cb: () => any) => {
  process.on("SIGTERM", stopHandler);
  process.on("SIGINT", stopHandler);
  process.on("SIGHUP", stopHandler);
  //process.on("exit", stopHandler);

  async function stopHandler() {
    logger.debug("Stopping...");
    isStopped = true;
    cb();
    process.exit(1);
  }
};

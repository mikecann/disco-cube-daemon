import { spawn } from "child_process";
import * as log4js from "log4js";

const logger = log4js.getLogger(`fixSerialPermission`);

export const fixSerialPermission = async () => {
  logger.info("running sh..")
  await spawn(`sh`, [`${process.cwd()}/fixserial.sh`]);
}
import {
  initFirebase,
  signInToFirebase,
  startReportingPresenceToFirebase,
  updateFirebaseState,
} from "./modules/firebase";
import { config } from "./config/config";
import { monitorSystemInfo } from "./modules/systemInfo";
import { initTerminalState, beginRespondingToTerminalCommands } from "./modules/terminal";
import { initAppState, startAppService } from "./modules/apps";
import { setupShutdown } from "./utils/shutdown";
import * as log4js from "log4js";
import { configLogger } from "./utils/logging";
import { isRoot } from "./utils/misc";

configLogger();

const logger = log4js.getLogger(`bootstrap`);

async function bootstrap() {
  logger.info(` `);
  logger.info(`starting up...`, { cwd: process.cwd() });

  if (!isRoot()) {
    logger.error(`must be run as root user (sudo)`);
    process.exit(1);
  }

  const app = initFirebase();

  setupShutdown(() => {
    app.delete();
  });

  logger.info("starting up..");

  logger.info(`authenticating..`);

  await signInToFirebase(config.FIREBASE_EMAIL, config.FIREBASE_PASSWORD);

  logger.info("authenticated");

  startReportingPresenceToFirebase();

  // Terminal
  await initTerminalState();
  beginRespondingToTerminalCommands();

  // Apps
  await initAppState();
  startAppService();

  // System infos
  monitorSystemInfo(
    (allInfo) => updateFirebaseState("cubes", { fullSystemInfoJson: JSON.stringify(allInfo) }),
    (essentialSystemInfo) => updateFirebaseState("cubes", { essentialSystemInfo })
  );

  setInterval(() => { }, 1000);
}

bootstrap().catch((e: any) => {
  logger.error(`bootstrap caught error`, e);
  process.exit(1);
});

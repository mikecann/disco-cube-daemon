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

const logger = log4js.getLogger(`bootstrap`);

async function bootstrap() {
  setupShutdown();

  logger.info("starting up..");

  initFirebase();

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

  setInterval(() => {}, 1000);
}

bootstrap().catch((e: any) => {
  logger.error(`bootstrap caught error`, e);
  process.exit(1);
});

import {
  initFirebase,
  signInToFirebase,
  startReportingPresenceToFirebase,
  signOutOfFirebase,
  updateFirebaseState,
} from "./modules/firebase";
import { config } from "./config/config";
import { monitorSystemInfo } from "./modules/systemInfo";
import { initTerminalState, beginRespondingToTerminalCommands } from "./modules/terminal";
import { initAppState, startAppService } from "./modules/apps";
import { logger } from "./utils/logging";

const handleError = (e: any) => {
  console.error(e);
  process.exit(1);
};

async function bootstrap() {
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

bootstrap().catch(handleError);

var cleanExit = function() { process.exit() };
process.on('SIGINT', cleanExit); // catch ctrl-c
process.on('SIGTERM', cleanExit); // catch kill
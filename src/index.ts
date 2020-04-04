import {
  initFirebase,
  listenForCubeSnapshots,
  signInToFirebase,
  startReportingPresenceToFirebase,
  signOutOfFirebase,
  updateFirebaseCubeState,
} from "./modules/firebase";
import { config } from "./config/config";
import { monitorSystemInfo } from "./modules/systemInfo";

async function bootstrap() {
  console.log("starting up..");

  initFirebase();

  console.log(`authenticating..`);

  await signInToFirebase(config.FIREBASE_EMAIL, config.FIREBASE_PASSWORD);

  console.log("authenticated");

  startReportingPresenceToFirebase();

  monitorSystemInfo(
    (allInfo) => updateFirebaseCubeState({ fullSystemInfoJson: JSON.stringify(allInfo) }),
    (essentialSystemInfo) => updateFirebaseCubeState({ essentialSystemInfo })
  );

  //await new Promise((resolve) => {});

  //process.exit();
}

bootstrap();

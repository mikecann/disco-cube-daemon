import { initFirebase, listenForCubeSnapshots } from "./modules/firebase";
import { cubeSnapshotChanged } from "./modules/cube";

async function bootstrap() {
  console.log("BOOOT");

  initFirebase();

  

  listenForCubeSnapshots(cube => {
    if (cube) cubeSnapshotChanged(cube);
  });

  process.exit();
}

bootstrap();

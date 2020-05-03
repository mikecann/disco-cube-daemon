import { hang } from "../../src/utils/misc";
import { onUpdateCommand } from "../../src/modules/utils";

async function bootstrap() {
  console.log("MOCK APP STARTED");

  onUpdateCommand((state) => {
    console.log(`MOCK APP GOT UPDATE COMMAND`, state);
  });

  await hang();
}

bootstrap().catch((e) => console.error(`ERROR: `, e));

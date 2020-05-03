import { hang } from "../../src/utils/misc";

async function bootstrap() {
  console.log("MOCK APP STARTED");

  await hang();
}

bootstrap().catch((e) => console.error(`ERROR: `, e));

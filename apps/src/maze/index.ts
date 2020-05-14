import { Game } from "./Game";
import { hang } from "../../../src/utils/misc";
import { createMatrix } from "../utils/matrix";

async function bootstrap() {
  const matrix = createMatrix();

  const game = new Game(matrix);
  game.init();
  game.start();

  await hang();
}

bootstrap().catch((e) => console.error(`ERROR: `, e));

import { Game } from "./Game";
import { hang } from "../../../src/utils/misc";
import { createMatrix } from "../utils/matrix";

async function bootstrap() {
  const matrix = createMatrix({
    showRefreshRate: false
  });

  console.log({ w: matrix.width(), h: matrix.height(), len: matrix.width() * matrix.height() * 3 });

  const game = new Game(matrix);
  game.init();
  game.start();

  await hang();
}


bootstrap().catch(e => console.error(`ERROR: `, e))

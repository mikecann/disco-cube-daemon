import { hang } from "../../utils/misc";
import { createMatrix } from "../../utils/matrix";
import { Game } from "./Game";

async function bootstrap() {
  const matrix = createMatrix();

  console.log({ w: matrix.width(), h: matrix.height(), len: matrix.width() * matrix.height() * 3 });



  const game = new Game(matrix);
  game.init();
  game.start();

  await hang();
}


bootstrap().catch(e => console.error(`ERROR: `, e))

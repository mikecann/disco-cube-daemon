import { hang } from "../../src/utils/misc";
import { createMatrix } from "./utils/matrix";
import { onUpdateCommand } from "../../src/modules/utils";
import { createCube } from "./utils/rendering";
import { PaintAppState } from "../../src/sharedTypes"



async function bootstrap() {
  const matrix = createMatrix({
    showRefreshRate: false
  });

  console.log({ w: matrix.width(), h: matrix.height(), len: matrix.width() * matrix.height() * 3 });

  const cube = createCube(matrix);


  onUpdateCommand<PaintAppState>((state) => {
    const side = cube.sides[state.face];
    if (!side) throw new Error(`invlid cube side: ` + state.face);
    const pixels: number[] = Object.values(state.data)
    side.setPixels(pixels)

    matrix.sync();

  });




  await hang();
}


bootstrap().catch(e => console.error(`ERROR: `, e))
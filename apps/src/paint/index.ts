import { hang } from "../../../src/utils/misc";
import { createMatrix } from "../utils/matrix";
import { onUpdateCommand } from "../../../src/modules/utils";
import { PaintAppState } from "../../../src/sharedTypes";
import { Cube } from "../utils/Cube";

async function bootstrap() {
  const matrix = createMatrix();

  const cube = new Cube(matrix);

  onUpdateCommand<PaintAppState>((state) => {
    const side = cube.faces[state.face];
    if (!side) throw new Error(`invlid cube side: ` + state.face);
    const pixels: number[] = Object.values(state.data);
    side.setPixels(pixels);

    matrix.sync();
  });

  await hang();
}

bootstrap().catch((e) => console.error(`ERROR: `, e));

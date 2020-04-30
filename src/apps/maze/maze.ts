import { LedMatrix, LedMatrixUtils, Font, LedMatrixInstance, PixelMapperType } from "rpi-led-matrix";
import { hang } from "../../utils/misc";
import { createMatrix } from "../../utils/matrix";
import { Maze } from "./generator";

const sideLength = 64;

async function bootstrap() {
  const matrix = createMatrix();

  console.log({ w: matrix.width(), h: matrix.height(), len: matrix.width() * matrix.height() * 3 });

  matrix.clear();


  fillSides(matrix);
  drawBorders(matrix);

  const maze = new Maze(64, 64);
  drawMaze(maze, matrix);

  await hang();
}

const fillSides = (matrix: LedMatrixInstance) => {
  const fillWithPixels = (r: number, g: number, b: number) => {
    const arr = new Array(sideLength * sideLength * 3);
    for (let y = 0; y < sideLength; y++) {
      for (let x = 0; x < sideLength; x++) {
        const indx = ((y * sideLength) + x) * 3;
        arr[indx + 0] = r;
        arr[indx + 1] = g;
        arr[indx + 2] = b;
      }
    }
    return arr;
  }

  const buffer = Buffer.of(
    ...[
      ...fillWithPixels(255, 0, 0),
      ...fillWithPixels(0, 255, 0),
      ...fillWithPixels(0, 0, 255),

      ...fillWithPixels(255, 255, 0),
      ...fillWithPixels(255, 0, 255),
      ...fillWithPixels(0, 255, 255),
    ]
  );
  matrix.drawBuffer(buffer).sync();
}

const drawBorders = (matrix: LedMatrixInstance) => {
  for (let i = 0; i < 6; i++) {
    matrix.fgColor(0xFFFFFF)
      .drawRect(0, i * 64, sideLength - 1, sideLength - 1);
  }
  matrix.sync();
}

const drawMaze = (maze: Maze, matrix: LedMatrixInstance) => {
  const tile_size = 1;

  for (let i = 0; i < maze.edges.length; i++) {
    let x1 = maze.edges[i].left % maze.width;
    let y1 = (maze.edges[i].left - x1) / maze.width;

    ctx.fillRect(2 * x1 * tile_size + tile_size, 2 * y1 * tile_size + tile_size, tile_size, tile_size);

    let x2 = maze.edges[i].right % maze.width;
    let y2 = (maze.edges[i].right - x2) / maze.width;

    ctx.fillRect(2 * x2 * tile_size + tile_size, 2 * y2 * tile_size + tile_size, tile_size, tile_size);

    ctx.fillRect((x1 + x2) * tile_size + tile_size, (y1 + y2) * tile_size + tile_size, tile_size, tile_size);
  }


  matrix.sync();
}

bootstrap().catch(e => console.error(`ERROR: `, e))
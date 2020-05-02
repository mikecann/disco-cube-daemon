import { hang } from "../utils/misc";
import { createMatrix } from "../utils/matrix";
import { randomColor } from "../utils/rendering";

class Pulser {
  constructor(
    readonly x: number,
    readonly y: number,
    readonly f: number
  ) { }

  nextColor(t: number): number {
    const brightness = 0xFF & Math.max(0, (255 * (Math.sin(this.f * t / 1000))));
    return (brightness << 16) | (brightness << 8) | brightness;
  }
}

async function bootstrap() {
  const matrix = createMatrix();

  console.log({ w: matrix.width(), h: matrix.height(), len: matrix.width() * matrix.height() * 3 });

  matrix.clear();

  const pulsers: Pulser[] = [];

  for (let x = 0; x < matrix.width(); x++) {
    for (let y = 0; y < matrix.height(); y++) {
      pulsers.push(new Pulser(x, y, 5 * Math.random()));
    }
  }

  matrix.afterSync((mat, dt, t) =>
    pulsers.map(pulser => {
      matrix.fgColor(pulser.nextColor(t)).setPixel(pulser.x, pulser.y);
    })
  );

  matrix.sync();

  await hang();
}


bootstrap().catch(e => console.error(`ERROR: `, e))
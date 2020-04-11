import { LedMatrix, LedMatrixUtils, PixelMapperType } from "rpi-led-matrix";
import { hang } from "../utils/misc";

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

const sideLength = 64;

async function bootstrap() {
  const matrix = new LedMatrix(
    {
      ...LedMatrix.defaultMatrixOptions(),
      rows: sideLength,
      cols: sideLength,
      chainLength: 2,
      parallel: 3,
      pixelMapperConfig: LedMatrixUtils.encodeMappers({ type: PixelMapperType.U }),
    },
    {
      ...LedMatrix.defaultRuntimeOptions(),
      gpioSlowdown: 2,
    }
  );

  console.log({ w: matrix.width(), h: matrix.height(), len: matrix.width() * matrix.height() * 3 });

  matrix.clear().brightness(100);

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
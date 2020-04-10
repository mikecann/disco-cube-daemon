import * as log4js from "log4js";
import { LedMatrix, GpioMapping, LedMatrixUtils, PixelMapperType } from 'rpi-led-matrix';

const logger = log4js.getLogger(`rpiDemo`);

class Pulser {
  constructor(
    readonly x: number,
    readonly y: number,
    readonly f: number
  ) { }

  nextColor(t: number): number {
    /** You could easily work position-dependent logic into this expression */
    const brightness = 0xFF & Math.max(0, (255 * (Math.sin(this.f * t / 1000))));

    return (brightness << 16) | (brightness << 8) | brightness;
  }
}


export const startDebugApp = () => {
  logger.debug(`starting debug`);

  const matrix = new LedMatrix(
    {
      ...LedMatrix.defaultMatrixOptions(),
      rows: 64,
      cols: 64,
      chainLength: 2,
      parallel: 3,
      //hardwareMapping: GpioMapping.AdafruitHatPwm,
      //pixelMapperConfig: LedMatrixUtils.encodeMappers({ type: PixelMapperType.U }),
    },
    {
      ...LedMatrix.defaultRuntimeOptions(),
      gpioSlowdown: 1,
    }
  );

  matrix.clear().brightness(100);

  // const makeSide = () => {
  //   const color = Math.floor(Math.random() * 0xFFFFFF)
  //   return [...Array(64 * 64 * 3).keys()].map(() => color)
  // }

  // const buffer = Buffer.of(...[
  //   ...makeSide(),
  //   ...makeSide(),
  //   ...makeSide(),
  //   ...makeSide(),
  //   ...makeSide(),
  //   ...makeSide()
  // ]
  // );

  // matrix.drawBuffer(buffer).sync();

  matrix.fgColor(0xFFFFFF)

    // .bgColor({ r: 255, g: 0, b: 0 })
    .fgColor({ r: 255, g: 0, b: 0 })
    .drawRect(0, 0, 64, 64)
    .fill()

    // .bgColor({ r: 255, g: 255, b: 0 })
    .fgColor({ r: 255, g: 255, b: 0 })
    .drawRect(64, 0, 64, 64)
    .fill()

    // .bgColor({ r: 255, g: 0, b: 255 })
    .fgColor({ r: 255, g: 0, b: 255 })
    .drawRect(128, 0, 64, 64)
    .fill()

    // .bgColor({ r: 255, g: 255, b: 255 })
    .fgColor({ r: 255, g: 255, b: 255 })
    .drawRect(0, 64, 64, 64)
    .fill()

    // .bgColor({ r: 0, g: 255, b: 0 })
    .fgColor({ r: 0, g: 255, b: 0 })
    .drawRect(64, 64, 64, 64)
    .fill()

    // .bgColor({ r: 0, g: 255, b: 255 })
    .fgColor({ r: 0, g: 255, b: 255 })
    .drawRect(128, 64, 64, 64)
    .fill()

  matrix.sync();


  return () => {
    logger.debug(`stopping debug app`);
  };
}


import { MatrixOptions, LedMatrix, LedMatrixUtils, PixelMapperType, RuntimeOptions } from "rpi-led-matrix";


export const defaultMatrixOptions: MatrixOptions = {
  ...LedMatrix.defaultMatrixOptions(),
  rows: 64,
  cols: 64,
  chainLength: 2,
  parallel: 3,
  pixelMapperConfig: LedMatrixUtils.encodeMappers({ type: PixelMapperType.U }),
  showRefreshRate: true,
  pwmDitherBits: 2,
  brightness: 100
} as const

export const defaultMatrixRuntimeOptions: RuntimeOptions = {
  ...LedMatrix.defaultRuntimeOptions(),
  gpioSlowdown: 2,
} as const

export const createMatrix = (overrides?: Partial<MatrixOptions>) => new LedMatrix(
  { ...defaultMatrixOptions, ...overrides },
  defaultMatrixRuntimeOptions
);

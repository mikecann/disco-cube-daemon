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

export const createMatrix = (matrixOptionOverrides?: Partial<MatrixOptions>, runtimeOverrides?: Partial<RuntimeOptions>) => new LedMatrix(
  { ...defaultMatrixOptions, ...matrixOptionOverrides },
  { ...defaultMatrixRuntimeOptions, ...runtimeOverrides }
);

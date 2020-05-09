export const sideLength = 64;
export const sideWidth = sideLength;
export const sideHeight = sideLength;
export const pixelsPerSide = sideWidth * sideHeight;
export const sidesCount = 6;
export const bufferSizePerSize = pixelsPerSide * 3;
export const totalBufferSize = bufferSizePerSize * sidesCount;

export const matrixWidth = sideWidth;
export const matrixHeight = sideHeight * sidesCount
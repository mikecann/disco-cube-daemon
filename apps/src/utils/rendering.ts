import { LedMatrixInstance } from "rpi-led-matrix";
import { narray } from "../../../src/utils/misc";

const sideLength = 64;
const sidesCount = 6;
const pixelCount = sideLength * sideLength;
const bufferSizePerSize = pixelCount * 3;
const totalBufferSize = bufferSizePerSize * sidesCount;

export const createCubeSide = (matrix: LedMatrixInstance, sideIndex: number) => {
  //const bufferOffset = sideIndex * bufferSizePerSize;
  const pixelOffset = sideIndex * sideLength;

  const fill = (color: number) => {
    for (let y = 0; y < sideLength; y++) {
      for (let x = 0; x < sideLength; x++) {
        //const indx = ((y * sideLength) + x) * 3;
        matrix.fgColor(color);
        matrix.setPixel(x, pixelOffset + y);
        // buffer[bufferOffset + indx + 0] = r;
        // buffer[bufferOffset + indx + 1] = g;
        // buffer[bufferOffset + indx + 2] = b;
      }
    }
  }

  const drawRect = (x: number, y: number, width: number, height: number) =>
    matrix.fgColor(0xFFFFFF).drawRect(x, pixelOffset + y, width, height);

  const drawText = (text: string, x: number, y: number) =>
    matrix.fgColor(0xFFFFFF)
      .drawText(text, x, pixelOffset + y)

  const setPixel = (x: number, y: number, color: number) => matrix.fgColor(color).setPixel(x, pixelOffset + y);

  const setPixels = (rgb: number[]) => {
    if (rgb.length != bufferSizePerSize)
      throw new Error(`unexpected number of rgb values, there were '${rgb.length}' provided but '${bufferSizePerSize}' expected`)

    for (let y = 0; y < sideLength; y++) {
      for (let x = 0; x < sideLength; x++) {
        const index = ((sideLength * y) + x) * 3;
        const r = rgb[index + 0];
        const g = rgb[index + 1];
        const b = rgb[index + 2];
        setPixel(x, y, rgbToHex(r, g, b));
      }
    }
  }

  return {
    fill,
    drawRect,
    drawText,
    setPixel,
    setPixels
  }

}

export const createCube = (matrix: LedMatrixInstance) => {

  //const buffer = new Uint8Array(totalBufferSize);
  const sides = narray(sidesCount).map(i => createCubeSide(matrix, i));

  //const drawBuffer = () => matrix.drawBuffer(buffer);

  const animate = (renderfn: () => any, msPerFrame = 100, ) => {
    let timeSinceLastFrame = 0;
    matrix.afterSync((mat, dt, t) => {

      timeSinceLastFrame += dt;
      if (timeSinceLastFrame > 100) {
        timeSinceLastFrame = 0;
        renderfn();
      }

      return matrix;
    });

    matrix.sync();
  }

  return {
    sides,
    animate
  }

}

export const randomByte = () => Math.floor(255 * Math.random());

export const randomColor = () => rgbToHex(randomByte(), randomByte(), randomByte());

export const rgbToHex = (rByte: number, gByte: number, bByte: number) => {
  const r = 0xFF & rByte;
  const g = 0xFF & gByte;
  const b = 0xFF & bByte;
  return (r << 16) | (g << 8) | b;
}

export const multiplyColor = (color: number, scalar: number) => {
  const red = (color & 0xFF0000) >> 16;
  const green = (color & 0x00FF00) >> 8;
  const blue = (color & 0x0000FF);
  return rgbToHex(red * scalar, green * scalar, blue * scalar);
} 
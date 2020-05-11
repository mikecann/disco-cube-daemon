import { LedMatrixInstance } from "rpi-led-matrix";
import { narray } from "../../../src/utils/misc";
import { faceLength, bufferSizePerFace, facesCount, faceWidth, faceHeight } from "./const";




type Point2D = {
  x: number;
  y: number;
};

export const rotatePixelCW = (pixel: Point2D) => {
  return {
    x: faceLength - 1 - pixel.y,
    y: pixel.x,
  };
};

export const rotatePixel = (x: number, y: number, degrees: number) => {
  let pixel = { x, y };
  for (let i = 0; i < Math.floor(degrees / 90); i++) pixel = rotatePixelCW(pixel);
  return pixel;
};

export const randomByte = () => Math.floor(255 * Math.random());

export const randomColor = () => rgbToHex(randomByte(), randomByte(), randomByte());

export const rgbToHex = (rByte: number, gByte: number, bByte: number) => {
  const r = 0xff & rByte;
  const g = 0xff & gByte;
  const b = 0xff & bByte;
  return (r << 16) | (g << 8) | b;
};

export const multiplyColor = (color: number, scalar: number) => {
  const red = (color & 0xff0000) >> 16;
  const green = (color & 0x00ff00) >> 8;
  const blue = color & 0x0000ff;
  return rgbToHex(red * scalar, green * scalar, blue * scalar);
};

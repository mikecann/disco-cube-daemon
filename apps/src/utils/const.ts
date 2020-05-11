import { Quaternion } from "./quaternion";

export const faceLength = 64;
export const faceWidth = faceLength;
export const faceHeight = faceLength;
export const pixelsPerFace = faceWidth * faceHeight;
export const facesCount = 6;
export const bufferSizePerFace = pixelsPerFace * 3;
export const totalBufferSize = bufferSizePerFace * facesCount;

export const matrixWidth = faceWidth;
export const matrixHeight = faceHeight * facesCount;

type FaceNeighbours = {
  "top": number,
  "bottom": number,
  "left": number,
  "right": number,
}

export const faceNeighbours: FaceNeighbours[] = [{
  top: 5,
  bottom: 3,
  left: 1,
  right: 4
}, {
  top: 5,
  bottom: 3,
  left: 2,
  right: 0
}, {
  top: 3,
  bottom: 5,
  left: 1,
  right: 4
}, {
  top: 0,
  bottom: 2,
  left: 1,
  right: 4
},
{
  top: 5,
  bottom: 3,
  left: 0,
  right: 2
},
{
  top: 2,
  bottom: 0,
  left: 1,
  right: 4
}
]

export const faceOrientations: Quaternion[] = [
  { x: 0, y: 0, z: 0, w: 0 }, // 0
  { x: 0, y: 0, z: -90, w: 270 }, // 1
  { x: 180, y: 0, z: 0, w: 0 }, // 2
  { x: 90, y: 0, z: 0, w: 90 }, // 3
  { x: 0, y: 0, z: 90, w: 0 }, // 4
  { x: 90, y: 0, z: 0, w: 90 }, // 5
] 
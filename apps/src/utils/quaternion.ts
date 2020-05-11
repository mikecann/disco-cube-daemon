export type Quaternion = {
  x: number,
  y: number,
  z: number,
  w: number
}

export const getQuaternionDifference = (q1: Quaternion, q2: Quaternion): Quaternion => ({
  x: q2.x - q1.x,
  y: q2.y - q1.y,
  z: q2.z - q1.z,
  w: q2.w - q1.w,
})

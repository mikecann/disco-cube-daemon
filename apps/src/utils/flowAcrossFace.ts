import { Point2D } from "../maze/Point2D";
import { CubeFace } from "./CubeFace";
import { getQuaternionDifference } from "./quaternion";
import { faceWidth, faceHeight } from "./const";

type Input = {
  position: Point2D;
  velocity: Point2D;
  face: CubeFace;
}

type Output = {
  position: Point2D;
  velocity: Point2D;
  face: CubeFace;
}

export const flowAcrossFace = ({ position, velocity, face }: Input): Output => {

  if (position.x < 0) {
    const prevFace = face;
    face = face.getNeighbour("left");
    const diff = getQuaternionDifference(prevFace.getOrientation(), face.getOrientation());
    // console.log("left", prevFace.index, face.index, diff, position.y);

    position = position.setX(faceWidth + position.x);

    if (prevFace.index == 1) {
      position = new Point2D(faceWidth - position.x, faceWidth - position.y);
      velocity = new Point2D(-velocity.x, -velocity.y);
    }
    else if (prevFace.index == 5) {
      position = position.rotateCCW();
      velocity = new Point2D(velocity.y, -velocity.x);
    }
    else if (prevFace.index == 3) {
      position = position.rotateCW();
      velocity = new Point2D(-velocity.y, velocity.x);
    }
    else if (prevFace.index == 2) {
      position = position.rotateCW().rotateCW();
      velocity = new Point2D(-velocity.x, -velocity.y);
    }
  }

  if (position.x >= faceWidth) {
    const prevFace = face;
    face = face.getNeighbour("right");
    const diff = getQuaternionDifference(prevFace.getOrientation(), face.getOrientation());
    // console.log("right", prevFace.index, face.index, diff, position.y);

    position = position.setX(position.x - faceWidth);

    if (prevFace.index == 5) {
      position = position.rotateCW();
      velocity = new Point2D(-velocity.y, velocity.x);
    }
    else if (prevFace.index == 3) {
      position = position.rotateCCW();
      velocity = new Point2D(velocity.y, -velocity.x);
    }
    else if (prevFace.index == 2) {
      position = position.rotateCW().rotateCW();
      velocity = new Point2D(-velocity.x, -velocity.y);
    }
    else if (prevFace.index == 4) {
      position = position.rotateCW().rotateCW();
      velocity = new Point2D(-velocity.x, -velocity.y);
    }
  }

  if (position.y < 0) {
    const prevFace = face;
    face = face.getNeighbour("top");
    const diff = getQuaternionDifference(prevFace.getOrientation(), face.getOrientation());
    // console.log("top", prevFace.index, face.index, diff, position.y);

    position = position.setY(faceHeight + position.y);

    if (prevFace.index == 1) {
      position = new Point2D(faceWidth - position.y, position.x);
      velocity = new Point2D(-velocity.y, velocity.x);
    }
    else if (prevFace.index == 4) {
      position = position.rotateCCW();
      velocity = new Point2D(velocity.y, -velocity.x);
    }
  }

  if (position.y >= faceHeight) {
    const prevFace = face;
    face = face.getNeighbour("bottom");
    const orientationDiff = getQuaternionDifference(prevFace.getOrientation(), face.getOrientation());
    // console.log("bottom", prevFace.index, face.index, orientationDiff, position.y);

    position = position.setY(position.y - faceHeight);

    if (prevFace.index == 1) {
      position = new Point2D(position.y, faceHeight - position.x);
      velocity = new Point2D(velocity.y, -velocity.x);
    }
    else if (prevFace.index == 4) {
      position = position.rotateCW();
      velocity = new Point2D(-velocity.y, velocity.x);
    }
  }

  return { position, velocity, face }
}
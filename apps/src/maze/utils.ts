import { Point2D } from "./Point2D";

export const sortPossibleDirections = (directions: Point2D[], sortFn: (dir: Point2D) => number) =>
  directions.map(dir => ({ dir, score: sortFn(dir) })).sort((a, b) => b.score - a.score).map(o => o.dir)
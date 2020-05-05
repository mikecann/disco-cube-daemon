import "array-flat-polyfill";
import { Maze } from "./Maze";
import { LedMatrix, LedMatrixInstance } from "rpi-led-matrix/dist/types";
import { Spider } from "./Spider";
import { Point2D } from "./Point2D";
import { MrNibbles } from "./MrNibbles";
import { Nibble } from "./Nibble";
import { SuperNibble } from "./SuperNibble";
import { narray } from "../../../src/utils/misc";
import { createCube } from "../utils/rendering";
import { CollisionMap } from "./CollisionMap";

const sideLength = 64;

export class Game {

  public maze: Maze;
  public collision: CollisionMap;

  public spiders: Spider[];
  public mrNibbles: MrNibbles;
  public nibbles: Nibble[];
  public superNibbles: SuperNibble[];

  public spawnPoint: Point2D;

  constructor(private matrix: LedMatrixInstance) {
  }

  init() {
    const cellsW = (sideLength / 2) - 1
    const cellsH = ((sideLength * 6) / 2) - 1

    this.maze = new Maze(cellsW, cellsH);
    this.collision = new CollisionMap(this.maze);

    this.spiders = narray(10).map(_ => new Spider(this));

    //this.spawnPoint = this.maze.getRandomPoint();
    //this.mrNibbles = new MrNibbles(this);
    //this.superNibbles = narray(10).map(_ => new SuperNibble(this.maze, this.maze.getRandomPoint()))
    // this.nibbles = this.collision.map((row, y) => row.filter(c => c == true).map((cell, x) =>
    //   new Nibble(this.maze, new Point2D(x, y)))
    // ).flat();
  }

  private update() {
    this.spiders.forEach(s => s.update());
  }

  private render() {
    this.collision.renderWalls(this.matrix);
    //this.nibbles.forEach(s => s.render(this.matrix));
    //this.superNibbles.forEach(s => s.render(this.matrix));
    this.spiders.forEach(s => s.render(this.matrix));
    //this.mrNibbles.render(this.matrix);
  }

  start() {
    createCube(this.matrix).animate(() => {
      this.update();
      this.render();
    })
  }
}

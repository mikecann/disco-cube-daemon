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
import { shuffle } from "../../../src/utils/misc"

const sideLength = 64;
const sides = 6;
const superNibblesPerSize = 30;
const superNibbles = sides * superNibblesPerSize;
const spidersPerSize = 6;
const spiders = sides * spidersPerSize;

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

    this.spiders = narray(spiders).map(_ => new Spider(this));

    this.mrNibbles = new MrNibbles(this);
    this.nibbles = this.collision.enumerateCells().filter(o => !o.isWall).map(o => new Nibble(o.pos));
    this.superNibbles = shuffle(this.nibbles).slice(0, superNibbles).map(o => new SuperNibble(o.position));
  }

  private update() {
    this.spiders.forEach(s => s.update());
    this.mrNibbles.update();
  }

  private render() {
    this.collision.renderWalls(this.matrix);
    this.nibbles.forEach(s => s.render(this.matrix));
    this.superNibbles.forEach(s => s.render(this.matrix));
    this.spiders.forEach(s => s.render(this.matrix));
    this.mrNibbles.render(this.matrix);
  }

  public destoryNibble(nibble: Nibble) {
    this.nibbles = this.nibbles.filter(n => n != nibble);
  }

  public destorySuperNibble(nibble: SuperNibble) {
    this.superNibbles = this.superNibbles.filter(n => n != nibble);
  }

  public destroySpider(spider: Spider) {
    this.spiders = this.spiders.filter(n => n != spider);
  }

  start() {
    createCube(this.matrix).animate(() => {
      this.update();
      this.render();
    })
  }
}

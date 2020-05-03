/**
 * Some of this is borrowed from: https://github.com/bestguy/generate-maze/blob/master/src/generate-maze.js
 */

import _ from 'lodash';
import { Point2D } from './Point2D';
import { LedMatrixInstance } from 'rpi-led-matrix';
import { rgbToHex } from '../../../src/utils/rendering';
import { narray } from '../../../src/utils/misc';

function mergeSetWith(row: Row, oldSet: number, newSet: number) {
  const setToMerge = _.filter(row, { set: oldSet });
  setToMerge.forEach(box => {
    box.set = newSet;
  });
}

function populateMissingSets(row: Row) {
  const noSets = _.reject(row, box => box.set);
  const setsInUse = _.chain(row)
    .map('set')
    .uniq()
    .compact()
    .value();
  const allSets = _.range(1, row.length + 1);
  const availableSets = _.chain(allSets)
    .difference(setsInUse)
    .shuffle()
    .value();
  noSets.forEach((box, i) => (box as any).set = availableSets[i]);
}

function mergeRandomSetsIn(row: Row, probability = 0.5) {
  // Randomly merge some disjoint sets
  const allBoxesButLast = _.initial(row);
  allBoxesButLast.forEach((current, x) => {
    const next = row[x + 1];
    const differentSets = current.set !== next.set;
    const shouldMerge = Math.random() <= probability;
    if (differentSets && shouldMerge) {
      mergeSetWith(row, next.set, current.set);
      current.right = false;
      next.left = false;
    }
  });
}

function addSetExits(row: Row, nextRow: Row) {
  // Randomly add bottom exit for each set
  const setsInRow = _.chain(row)
    .groupBy('set')
    .values()
    .value();
  const { ceil, random } = Math;
  setsInRow.forEach(set => {
    const exits = _.sampleSize(set, ceil(random() * set.length));
    exits.forEach(exit => {
      if (exit) {
        const below = nextRow[exit.x];
        exit.bottom = false;
        below.top = false;
        below.set = exit.set;
      }
    });
  });
}

export type Cell = {
  x: number,
  y: number,
  top: boolean,
  bottom: boolean,
  left: boolean,
  right: boolean,
  set: number
}

export type Row = Cell[];



export class Maze {

  public rows: Row[];

  constructor(public width: number, public height: number, public closed = true) {
    const rows: Row[] = [];
    const range = _.range(width);


    // Populate maze with empty cells:
    for (let y = 0; y < height; y += 1) {
      const row: Row = range.map(x => {
        return {
          x,
          y,
          top: closed || y > 0,
          left: closed || x > 0,
          bottom: closed || y < (height - 1),
          right: closed || x < (width - 1)
        } as any
      });
      rows.push(row);
    }

    // All rows except last:
    _.initial(rows).forEach((row, y) => { // TODO initial temp?
      populateMissingSets(row);
      mergeRandomSetsIn(row);
      addSetExits(row, rows[y + 1]);
    });

    const lastRow = _.last(rows);
    populateMissingSets(lastRow!);
    mergeRandomSetsIn(lastRow!, 1);

    this.rows = rows;
  }

  getRandomPoint() {
    return new Point2D(Math.floor(Math.random() * this.width), Math.floor(Math.random() * this.height))
  }
}
/**
 * Borrowed from: https://github.com/conornewton/maze-generation-typescript/blob/master/maze.ts
 */

const tile_size = 16;

class Edge {
  left: number;
  right: number;
  constructor(left: number, right: number) {
    this.left = left;
    this.right = right;
  }
}

//i can just use an array of pairs of connections.
export class Maze {
  width: number;
  height: number;
  edges: Edge[];

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.edges = <Edge[]>new Array();
    this.generateMaze();
  }

  public generateMaze = (): void => {
    let visited: boolean[] = new Array(this.width * this.height);
    let stack: number[] = new Array();

    for (let i = 0; i < visited.length; i++) {
      visited[i] = false;
    }

    let current_cell: number = 0;
    visited[current_cell] = true;

    while (!visited.every((x) => x == true)) {
      //get the neighbours and filter out the visited ones.
      let neighbours: number[] = this.getNeighbours(current_cell).filter((x) => !visited[x]);
      if (neighbours.length > 0) {
        let chosen_neighbour = choose_random(neighbours);
        stack.push(current_cell);

        //link current_cell and chosen_neighbour together
        this.edges.push(new Edge(current_cell, chosen_neighbour));

        current_cell = chosen_neighbour;
        visited[current_cell] = true;
      } else {
        current_cell = stack.pop() as number;
      }
    }
  }


  //TODO: work out a quicker way of doing this.
  public getNeighbours = (index: number): number[] => {
    let x = index % this.width;
    let y = (index - x) / this.width;

    let neighbours: number[] = new Array();

    if (x > 0) {
      neighbours.push((x - 1) + y * this.width);
    }
    if (y > 0) {
      neighbours.push(x + (y - 1) * this.width);
    }
    if (x < this.width - 1) {
      neighbours.push((x + 1) + y * this.width);
    }
    if (y < this.width - 1) {
      neighbours.push(x + (y + 1) * this.width);
    }
    return neighbours;
  }

  // public draw = (ctx: CanvasRenderingContext2D): void => {
  //   //clear the screen
  //   ctx.fillStyle = "black";
  //   ctx.fillRect(0, 0, 656, 656);

  //   ctx.fillStyle = "white";

  //   for (let i = 0; i < this.edges.length; i++) {
  //     let x1 = this.edges[i].left % this.width;
  //     let y1 = (this.edges[i].left - x1) / this.width;

  //     ctx.fillRect(2 * x1 * tile_size + tile_size, 2 * y1 * tile_size + tile_size, tile_size, tile_size);

  //     let x2 = this.edges[i].right % this.width;
  //     let y2 = (this.edges[i].right - x2) / this.width;

  //     ctx.fillRect(2 * x2 * tile_size + tile_size, 2 * y2 * tile_size + tile_size, tile_size, tile_size);

  //     ctx.fillRect((x1 + x2) * tile_size + tile_size, (y1 + y2) * tile_size + tile_size, tile_size, tile_size);
  //   }
  // }
}

function choose_random(choices:any) {
  var index = Math.floor(Math.random() * choices.length);
  return choices[index];
}


const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

export class SpatialHashMap {
  private grid: number[][]

  constructor(public width: number, public height: number) {

    this.grid = new Array(width * height).fill(null).map(() => []);
  }

  clear() {
    this.grid.forEach(cell => {
      cell.splice(0);
    });
  }

  add(x: number, y: number, data: number) {
    x = clamp(Math.round(x), 0, this.width - 1);
    y = clamp(Math.round(y), 0, this.height - 1);

    const index = x + y * this.width;
    this.grid[index].push(data);
  }

  query(x: number, y: number, radius?: number): number[] {
    if (radius) {
      return this.queryWithRadius(x, y, radius);
    }

    x = clamp(Math.round(x), 0, this.width - 1);
    y = clamp(Math.round(y), 0, this.height - 1);

    const index = x + y * this.width;
    return this.grid[index];
  }

  queryWithRadius(x: number, y: number, radius: number) {
    const left = Math.max(Math.round(x - radius), 0);
    const right = Math.min(Math.round(x + radius), this.width - 1);
    const bottom = Math.max(Math.round(y - radius), 0);
    const top = Math.min(Math.round(y + radius), this.height - 1);

    const result = [];

    for (let i = left; i <= right; i++) {
      for (let j = bottom; j <= top; j++) {
        const query = this.query(i, j);
        for (let k = 0; k < query.length; k++) {
          result.push(query[k]);
        }
      }
    }

    return result;
  }
}
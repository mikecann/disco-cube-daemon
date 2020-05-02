export const isRoot = () => process.getuid && process.getuid() === 0;

export const wait = (t: number) => new Promise(ok => setTimeout(ok, t));

export const hang = () => wait(999999999);

export function narray(count: number) {
  return Array.from({ length: count }, (v, i) => i)
}

export function randomOne<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}
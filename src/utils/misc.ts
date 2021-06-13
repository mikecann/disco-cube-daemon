export const isRoot = () => process.getuid && process.getuid() === 0;

export function isWindows() {
  return (
    process && (process.platform === "win32" || /^(msys|cygwin)$/.test(process.env.OSTYPE + ""))
  );
}

export const wait = (t: number) => new Promise((ok) => setTimeout(ok, t));

export const hang = () => wait(999999999);

export function narray(count: number) {
  return Array.from({ length: count }, (v, i) => i);
}

export function randomOne<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

export const getNodePath = () => process.execPath;

/**
 * Shuffles array in place. ES6 version
 * @param {Array} a items An array containing the items.
 */
export function shuffle<T>(a: T[]): T[] {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

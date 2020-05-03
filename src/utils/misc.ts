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

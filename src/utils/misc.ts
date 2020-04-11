export const isRoot = () => process.getuid && process.getuid() === 0;

export const wait = (t: number) => new Promise(ok => setTimeout(ok, t));

export const hang = () => wait(999999999);
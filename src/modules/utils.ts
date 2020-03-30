export function tryRequire<T>(path: string, alternative: T): T {
  try {
    return require(path);
  } catch (e) {
    //warn(`failed to require at ${path}, using alternative instead`, e);
    return alternative;
  }
}

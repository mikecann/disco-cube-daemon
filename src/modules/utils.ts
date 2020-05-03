import { AppsCommands } from "../sharedTypes";

export function tryRequire<T>(path: string, alternative: T): T {
  try {
    return require(path);
  } catch (e) {
    //warn(`failed to require at ${path}, using alternative instead`, e);
    return alternative;
  }
}

export const onUpdateCommand = <T>(cb: (state: T) => any) => {
  process.on("message", (message) => {
    if (!message.kind) {
      console.warn(`got an unknown message from process, skipping it`, message);
      return;
    }
    const command = message as AppsCommands;
    if (command.kind == "update-app-state") cb(command.state);
  });
};

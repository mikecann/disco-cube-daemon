import { setFirebaseState, listenForFirebaseSnapshots } from "./firebase";

export const initTerminalState = () =>
  setFirebaseState("terminals", {
    command: "",
    output: [],
    status: "waiting-for-input",
  });

export const beginRespondingToTerminalCommands = () => {
  listenForFirebaseSnapshots("terminals", (state) => {
    console.log("NEW TERMINAL STATE", state);
  });
};

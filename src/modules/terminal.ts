import { setFirebaseState, listenForFirebaseSnapshots, updateFirebaseState } from "./firebase";
import { spawn } from "child_process";

export const initTerminalState = () =>
  setFirebaseState("terminals", {
    command: "",
    output: [],
    status: "waiting-for-input",
  });

export const beginRespondingToTerminalCommands = () => {
  listenForFirebaseSnapshots("terminals", async (state) => {
    if (!state) return;
    const output = state.output;
    if (state.command && state.status == "waiting-for-input") {
      updateFirebaseState("terminals", { status: "executing" });
      await executeCommand(state.command, (line) => {
        output.push(line);
        if (output.length > 11) output.shift();
        updateFirebaseState("terminals", { output });
      });
      updateFirebaseState("terminals", { command: "", status: "waiting-for-input" });
    }
  });
};

const executeCommand = async (command: string, onLine: (line: string) => any) => {
  return new Promise((resolve) => {
    console.log(`executing command '${command}'`);
    const ls = spawn(command);

    ls.stdout.on("data", (data) => {
      console.log(`> stdout: ${data}`);
      onLine(data + "");
    });

    ls.stderr.on("data", (data) => {
      console.log(`> stderr: ${data}`);
    });

    ls.on("error", (error) => {
      console.log(`error: ${error.message}`);
      onLine(error.message);
    });

    ls.on("close", (code) => {
      console.log(`child process exited with code ${code}`);
      resolve();
    });
  });
};

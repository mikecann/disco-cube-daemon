import { setFirebaseState, listenForFirebaseSnapshots, updateFirebaseState } from "./firebase";
import { exec } from "child_process";
import { TerminalCommandExecution } from "../sharedTypes";
import * as path from "path";
import * as log4js from "log4js";

const logger = log4js.getLogger(`terminal`);

export const initTerminalState = () =>
  setFirebaseState("terminals", {
    history: [],
    cwd: process.cwd(),
    command: "",
    status: "waiting",
  });

const maxItemsInHistory = 5;

export const beginRespondingToTerminalCommands = () => {
  logger.debug(`listening for snapshots`);

  listenForFirebaseSnapshots("terminals", async (state) => {
    if (!state) return;

    const history = state.history;
    if (state.command && state.status == "waiting") {
      const executionBefore = TerminalCommandExecution({
        command: state.command,
        status: "executing",
        cwd: state.cwd,
        error: "",
        stderr: "",
        stdout: "",
      });

      history.push(executionBefore);
      if (history.length >= maxItemsInHistory) history.shift();

      updateFirebaseState("terminals", { status: "executing", history });

      const output = await executeCommand(state.command, state.cwd);

      const executionAfter = TerminalCommandExecution({
        command: state.command,
        status: "executed",
        cwd: executionBefore.cwd,
        error: output.error,
        stderr: output.stderr,
        stdout: output.stdout,
      });

      history[history.length - 1] = executionAfter;

      updateFirebaseState("terminals", {
        history,
        cwd: state.command.startsWith(`cd`)
          ? path.join(state.cwd, state.command.slice(3))
          : state.cwd,
        command: "",
        status: "waiting",
      });
    }
  });
};

const executeCommand = async (command: string, cwd: string) => {
  return new Promise<{ error: string; stdout: string; stderr: string }>((resolve) => {
    logger.debug(`executing command '${command}'`);
    exec(command, { cwd }, (error, stdout, stderr) => {
      logger.debug(`command finished`, { error, stdout, stderr });
      resolve({ error: error ? error + "" : "", stdout, stderr });
    });
  });
};

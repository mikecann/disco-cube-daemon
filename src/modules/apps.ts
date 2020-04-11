import { updateFirebaseState, listenForFirebaseSnapshots, setFirebaseState } from "./firebase";
import { AppExecution, RpiDemosState, DebugAppState } from "../sharedTypes";
import { exec } from "child_process";
import { startRpiDemo } from "./rpiDemos/rpiDemos";
import * as log4js from "log4js";
import { log } from "util";
import { startDebugApp } from "./debug/debug";

const logger = log4js.getLogger(`apps`);

export const initAppState = () =>
  setFirebaseState("apps", {
    command: null,
    runningApp: null,
  });

export const startAppService = () => {
  let stopApp: (() => any) | undefined = undefined;

  logger.debug(`listening for snapshots`);

  listenForFirebaseSnapshots("apps", async (state) => {
    if (!state) return;
    if (!state.command) return;

    const { command } = state;

    logger.debug(`handling command`, command);

    if (command.kind == "start-rpi-demos") {
      stopApp = startRpiDemo(command.demoId);
      updateFirebaseState("apps", {
        command: null,
        runningApp: AppExecution({
          error: "",
          name: "rpiDemos",
          state: RpiDemosState({}),
          status: "running",
          stderr: "",
          stdout: "",
        }),
      });
    }

    if (command.kind == "start-debug-app") {
      stopApp = startDebugApp();
      updateFirebaseState("apps", {
        command: null,
        runningApp: AppExecution({
          error: "",
          name: "debug",
          state: DebugAppState({}),
          status: "running",
          stderr: "",
          stdout: "",
        }),
      });
    }

    if (command.kind == "stop-app") {
      if (stopApp) stopApp();
      stopApp = undefined;
      updateFirebaseState("apps", {
        command: null,
        runningApp: null,
      });
    }
  });
};

import { updateFirebaseState, listenForFirebaseSnapshots, setFirebaseState } from "./firebase";
import { AppExecution, RpiDemosState } from "../sharedTypes";
import { exec } from "child_process";
import { startRpiDemo } from "./apps/rpiDemos";

export const initAppState = () =>
  setFirebaseState("apps", {
    command: null,
    runningApp: null,
  });

export const startAppService = () => {
  let stopApp: (() => any) | undefined = undefined;

  listenForFirebaseSnapshots("apps", async (state) => {
    if (!state) return;
    if (!state.command) return;

    const { command } = state;

    if (command.kind == "start-rpi-demos") {
      //new RpiDemoExecution(state.command.demoId);
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

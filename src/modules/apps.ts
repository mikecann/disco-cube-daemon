import { updateFirebaseState, listenForFirebaseSnapshots, setFirebaseState } from "./firebase";
import { AppExecution, AppNames } from "../sharedTypes";
import { ChildProcessWithoutNullStreams, spawn } from "child_process";
import * as log4js from "log4js";
import kill from "tree-kill";

const logger = log4js.getLogger(`apps`);

export const initAppState = () =>
  setFirebaseState("apps", {
    command: null,
    runningApp: null,
  });

export const startAppService = () => {
  let app: RunningApp | undefined = undefined;

  logger.debug(`listening for snapshots`);

  listenForFirebaseSnapshots("apps", async (state) => {
    if (!state) return;
    if (!state.command) return;

    const { command } = state;

    logger.debug(`handling command`, command);

    if (command.kind == "start-app") {
      if (!apps[command.name]) throw new Error(`Cannot start unknown app '${command.name}'`)
      if (app) throw new Error(`cannot start app, one is already running`);

      app = apps[command.name](command.args)
      updateFirebaseState("apps", {
        command: null,
        runningApp: AppExecution({
          error: "",
          name: "debug",
          //state: DebugAppState({}),
          status: "running",
          stderr: "",
          stdout: "",
        }),
      });
    }

    if (command.kind == "stop-app") {
      if (app) app.stop()
      app = undefined;
      updateFirebaseState("apps", {
        command: null,
        runningApp: null,
      });
    }
  });
};

const startNodeApp = (name: string) => (args: string[]) => startApp(name, `/usr/bin/node`, [`${process.cwd()}/dist/apps/${name}.js`, ...args])

const apps: Record<AppNames, (args: string[]) => RunningApp> = {
  rpiDemos: (args) => startApp(`rpiDemos`, `/home/pi/rpi-rgb-led-matrix/examples-api-use/demo`, [
    `--led-rows=64`,
    `--led-cols=64`,
    `--led-chain=2`,
    `--led-parallel=3`,
    // `--led-brightness=80`,
    `--led-slowdown-gpio=2`,
    ...args
  ]),

  sparkle: startNodeApp(`sparkle`),
  debug: startNodeApp(`debug`),
  paint: startNodeApp(`paint`),
}

const startApp = (name: string, command: string, args: string[]) => {
  const logger = log4js.getLogger(name);
  logger.debug(`starting..`);

  let proc: ChildProcessWithoutNullStreams | undefined = undefined;
  try {
    proc = spawn(command, args);

    proc.stdout.on("data", (data) => {
      logger.debug(`stdout: ${data}`);
    });

    proc.stderr.on("data", (data) => {
      logger.error(`stderr: ${data}`);
    });

    proc.on("close", (code) => {
      logger.debug(`child process exited with code ${code}`);
    });
  } catch (e) {
    logger.error(`spawn error`, e);
  }

  return {
    stop: () => {
      logger.debug(`stopping..`);
      if (proc) kill(proc.pid);
    }
  }
}

export type RunningApp = ReturnType<typeof startApp>;
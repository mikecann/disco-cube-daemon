/**
 * Collections
 */

export type FirebaseCollections = {
  cubes: FirebaseCubeState;
  terminals: TerminalState;
  apps: AppsState;
};

/**
 * Dashboard
 */

export interface FirebaseCubeState {
  status: "online" | "offline";
  statusChangedAt?: Date | undefined;
  essentialSystemInfo?: EssentialSystemInfo | undefined;
  fullSystemInfoJson?: string | undefined;
}

/**
 * System Infos
 */

export const EssentialSystemInfo = (o: {
  cpuLoadsPercent: number[];
  memUsagePercent: number;
  cpuTemperature: number;
}) => {
  return { ...o } as const;
};
export interface EssentialSystemInfo extends ReturnType<typeof EssentialSystemInfo> {}

export const CubeSystemInfo = (o: {}) => {
  return { ...o } as const;
};
export interface CubeSystemInfo extends ReturnType<typeof CubeSystemInfo> {}

/**
 * Terminal
 */

export const TerminalState = (o: {
  history: TerminalCommandExecution[];
  cwd: string;
  command: string;
  status: "waiting" | "executing";
}) => {
  return { ...o } as const;
};
export interface TerminalState extends ReturnType<typeof TerminalState> {}

export const TerminalCommandExecution = (o: {
  stdout: string;
  stderr: string;
  command: string;
  error: string;
  cwd: string;
  status: "executing" | "executed";
}) => {
  return { ...o } as const;
};
export interface TerminalCommandExecution extends ReturnType<typeof TerminalCommandExecution> {}

/**
 * Apps
 */

export type Apps = {
  rpiDemos: RpiDemosState;
  paint: PaintAppState;
  debug: DebugAppState;
};

export type AppNames = keyof Apps;
export type AppStates = Apps[AppNames];

export const AppsState = (o: { command: AppsCommands | null; runningApp: AppExecution | null }) => {
  return { ...o } as const;
};
export interface AppsState extends ReturnType<typeof AppsState> {}

export const AppExecution = (o: {
  name: AppNames;
  state: AppStates;
  status: "not-started" | "running";
  stdout: string;
  stderr: string;
  error: string;
}) => {
  return { ...o } as const;
};
export interface AppExecution extends ReturnType<typeof AppExecution> {}

/**
 * App States
 */

export const RpiDemosState = (o: {}) => {
  return { ...o } as const;
};
export interface RpiDemosState extends ReturnType<typeof RpiDemosState> {}

export const PaintAppState = (o: {}) => {
  return { ...o } as const;
};
export interface PaintAppState extends ReturnType<typeof PaintAppState> {}

export const DebugAppState = (o: {}) => {
  return { ...o } as const;
};
export interface DebugAppState extends ReturnType<typeof DebugAppState> {}

/**
 * App Commands
 */

export type AppsCommands = StartRPIDemosCommand | StopRunningAppCommand | StartDebugAppCommand;

export const StartRPIDemosCommand = (o: { demoId: string }) => {
  return { kind: "start-rpi-demos", ...o } as const;
};
export interface StartRPIDemosCommand extends ReturnType<typeof StartRPIDemosCommand> {}

export const StartDebugAppCommand = (o: {}) => {
  return { kind: "start-debug-app", ...o } as const;
};
export interface StartDebugAppCommand extends ReturnType<typeof StartDebugAppCommand> {}

export const StopRunningAppCommand = (o: {}) => {
  return { kind: "stop-app", ...o } as const;
};
export interface StopRunningAppCommand extends ReturnType<typeof StopRunningAppCommand> {}

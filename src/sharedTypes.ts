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
export interface EssentialSystemInfo extends ReturnType<typeof EssentialSystemInfo> { }

export const CubeSystemInfo = (o: {}) => {
  return { ...o } as const;
};
export interface CubeSystemInfo extends ReturnType<typeof CubeSystemInfo> { }

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
export interface TerminalState extends ReturnType<typeof TerminalState> { }

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
export interface TerminalCommandExecution extends ReturnType<typeof TerminalCommandExecution> { }

/**
 * Apps
 */

export type Apps = {
  rpiDemos: AppState;
  paint: PaintAppState;
  debug: AppState;
  sparkle: AppState;
};

export type AppNames = keyof Apps;
export type AppStates = Apps[AppNames];

export const AppsState = (o: { command: AppsCommands | null; runningApp: AppExecution | null }) => {
  return { ...o } as const;
};
export interface AppsState extends ReturnType<typeof AppsState> { }

export const AppExecution = (o: {
  name: AppNames;
  //state: AppStates;
  status: "not-started" | "running";
  stdout: string;
  stderr: string;
  error: string;
}) => {
  return { ...o } as const;
};
export interface AppExecution extends ReturnType<typeof AppExecution> { }

/**
 * App States
 */

export const AppState = (o: {}) => ({ ...o } as const);
export interface AppState extends ReturnType<typeof AppState> { }

export const PaintAppState = (o: {}) => ({ ...o } as const);
export interface PaintAppState extends ReturnType<typeof PaintAppState> { }

/**
 * App Commands
 */

export type AppsCommands = StartAppCommand | StopAppCommand;

export const StartAppCommand = (o: { name: AppNames; args: string[] }) =>
  ({ kind: "start-app", ...o } as const);
export interface StartAppCommand extends ReturnType<typeof StartAppCommand> { }

export const StopAppCommand = (o: {}) => ({ kind: "stop-app", ...o } as const);
export interface StopAppCommand extends ReturnType<typeof StopAppCommand> { }

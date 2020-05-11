import * as firebase from "firebase/app";

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
  rpiDemos: AppState;
  paint: PaintAppState;
  debug: AppState;
  sparkle: AppState;
  sprinkles: AppState;
};

export type AppNames = keyof Apps;
export type AppStates = Apps[AppNames];

export const AppsState = (o: { command: AppsCommands | null; runningApp: AppExecution | null }) => {
  return { ...o } as const;
};
export interface AppsState extends ReturnType<typeof AppsState> {}

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
export interface AppExecution extends ReturnType<typeof AppExecution> {}

/**
 * App States
 */

export const AppState = (o: {}) => ({ ...o } as const);
export interface AppState extends ReturnType<typeof AppState> {}

export const PaintAppState = (o: { face: number; data: Uint8Array }) => ({ ...o } as const);
export interface PaintAppState extends ReturnType<typeof PaintAppState> {}

/**
 * App Commands
 */

export type AppsCommands = StartAppCommand | StopAppCommand | UpdateAppState;

export const StartAppCommand = (o: { name: AppNames; args: string[] }) =>
  ({ kind: "start-app", ...o } as const);
export interface StartAppCommand extends ReturnType<typeof StartAppCommand> {}

export const StopAppCommand = (o: {}) => ({ kind: "stop-app", ...o } as const);
export interface StopAppCommand extends ReturnType<typeof StopAppCommand> {}

export const UpdateAppState = (o: { app: AppNames; state: any }) =>
  ({ kind: "update-app-state", ...o } as const);
export interface UpdateAppState extends ReturnType<typeof UpdateAppState> {}

/**
 * Utils
 */

export const dataConverter: firebase.firestore.FirestoreDataConverter<any> = {
  toFirestore(value: any): firebase.firestore.DocumentData {
    if (value === null || value === undefined) return value;

    if (value instanceof Uint8Array) {
      return firebase.firestore.Blob.fromUint8Array(value);
    } else if (Array.isArray(value)) {
      return value.map((o) => dataConverter.toFirestore(o));
    } else if (typeof value == "object") {
      return Object.entries(value)
        .map((k) => [k[0], dataConverter.toFirestore(k[1])] as const)
        .reduce((accum, curr) => ({ ...accum, [curr[0]]: curr[1] }), {});
    }
    return value;
  },
  fromFirestore(
    snapshot: firebase.firestore.QueryDocumentSnapshot,
    options: firebase.firestore.SnapshotOptions
  ): any {
    const data = snapshot.data(options)!;
    return fromFirestoreValue(data);
  },
};

const fromFirestoreValue = (value: any): any => {
  if (value === null || value === undefined) return value;

  if (value instanceof firebase.firestore.Blob) {
    return value.toUint8Array();
  } else if (typeof value == "object") {
    return Object.entries(value)
      .map((k) => [k[0], fromFirestoreValue(k[1])] as const)
      .reduce((accum, curr) => ({ ...accum, [curr[0]]: curr[1] }), {});
  } else if (Array.isArray(value)) {
    return value.map((o) => fromFirestoreValue(o));
  }
  return value;
};

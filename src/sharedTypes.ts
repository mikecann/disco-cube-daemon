export interface FirebaseCubeState {
  status: "online" | "offline";
  statusChangedAt?: Date | undefined;
  essentialSystemInfo?: EssentialSystemInfo | undefined;
  fullSystemInfoJson?: string | undefined;
}

export const EssentialSystemInfo = (o: {
  cpuLoadsPercent: number[];
  memUsagePercent: number;
  cpuTemperature: number;
  batteryLevelPercentage: number;
}) => {
  return { ...o } as const;
};
export interface EssentialSystemInfo extends ReturnType<typeof EssentialSystemInfo> {}

export const CubeSystemInfo = (o: {}) => {
  return { ...o } as const;
};
export interface CubeSystemInfo extends ReturnType<typeof CubeSystemInfo> {}

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

export type FirebaseCollections = {
  cubes: FirebaseCubeState;
  terminals: TerminalState;
};

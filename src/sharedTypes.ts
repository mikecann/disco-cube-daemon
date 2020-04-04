export interface FirebaseCubeState {
  status: "online" | "offline";
  statusChangedAt?: Date | undefined;
  essentialSystemInfo?: CubEssentialSystemInfo | undefined;
  fullSystemInfoJson?: string | undefined;
}

export const CubEssentialSystemInfo = (o?: {
  cpuLoadsPercent: number[];
  memUsagePercent: number;
}) => {
  return { ...o } as const;
};
export interface CubEssentialSystemInfo extends ReturnType<typeof CubEssentialSystemInfo> {}

export const CubeSystemInfo = (o?: {}) => {
  return { ...o } as const;
};
export interface CubeSystemInfo extends ReturnType<typeof CubeSystemInfo> {}

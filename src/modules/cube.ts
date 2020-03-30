import { createDomain, Store } from "effector";
import { logDomain } from "./effector";

const domain = createDomain(`cube`);
logDomain(domain);

export interface CubeState {
  isConnected: boolean;
}

// Events
export const cubeSnapshotChanged = domain.createEvent<CubeState>();

// Effects

// Store
export const cubeStore = domain
  .createStore<CubeState>(
    {
      isConnected: false,
    },
    { name: `store` }
  )
  .on(cubeSnapshotChanged, (_, payload) => payload);

export interface CubeStore extends Store<CubeState> {}

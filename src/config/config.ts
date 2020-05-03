import { tryRequire } from "../modules/utils";

const localConfig = {
  FIREBASE_EMAIL: "",
  FIREBASE_PASSWORD: "",
  MOCK_RUNNING_APPS: "false",
};

export const config = {
  ...localConfig,
  ...process.env,
  ...tryRequire(`${process.cwd()}/local.config.json`, {}),
} as typeof localConfig;

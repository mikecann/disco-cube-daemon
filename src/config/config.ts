import { tryRequire } from "../modules/utils";

const localConfig = {
  FIREBASE_EMAIL: "",
  FIREBASE_PASSWORD: "",
};

export const config = {
  ...localConfig,
  ...process.env,
  ...tryRequire(`${__dirname}/local.config.json`, {}),
} as typeof localConfig;

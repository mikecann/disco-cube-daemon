import * as log4js from "log4js";

export const configLogger = () => {
  log4js.configure({
    appenders: {
      fileout: {
        type: "file",
        filename: "output.log",
        maxLogSize: 1024 * 1024 * 5, // 5meg
      },
      consoleout: { type: "stdout" },
    },
    categories: { default: { appenders: ["fileout", "consoleout"], level: "debug" } },
  });
};

export const logger = log4js.getLogger(`output`);

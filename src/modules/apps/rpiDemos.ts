import { exec } from "child_process";
import { RpiDemosState } from "../../sharedTypes";

const executablePath = `/home/pi/rpi-rgb-led-matrix`;

export const startRpiDemo = (demoId: string) => {
  console.log(`starting rpi demo`, demoId);

  const command = `sudo ${executablePath}/examples-api-use/demo -${demoId} --led-rows=64 --led-cols=64 --led-chain=1 --led-parallel=1 --led-slowdown-gpio=2`;

  const proc = exec(command, (error, stdout, stderr) => {
    console.log(`command finished`, { error, stdout, stderr });
  });

  return () => {
    console.log(`stopping rpi demo`);
    proc.kill();
  };
};

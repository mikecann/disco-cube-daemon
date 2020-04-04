import { CubeSystemInfo, EssentialSystemInfo } from "../sharedTypes";
import * as si from "systeminformation";

export const monitorSystemInfo = (
  allInfoCallback: (info: CubeSystemInfo) => any,
  essentialInfoCallback: (info: EssentialSystemInfo) => any
) => {
  const update = async () => {
    const [currentLoad, mem, cpuTemperature, battery] = await Promise.all([
      si.currentLoad(),
      si.mem(),
      si.cpuTemperature(),
      si.battery(),
    ]);

    //const cpu = await si.cpu();

    //console.log("\n\n");

    //console.log(cpuLoad);

    const essential = EssentialSystemInfo({
      cpuLoadsPercent: currentLoad.cpus.map((c) => c.load),
      memUsagePercent: (mem.free / mem.total) * 100,
      cpuTemperature: cpuTemperature.main,
      batteryLevelPercentage: battery.percent,
    });

    //console.log("essential", essential);

    essentialInfoCallback(essential);

    setTimeout(update, 2000);
  };

  setTimeout(update, 2000);
  update();

  // Get ALL system info only once
  si.getAllData().then(allInfoCallback);
};

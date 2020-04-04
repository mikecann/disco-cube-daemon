import { CubeSystemInfo, CubEssentialSystemInfo } from "../sharedTypes";
import * as si from "systeminformation";

export const monitorSystemInfo = (
  allInfoCallback: (info: CubeSystemInfo) => any,
  essentialInfoCallback: (info: CubEssentialSystemInfo) => any
) => {
  const update = async () => {
    const [currentLoad, mem] = await Promise.all([si.currentLoad(), si.mem()]);

    //const cpu = await si.cpu();

    //console.log("\n\n");

    //console.log(cpuLoad);

    const essential = CubEssentialSystemInfo({
      cpuLoadsPercent: currentLoad.cpus.map((c) => c.load),
      memUsagePercent: (mem.free / mem.total) * 100,
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

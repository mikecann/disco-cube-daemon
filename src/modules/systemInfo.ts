import { CubeSystemInfo, EssentialSystemInfo } from "../sharedTypes";
import * as si from "systeminformation";
import * as log4js from "log4js";

const logger = log4js.getLogger(`system-info`);

const updateRateMs = 5000;

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

    const essential = EssentialSystemInfo({
      cpuLoadsPercent: currentLoad.cpus.map((c) => c.load),
      memUsagePercent: (mem.used / mem.total) * 100,
      cpuTemperature: cpuTemperature.main,
      batteryLevelPercentage: battery.percent,
    });

    essentialInfoCallback(essential);

    setTimeout(update, updateRateMs);
  };

  setTimeout(update, updateRateMs);

  // Get ALL system info only once
  getStaticData().then(allInfoCallback);
};

// Have to use this rather than the built in function because it has an issue exiting
// the process when you use powershell as your terminal, I believe it is the graphics module
async function getStaticData() {
  const [
    system,
    bios,
    baseboard,
    chassis,
    osInfo,
    uuid,
    cpuFlags,
    //graphics,
    networkInterfaces,
    memLayout,
    versions,
  ] = await Promise.all([
    si.system(),
    si.bios(),
    si.baseboard(),
    si.chassis(),
    si.osInfo(),
    si.uuid(),
    si.cpuFlags(),
    //si.graphics(),
    si.networkInterfaces(),
    si.memLayout(),
    si.versions(),
  ]);

  const [cpu, diskLayout] = await Promise.all([si.cpu(), si.diskLayout()]);

  return {
    system,
    bios,
    cpu,
    diskLayout,
    baseboard,
    osInfo,
    chassis,
    uuid,
    cpuFlags,
    networkInterfaces,
    memLayout,
    versions,
  }; // graphics,
}

import { CubeSystemInfo, EssentialSystemInfo } from "../sharedTypes";
import * as si from "systeminformation";
import * as log4js from "log4js";
import { isStopped } from "../utils/shutdown";

const logger = log4js.getLogger(`system-info`);

const updateRateMs = 5000;

export const monitorSystemInfo = (
  allInfoCallback: (info: CubeSystemInfo) => any,
  essentialInfoCallback: (info: EssentialSystemInfo) => any
) => {
  const update = async () => {
    const [currentLoad, mem, cpuTemperature] = await Promise.all([
      si.currentLoad(),
      si.mem(),
      si.cpuTemperature(),
    ]);

    const essential = EssentialSystemInfo({
      cpuLoadsPercent: currentLoad.cpus.map((c) => c.load),
      memUsagePercent: (mem.used / mem.total) * 100,
      cpuTemperature: cpuTemperature.main
    });

    essentialInfoCallback(essential);

    if (!isStopped) setTimeout(update, updateRateMs);
  };

  setTimeout(update, updateRateMs);
  update();

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

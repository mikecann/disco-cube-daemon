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
      memUsagePercent: (mem.used / mem.total) * 100,
      cpuTemperature: cpuTemperature.main,
      batteryLevelPercentage: battery.percent,
    });

    //console.log("essential", essential);

    essentialInfoCallback(essential);

    setTimeout(update, 3000);
  };

  //setTimeout(update, 3000);

  // Get ALL system info only once
  getStaticData().then(allInfoCallback);
};

async function getStaticData() {
  const [
    system,
    bios,
    baseboard,
    chassis,
    osInfo,
    uuid,
    // cpuFlags,
    // graphics,
    // networkInterfaces,
    // memLayout,
  ] = await Promise.all([
    si.system(),
    si.bios(),
    si.baseboard(),
    si.chassis(),
    si.osInfo(),
    si.uuid(),

    // si.cpuFlags(),
    // si.graphics(),
    // si.networkInterfaces(),
    // si.memLayout(),

    //si.versions(),
    //si.cpu(),
    //si.diskLayout(),
  ]);

  return { system, bios, chassis, uuid }; // cpuFlags, graphics, networkInterfaces, memLayout
}

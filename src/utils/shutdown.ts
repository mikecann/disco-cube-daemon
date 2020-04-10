export let isStopped = false;

export const setupShutdown = () => {
  process.on("SIGTERM", stopHandler);
  process.on("SIGINT", stopHandler);
  process.on("SIGHUP", stopHandler);

  async function stopHandler() {
    console.log("Stopping...");
    isStopped = true;

    const timeoutId = setTimeout(() => {
      process.exit(1);
      console.error("Stopped forcefully, not all connection was closed");
    }, 2000);

    try {
      clearTimeout(timeoutId);
    } catch (error) {
      console.error(error, "Error during stop.");
      process.exit(1);
    }
  }
};

const { spawn } = require("node:child_process");
let cleanupCalled = false;
let devServer = null;

const clearLastLine = () => {
  process.stdout.write("\x1b[1A\x1b[2K");
};

const shouldShowLogs = (command) => {
  return (
    command.includes("migrations:up") ||
    command.includes("services:wait-db") ||
    command.includes("next") ||
    command.includes("services:down")
  );
};

const runCommand = (command, args = [], description) => {
  //eslint-disable-next-line
  return new Promise((resolve, reject) => {
    if (command === "services:down" && cleanupCalled) {
      return resolve();
    }

    console.log(`\n⏳ ${description || command}`);

    const child = spawn(command, args, {
      stdio: shouldShowLogs(args[0]) ? "inherit" : ["ignore", "pipe", "pipe"],
      shell: true,
    });

    child.on("error", (error) => {
      console.error(`\n❌ ${description || command} failed:`, error);
      reject(error);
    });

    child.on("exit", (code) => {
      if (code === 0) {
        clearLastLine();
        console.log(`\n✅ ${description || command} completed!`);
        resolve();
      } else {
        reject(new Error(`${description || command} failed with code ${code}`));
      }
    });
  });
};

const cleanup = async (exitCode = 0) => {
  if (cleanupCalled) return;
  cleanupCalled = true;

  console.log("\n\n🛑 Shutting down services...");

  try {
    if (devServer && !devServer.killed) {
      devServer.kill("SIGTERM");
    }

    //eslint-disable-next-line
    await new Promise((resolve) => setTimeout(resolve, 1000));

    await runCommand("yarn", ["services:down"], "Stopping services");

    console.log("\n👋 Cleanup completed successfully!");
    process.exit(exitCode);
  } catch (error) {
    console.error("\n❌ Cleanup failed:", error);
    process.exit(1);
  }
};

(async () => {
  try {
    ["SIGINT", "SIGTERM", "SIGUSR1", "SIGUSR2"].forEach((signal) => {
      process.on(signal, () => cleanup());
    });

    process.on("uncaughtException", (error) => {
      console.error("\n💥 Uncaught Exception:", error);
      cleanup(1);
    });

    await runCommand("yarn", ["services:up"], "Starting services!");
    await runCommand("yarn", ["services:wait-db"], "Pulling up the database");
    await runCommand("yarn", ["migrations:up"], "Running migrations!");

    console.log("\n🚀 Starting the development server...\n");
    devServer = spawn("yarn", ["next", "dev"], { stdio: "inherit" });

    devServer.on("exit", (code) => {
      if (code !== 0) {
        console.error("\n❌ Development server exited unexpectedly");
      }
      cleanup(code || 0);
    });
  } catch (err) {
    console.error("\n💥 Error:", err.message);
    cleanup(1);
  }
})();

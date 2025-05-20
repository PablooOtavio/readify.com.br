#!/usr/bin/env node
const { spawn } = require("child_process");
const signals = ["SIGINT", "SIGTERM", "SIGUSR1", "SIGUSR2"];
class WorkerManager {
  constructor() {
    this.workers = new Set();
  }

  add(proc) {
    this.workers.add(proc);
    proc.once("exit", () => this.workers.delete(proc));
  }

  killAll(signal = "SIGTERM") {
    for (const proc of this.workers) {
      proc.removeAllListeners();
      proc.kill(signal);
    }
  }

  count() {
    return this.workers.size;
  }
}

const manager = new WorkerManager();
let cleaningUp = false;

async function cleanup(exitCode = 0) {
  if (cleaningUp) return exitCode;
  cleaningUp = true;
  try {
    spawn("yarn", ["services:stop"]);
    return exitCode;
  } catch (err) {
    console.error("\n❌ Clean up Failed:", err);
    return 1;
  }
}
async function gracefulShutdown() {
  await cleanup();
  manager.killAll();

  setTimeout(() => {
    console.error("Execution time exceeded. Forcing exit.");
    process.exit(1);
  }, 5000).unref();
}

function spawnYarn(args, label, options = {}) {
  return new Promise((resolve, reject) => {
    console.log(`\n⏳ ${label}: yarn ${args.join(" ")}`);
    const proc = spawn("yarn", args, {
      stdio: "inherit",
      shell: true,
      detached: true,
      timeout: 10000,
      ...options,
    });

    manager.add(proc);

    proc.once("close", (code) => {
      if (code === 0) {
        console.log(`✅ ${label} finished successfully`);
        resolve(code);
      } else {
        reject(new Error(`${label} failed with the exit code ${code}`));
      }
    });
  });
}

async function runDevServer() {
  console.log("\n🚀 Initializing server...");
  return new Promise((resolve) => {
    const devServer = spawn("yarn", ["next", "dev"], {
      stdio: "inherit",
      shell: true,
    });

    manager.add(devServer);

    const onSignal = () => {
      devServer.kill("SIGTERM");
    };
    signals.forEach((sig) => process.once(sig, onSignal));

    devServer.once("close", (code) => {
      signals.forEach((sig) => process.removeListener(sig, onSignal));
      resolve(code);
    });
  });
}

async function main() {
  process.on("SIGINT", gracefulShutdown);
  process.on("SIGTERM", gracefulShutdown);

  try {
    await spawnYarn(["services:up"], "Initializing docker compose");
    await spawnYarn(["services:wait-db"], "Waiting for database");
    await spawnYarn(["migrations:up"], "Executing migrations");
    console.clear();
    const devExitCode = await runDevServer();
    return devExitCode;
  } catch (err) {
    console.error("\n💥 An unexpected error ocourred:", err);
    return await gracefulShutdown();
  }
}

(async () => {
  const exitCode = await main();
  await cleanup(exitCode);
  process.exit(exitCode);
})();

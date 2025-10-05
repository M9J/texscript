import { spawn } from "child_process";
import chokidar from "chokidar";

const watcher = chokidar.watch("lib", {
  ignoreInitial: true,
});

let isBuilding = false;
console.log("Lib Watcher Builder is active.");
console.log("Waiting for changes...");

watcher.on("all", (event, path) => {
  if (isBuilding) return;
  isBuilding = true;

  console.log(`[lib] Change detected: ${event} → ${path}`);
  const build = spawn("npm", ["run", "v1-dev:all"], {
    stdio: "inherit",
    shell: true,
  });

  build.on("close", (code) => {
    console.log(`./lib/ rebuilt with exit code ${code}`);
    isBuilding = false;
  });
});

import { spawn } from "child_process";
import chokidar from "chokidar";

const watcher = chokidar.watch("src-lib/v2", {
  ignoreInitial: true,
});

let isBuilding = false;
console.log("src-lib/v2 Watcher Builder is active.");
console.log("Waiting for changes...");

watcher.on("all", (event, path) => {
  if (isBuilding) return;
  isBuilding = true;

  console.log(`[src-lib/v2] Change detected: ${event} → ${path}`);
  const build = spawn("npm", ["run", "v2-dev"], {
    stdio: "inherit",
    shell: true,
  });

  build.on("close", (code) => {
    console.log(`\n\n[src-lib/v2] Rebuilt (exit code ${code})`);
    isBuilding = false;
  });
});

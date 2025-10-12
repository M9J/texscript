import { spawn } from "child_process";
import chokidar from "chokidar";
import readline from "readline";
import Poppins from "../../utils/poppins.js";

const watcher = chokidar.watch("src-lib/v3", {
  ignoreInitial: true,
});

let isBuilding = false;
console.log("src-lib/v3 Watcher Builder is active.");
console.log("Waiting for changes...");
console.log("Ctrl + R : Rebuild");
console.log("Ctrl + C or Z : Exit");
console.log("\n");

readline.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY) process.stdin.setRawMode(true);

process.stdin.on("keypress", (str, key) => {
  if (key.ctrl && (key.name === "c" || key.name === "z")) {
    console.log("\n👋 Exiting...");
    process.exit();
  } else if (key.ctrl && key.name === "r") {
    triggerBuild("manual", "keyboard");
  }
});

watcher.on("all", (event, path) => {
  if (isBuilding) return;
  triggerBuild(event, path);
});

function triggerBuild(event, path) {
  if (isBuilding) return;
  isBuilding = true;

  if (event === "manual") {
    console.log(`[src-lib/v3] Manual rebuild triggered.`);
  } else {
    console.log(`[src-lib/v3] Change detected: ${event} → ${path}`);
  }

  const build = spawn("npm", ["run", "dev-v3"], {
    stdio: "inherit",
    shell: true,
  });

  build.on("close", (code) => {
    const { green, red } = Poppins;
    if (code) console.log(`[src-lib/v3] ${red("Rebuild failed")} (exit code ${red(code)})`);
    else console.log(`[src-lib/v3] ${green("Rebuilt")} (exit code ${green(code)})`);
    isBuilding = false;
  });
}

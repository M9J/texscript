import { spawn } from "child_process";
import chokidar from "chokidar";
import readline from "readline";

const watcher = chokidar.watch("src-lib/v2", {
  ignoreInitial: true,
});

let isBuilding = false;
console.log("src-lib/v2 Watcher Builder is active.");
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
    console.log(`[src-lib/v2] Manual rebuild triggered.`);
  } else {
    console.log(`[src-lib/v2] Change detected: ${event} → ${path}`);
  }

  const build = spawn("npm", ["run", "v2-dev"], {
    stdio: "inherit",
    shell: true,
  });

  build.on("close", (code) => {
    const { cyan, green } = poppins();
    console.log(`[src-lib/v2] ${green("Rebuilt")} (exit code ${cyan(code)})`);
    isBuilding = false;
  });
}

function poppins() {
  const COLOR_BOUNDARY = "\x1b[0m";
  const COLORS = {
    green: "\x1b[32m",
    cyan: "\x1b[36m",
  };
  const coloredText = (color) => (text) => `${COLORS[color] + text + COLOR_BOUNDARY}`;
  return {
    green: coloredText("green"),
    cyan: coloredText("cyan"),
  };
}

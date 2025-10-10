import { spawn } from "child_process";

export function runTscNoEmit() {
  return new Promise((resolve, reject) => {
    const tsc = spawn(
      // Use the local tsc if available, otherwise the global one on PATH
      process.platform === "win32" ? "npx.cmd" : "npx",
      ["-y", "tsc", "-p", "tsconfig.src-lib-v3.json"],
      { stdio: "inherit", shell: true }
    );

    tsc.on("error", (err) => {
      reject(err);
    });

    tsc.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`tsc exited with code ${code}`));
    });
  });
}

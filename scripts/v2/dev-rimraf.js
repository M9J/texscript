import { spawn } from "child_process";

export function runRimraf() {
  return new Promise((resolve, reject) => {
    const rimraf = spawn(
      process.platform === "win32" ? "npx.cmd" : "npx",
      ["rimraf", ".temp/build/v2"],
      { stdio: "inherit", shell: true }
    );

    rimraf.on("error", (err) => {
      reject(err);
    });

    rimraf.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`rimraf exited with code ${code}`));
    });
  });
}

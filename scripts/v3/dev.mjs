import Poppins from "../../cmd-utils/poppins.js";
import { runDevBundle } from "./dev-bundle.js";
import { runRimraf } from "./dev-rimraf.js";
import { runTscNoEmit } from "./dev-tsc.js";
import { Timer } from "../../cmd-utils/timer.js";

async function main() {
  const { green, red, cyan } = Poppins;
  try {
    console.log("Running TypeScript type-check (tsc --noEmit)...");
    const tscTime = await new Timer().time(async () => await runTscNoEmit());
    console.log(`${green("Type-check passed.")} (${cyan(tscTime)})`);
    console.log("Preparing for ESBuild pipeline...");
    console.log("Cleaning up existing dev build artifacts...");
    const rimrafTime = await new Timer().time(async () => await runRimraf());
    console.log(`${green("Artifacts cleaned.")} (${cyan(rimrafTime)})`);
    console.log("Running ESBuild pipeline...");
    const devBundleTime = await new Timer().time(async () => await runDevBundle());
    console.log(`${green("Build done.")} (${cyan(devBundleTime)})`);
  } catch (err) {
    console.error(red("Build aborted due to type-check failure or error:"));
    console.error(err && err.message ? err.message : err);
    process.exit(1);
  }
}

main();

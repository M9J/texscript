import Poppins from "../../utils/poppins.js";
import { runDevBundle } from "./dev-bundle.js";
import { runRimraf } from "./dev-rimraf.js";
import { runTscNoEmit } from "./dev-tsc.js";

async function main() {
  const { green, red } = Poppins;
  try {
    console.log("Running TypeScript type-check (tsc --noEmit)...");
    await runTscNoEmit();
    console.log(`${green("Type-check passed.")}`);
    console.log("Preparing for ESBuild pipeline...");
    console.log("Cleaning up existing dev build artifacts...");
    await runRimraf();
    console.log(green("Artifacts cleaned."));
    console.log("Running ESBuild pipeline...");
    await runDevBundle();
    console.log(green("Build done ."));
  } catch (err) {
    console.error(red("Build aborted due to type-check failure or error:"));
    console.error(err && err.message ? err.message : err);
    process.exit(1);
  }
}

main();

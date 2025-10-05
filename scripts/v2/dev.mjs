import { runDevBundle } from "./dev-bundle.js";
import { runTscNoEmit } from "./dev-tsc.js";

async function main() {
  try {
    console.log("Running TypeScript type-check (tsc --noEmit)...");
    await runTscNoEmit();
    console.log("Type-check passed; starting esbuild pipeline...");
    await runDevBundle();
  } catch (err) {
    console.error("Build aborted due to type-check failure or error:");
    console.error(err && err.message ? err.message : err);
    process.exit(1);
  }
}

main();

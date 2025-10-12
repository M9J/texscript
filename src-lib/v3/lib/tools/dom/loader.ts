import Metrics from "../benchmark/metrics";
import { updateSplashProgress, updateSplashStatus } from "./splash";

export async function load(): Promise<void> {
  try {
    const metricsLoader = new Metrics("Texscript Loader");
    metricsLoader.start();

    updateSplashStatus("Getting handy tools...");
    updateSplashProgress("20");
    const dom_js = await import("../utils/dom");

    updateSplashStatus("Opening curse words...");
    updateSplashProgress("30");
    const errors_js = await import("../../constants/errors");

    updateSplashStatus("Loading brain power...");
    updateSplashProgress("50");
    const compiler_js = await import("../../compiler/compiler");
    const compiler = new compiler_js.default();
    const processor = await import("./processor");
    updateSplashProgress("60");

    updateSplashStatus("Finding your story...");
    const rawCode = await dom_js.findCodeFromDOM();

    if (!rawCode) throw new Error(errors_js.default.ERR0001);

    updateSplashProgress("90");
    metricsLoader.end();

    processor.process(compiler, rawCode);
  } catch (e) {
    updateSplashStatus(e, "error");
  }
}

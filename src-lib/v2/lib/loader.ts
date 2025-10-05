import { updateSplashProgress, updateSplashStatus } from "./splash";

export async function load(): Promise<void> {
  try {
    updateSplashStatus("Getting handy tools...");
    updateSplashProgress("20");
    const dom_js = await import("./utils/dom");
    const styles_js = await import("./utils/styles");
    updateSplashStatus("Opening curse words...");
    updateSplashProgress("30");
    const errors_js = await import("./constants/errors");
    updateSplashStatus("Applying beauty makeup...");
    updateSplashProgress("40");
    await styles_js.loadTexscriptStyles();
    updateSplashStatus("Loading brain power...");
    updateSplashProgress("50");
    const compiler_js = await import("./core/compiler");
    const compiler = new compiler_js.default();
    const processor = await import("./processor");
    updateSplashProgress("60");
    updateSplashStatus("Finding your story...");
    const rawCode = await dom_js.findCodeFromDOM();
    if (!rawCode) throw new Error(errors_js.default.ERR0001);
    updateSplashProgress("90");
    processor.process(compiler, rawCode);
  } catch (e) {
    updateSplashStatus(e, "error");
    console.log(e);
  }
}

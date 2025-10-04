import { updateSplashStatus } from "../splash";

export async function load(): Promise<void> {
  try {
    updateSplashStatus("Getting handy tools...");
    const dom_js = await import("./utils/dom");
    const styles_js = await import("./utils/styles");
    updateSplashStatus("Opening curse words...");
    const errors_js = await import("./constants/errors");
    updateSplashStatus("Applying beauty makeup...");
    await styles_js.loadTexscriptStyles();
    updateSplashStatus("Loading brain power...");
    const compiler_js = await import("./core/compiler");
    const compiler = new compiler_js.default();
    const processor = await import("./processor");
    updateSplashStatus("Finding your story...");
    const rawCode = await dom_js.findCodeFromDOM();
    if (!rawCode) throw new Error(errors_js.default.ERR0001);
    processor.process(compiler, rawCode);
  } catch (e) {
    updateSplashStatus(e, "error");
    console.log(e);
  }
}

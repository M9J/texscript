import {
  updateSplashProgress,
  updateSplashStatus
} from "./chunk-RRXX54FP.js";
import "./chunk-77J4NURK.js";

// src-lib/v2/lib/loader.ts
async function load() {
  try {
    updateSplashStatus("Getting handy tools...");
    updateSplashProgress("20");
    const dom_js = await import("./dom-HX3BUJQM.js");
    const styles_js = await import("./styles-7IDQZ6DH.js");
    updateSplashStatus("Opening curse words...");
    updateSplashProgress("30");
    const errors_js = await import("./errors-LYY3KFV7.js");
    updateSplashStatus("Applying beauty makeup...");
    updateSplashProgress("40");
    await styles_js.loadTexscriptStyles();
    updateSplashStatus("Loading brain power...");
    updateSplashProgress("50");
    const compiler_js = await import("./compiler-6DGNRQBB.js");
    const compiler = new compiler_js.default();
    const processor = await import("./processor-QL2RYH5T.js");
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
export {
  load
};

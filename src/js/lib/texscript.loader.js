import { updateSplashStatus } from "../splash/texscript.splash";

export async function load() {
  try {
    updateSplashStatus("Loading beauty...");
    const styles_js = await import("./utils/styles.js");
    updateSplashStatus("Loading handy tools...");
    const dom_js = await import("./utils/dom.js");
    updateSplashStatus("Loading your story...");
    const rawCode = dom_js.findCodeFromDOM();
    updateSplashStatus("Loading curse words...");
    const errors_js = await import("./constants/errors.js");
    if (!rawCode) throw new Error(errors_js.default.ERR0001);
    updateSplashStatus("Loading compiler...");
    const compiler_js = await import("./core/compiler.js");
    const processor = await import("./texscript.processor.js");
    updateSplashStatus("Texscript Loader: Done");
    const compiler = new compiler_js.default();
    processor.process(compiler, rawCode, () => {
      styles_js.appendTexscriptStyles();
    });
  } catch (e) {
    updateSplashStatus(e, "error");
    console.log(e);
  }
}

export default {
  load,
};

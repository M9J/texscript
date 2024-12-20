export async function load() {
  try {
    console.log("Loading handy tools...");
    const dom_js = await import("./utils/dom.js");
    console.log("Loading your story...");
    const rawCode = dom_js.findCodeFromDOM();
    console.log("Loading curse words...");
    const errors_js = await import("./constants/errors.js");
    if (!rawCode) throw new Error(errors_js.default.ERR0001);
    console.log("Loading compiler...");
    const compiler_js = await import("./core/compiler.js");
    const processor = await import("./texscript.processor.js");
    const compiler = new compiler_js.default();
    processor.process(compiler, rawCode);
  } catch (e) {
    console.log(e, "error");
    console.log(e);
  }
}

export default {
  load,
};

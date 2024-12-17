export async function load() {
  const texscriptLoaderStatusDiv = document.getElementById("texscript-loader-status");
  const printLine = (line) => (texscriptLoaderStatusDiv.innerHTML += line + "<br/>");
  printLine("Loading Texscript styles...");
  const styles_js = await import("./utils/styles.js");
  printLine("Loading utilities...");
  const dom_js = await import("./utils/dom.js");
  printLine("Loading your Texscript code...");
  const rawCode = dom_js.findCodeFromDOM();
  printLine("Loading ERROR index...");
  const errors_js = await import("./constants/errors.js");
  if (!rawCode) throw new Error(errors_js.default.ERR0001);
  printLine("Loading compiler...");
  const compiler_js = await import("./core/compiler.js");
  const compiler = await import("./texscript.compiler.js");
  printLine("Texscript Loader: Done");
  styles_js.appendTexscriptStyles();
  const compilerInstance = new compiler_js.default();
  compiler.compile(compilerInstance, rawCode);
}

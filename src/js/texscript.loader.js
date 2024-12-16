export async function loadTexscript() {
  const texscriptLoaderStatusDiv = document.getElementById("texscript-loader-status");
  const printLine = (line) => (texscriptLoaderStatusDiv.innerHTML += line + "<br/>");
  printLine("Loading styles...");
  const styles_js = await import("./utils/styles.js");
  printLine("Loading utilities...");
  const dom_js = await import("./utils/dom.js");
  printLine("Loading your TEXScript code...");
  const rawCode = dom_js.findCodeFromDOM();
  printLine("Loading ERROR index...");
  const errors_js = await import("./constants/errors.js");
  if (!rawCode) throw new Error(errors_js.default.ERR0001);
  printLine("Loading compiler...");
  const compiler_js = await import("./core/compiler.js");
  printLine("TEXScript Loader: DONE");
  printLine("Compiling your code...");
  const compiler = new compiler_js.default();
  compiler.compile(rawCode);
  printLine("Preparing page for rendering...");
  styles_js.appendTexscriptStyles();
  printLine("Rendering output...");
  document.body.innerHTML = compiler.generateCodeFor("HTML");
}

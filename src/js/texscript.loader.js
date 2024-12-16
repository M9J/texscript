export async function loadTexscript() {
  const texscriptLoaderStatusDiv = document.getElementById("texscript-loader-status");
  const printLine = (line) => (texscriptLoaderStatusDiv.innerHTML += line + "<br/>");
  printLine("Loading styles...");
  const styles_js = await import("./utils/styles.js");
  printLine("Loaded styles.");
  printLine("Loading utilities...");
  const dom_js = await import("./utils/dom.js");
  printLine("Loaded utilities.");
  printLine("Searching for code written in TEXScript...");
  const rawCode = dom_js.findCodeFromDOM();
  printLine("Found TEXScript code.");
  printLine("Loading error index...");
  const errors_js = await import("./constants/errors.js");
  printLine("Loaded error index.");
  if (!rawCode) throw new Error(errors_js.default.ERR0001);
  printLine("Loading compiler...");
  const compiler_js = await import("./core/compiler.js");
  printLine("Loaded TEXScript Compiler.");
  printLine("Compiling code...");
  const compiler = new compiler_js.default();
  compiler.compile(rawCode);
  printLine("Compilation done.");
  printLine("Preparing page for rendering...");
  styles_js.appendTexscriptStyles();
  printLine("Page prepared.");
  printLine("Rendering output...");
  document.body.innerHTML = compiler.generateCodeFor("HTML");
}

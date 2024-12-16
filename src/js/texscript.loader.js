export async function loadTexscript() {
  const texscriptLoaderStatusDiv = document.getElementById("texscript-loader-status");
  texscriptLoaderStatusDiv.innerHTML += "Loading styles...<br/>";
  const styles_js = await import("./utils/styles.js");
  texscriptLoaderStatusDiv.innerHTML += "Loaded styles.<br/>";
  texscriptLoaderStatusDiv.innerHTML += "Loading utilities...<br/>";
  const dom_js = await import("./utils/dom.js");
  texscriptLoaderStatusDiv.innerHTML += "Loaded utilities.<br/>";
  texscriptLoaderStatusDiv.innerHTML += "Searching for code written in TEXScript...<br/>";
  const rawCode = dom_js.findCodeFromDOM();
  texscriptLoaderStatusDiv.innerHTML += "Found TEXScript code.<br/>";
  texscriptLoaderStatusDiv.innerHTML += "Loading error index...<br/>";
  const errors_js = await import("./constants/errors.js");
  texscriptLoaderStatusDiv.innerHTML += "Loaded error index.<br/>";
  if (!rawCode) throw new Error(errors_js.default.ERR0001);
  texscriptLoaderStatusDiv.innerHTML += "Loading compiler...<br/>";
  const compiler_js = await import("./core/compiler.js");
  texscriptLoaderStatusDiv.innerHTML += "Loaded TEXScript Compiler.<br/>";
  texscriptLoaderStatusDiv.innerHTML += "Compiling...<br/>";
  const compiler = new compiler_js.default();
  compiler.compile(rawCode);
  texscriptLoaderStatusDiv.innerHTML += "Compilation is complete.<br/>";
  texscriptLoaderStatusDiv.innerHTML += "Preparing page for rendering...<br/>";
  styles_js.appendTexscriptStyles();
  texscriptLoaderStatusDiv.innerHTML += "Page prepared.<br/>";
  document.body.innerHTML = compiler.generateCodeFor("HTML");
}
  
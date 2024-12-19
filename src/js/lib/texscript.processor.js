import { updateSplashStatus } from "../splash/texscript.splash.js";

export async function process(compiler, rawCode) {
  try {
    compiler.compile(rawCode);
    const htmlCode = compiler.generateCodeFor("HTML");
    const dependencies = compiler.ast.dependencies;
    updateSplashStatus("Loading beauty...");
    await loadTexscriptStyles();
    updateSplashStatus("Loading dependencies...");
    await loadDependencies(dependencies);
    document.body.innerHTML = htmlCode;
    console.log("Compiler", compiler.toString());
  } catch (e) {
    updateSplashStatus(e, "error");
    console.log(e);
  }
}

async function loadDependencies(dependencies) {
  if (dependencies) {
    if (dependencies.CustomCSSFilePath) {
      await loadStylesToHead(dependencies.CustomCSSFilePath);
    }
  }
}

async function loadTexscriptStyles() {
  const texscriptScriptTag = document.querySelector('script[src$="texscript.js"]');
  if (texscriptScriptTag) {
    if (texscriptScriptTag.src) {
      const PATH = texscriptScriptTag.src.replace("texscript.js", "lib/css/texscript.css");
      await loadStylesToHead(PATH);
    }
  }
}

async function loadStylesToHead(href) {
  const linkTag = document.createElement("link");
  linkTag.rel = "stylesheet";
  linkTag.href = href;
  document.head.appendChild(linkTag);
  return await new Promise((res) => (linkTag.onload = res));
}

import { updateSplashStatus } from "../splash/texscript.splash.js";

export async function process(compiler, rawCode, callbackFn) {
  try {
    compiler.compile(rawCode);
    const htmlCode = compiler.generateCodeFor("HTML");
    const dependencies = compiler.ast.dependencies;
    loadTexscriptStyles();
    handleDependencies(dependencies);
    document.body.innerHTML = htmlCode;
    console.log("Compiler", compiler.toString());
  } catch (e) {
    updateSplashStatus(e, "error");
    console.log(e);
  }
}

function handleDependencies(dependencies) {
  if (dependencies) {
    if (dependencies.CustomCSSFilePath) {
      const linkTag = document.createElement("link");
      linkTag.rel = "stylesheet";
      linkTag.href = dependencies.CustomCSSFilePath;
      document.head.appendChild(linkTag);
    }
  }
}

function loadTexscriptStyles() {
  const texscriptScriptTag = document.querySelector('script[src$="texscript.js"]');
  if (texscriptScriptTag) {
    if (texscriptScriptTag.src) {
      const PATH = texscriptScriptTag.src.replace("texscript.js", "lib/css/texscript.css");
      const linkTag = document.createElement("link");
      linkTag.rel = "stylesheet";
      linkTag.href = PATH;
      document.head.appendChild(linkTag);
    }
  }
}

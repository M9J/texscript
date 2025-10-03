import { updateSplashStatus } from "../splash.js";
import ERRORS from "./constants/errors.js";

export async function process(compiler, rawCode) {
  try {
    updateSplashStatus("Compiling...");
    compiler.compile(rawCode);
    const dependencies = compiler.ast.dependencies;
    updateSplashStatus("Loading dependencies...");
    await loadDependencies(dependencies);
    const htmlCode = compiler.generateCodeFor("HTML");
    updateSplashStatus("Compilation done.");
    document.body.innerHTML = htmlCode;
    window.TexscriptCompiler = compiler.toString();
  } catch (e) {
    updateSplashStatus(e, "error");
    console.log(e);
  }
}

async function loadDependencies(dependencies) {
  try {
    if (dependencies) {
      if (dependencies.CustomCSSFilePath) {
        const PATH = dependencies.CustomCSSFilePath;
        await linkStylesToHead(PATH);
      }
    }
  } catch (e) {
    updateSplashStatus(e, "error");
    console.log(e);
  }
}

async function linkStylesToHead(href) {
  const linkTag = document.createElement("link");
  linkTag.rel = "stylesheet";
  linkTag.href = href;
  try {
    document.head.appendChild(linkTag);
    return await new Promise((res, rej) => {
      linkTag.onload = res(true);
      linkTag.onerror = () => {
        const errorMessage = ERRORS.ERR0018 + "<br/>" + href;
        rej(new Error(errorMessage));
      };
    });
  } catch (e) {
    updateSplashStatus(e, "error");
    console.log(e);
  }
}

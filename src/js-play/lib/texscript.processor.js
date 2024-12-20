import ERRORS from "./constants/errors.js";

export async function process(compiler, rawCode) {
  try {
    compiler.compile(rawCode);
    const htmlCode = compiler.generateCodeFor("HTML");
    const dependencies = compiler.ast.dependencies;
    console.log("Loading beauty...");
    await loadTexscriptStyles();
    console.log("Loading dependencies...");
    await loadDependencies(dependencies);
    const container = document.getElementsByClassName("texscript-container")[0];
    container.innerHTML = htmlCode;
    console.log("Compiler", compiler.toString());
  } catch (e) {
    console.log(e, "error");
    console.log(e);
  }
}

async function loadDependencies(dependencies) {
  try {
    if (dependencies) {
      if (dependencies.CustomCSSFilePath) {
        await loadStylesToHead(dependencies.CustomCSSFilePath);
      }
    }
  } catch (e) {
    console.log(e, "error");
    console.log(e);
  }
}

async function loadTexscriptStyles() {
  const PATH = "../../js-play/lib/css/texscript.css";
  await loadStylesToHead(PATH);
}

async function loadStylesToHead(href) {
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
    console.log(e, "error");
    console.log(e);
  }
}

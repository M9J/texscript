import { updateSplashStatus } from "./splash";
import ERRORS from "./constants/errors";
import Compiler from "./core/compiler";

export async function process(compiler: Compiler, rawCode: string): Promise<void> {
  try {
    updateSplashStatus("Compiling...");
    compiler.compile(rawCode);
    if (compiler.ast) {
      const dependencies = compiler.ast.dependencies;
      updateSplashStatus("Loading dependencies...");
      await loadDependencies(dependencies);
    }
    const htmlCode = compiler.generateCodeFor("HTML");
    updateSplashStatus("Compilation done.");
    const texscriptBannerContainer = document.querySelector(".texscript-banner-container");
    if (texscriptBannerContainer instanceof HTMLElement) {
      texscriptBannerContainer.style.display = "none";
    }
    const texscriptPages = document.createElement("div");
    texscriptPages.className = "texscript-pages";
    texscriptPages.innerHTML = htmlCode;
    const texscriptPagesContainer = document.createElement("div");
    texscriptPagesContainer.className = "texscript-pages-container";
    texscriptPagesContainer.appendChild(texscriptPages);
    document.body.appendChild(texscriptPagesContainer);
    window.TexscriptCompiler = {
      ...compiler.toString(),
      toggleSplash: () => {
        const splash = document.getElementById("texscript-splash");
        if (splash) splash.style.display = splash.style.display === "flex" ? "none" : "flex";
      },
    };
  } catch (e: unknown) {
    updateSplashStatus(e, "error");
    console.log(e);
  }
}

async function loadDependencies(dependencies?: { CustomCSSFilePath?: string }): Promise<void> {
  try {
    if (dependencies?.CustomCSSFilePath) {
      const PATH = dependencies.CustomCSSFilePath;
      await linkStylesToHead(PATH);
    }
  } catch (e: unknown) {
    updateSplashStatus(e, "error");
    console.log(e);
  }
}

async function linkStylesToHead(href: string): Promise<void> {
  const linkTag: HTMLLinkElement = document.createElement("link");
  linkTag.rel = "stylesheet";
  linkTag.href = href;

  try {
    document.head.appendChild(linkTag);
    await new Promise<void>((res, rej) => {
      linkTag.onload = () => res();
      linkTag.onerror = () => {
        const errorMessage = ERRORS.ERR0018 + "<br/>" + href;
        rej(new Error(errorMessage));
      };
    });
  } catch (e: unknown) {
    updateSplashStatus(e, "error");
    console.log(e);
  }
}

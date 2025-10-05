import {
  errors_default
} from "./chunk-AN3GKGAC.js";
import {
  toggleSplashStatus,
  updateSplashProgress,
  updateSplashStatus
} from "./chunk-RRXX54FP.js";
import "./chunk-77J4NURK.js";

// src-lib/v2/lib/processor.ts
async function process(compiler, rawCode) {
  try {
    updateSplashStatus("Compiling...");
    compiler.compile(rawCode);
    if (compiler.ast) {
      const dependencies = compiler.ast.dependencies;
      updateSplashStatus("Loading dependencies...");
      await loadDependencies(dependencies);
      updateSplashProgress("95");
    }
    const htmlCode = compiler.generateCodeFor("HTML");
    updateSplashStatus("Compilation done.");
    const texscriptBannerContainer = document.querySelector(".texscript-banner-container");
    if (texscriptBannerContainer instanceof HTMLElement) {
      texscriptBannerContainer.style.display = "none";
    }
    const texscriptPages = document.createElement("div");
    texscriptPages.className = "texscript-pages";
    updateSplashProgress("100");
    texscriptPages.innerHTML = htmlCode;
    const texscriptPagesContainer = document.createElement("div");
    texscriptPagesContainer.className = "texscript-pages-container";
    texscriptPagesContainer.appendChild(texscriptPages);
    document.body.appendChild(texscriptPagesContainer);
    window.TexscriptCompiler = {
      ...compiler.toString(),
      toggleSplashStatus: () => toggleSplashStatus()
    };
  } catch (e) {
    updateSplashStatus(e, "error");
    console.log(e);
  }
}
async function loadDependencies(dependencies) {
  try {
    if (dependencies == null ? void 0 : dependencies.CustomCSSFilePath) {
      const PATH = dependencies.CustomCSSFilePath;
      await linkStylesToHead(PATH);
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
    await new Promise((res, rej) => {
      linkTag.onload = () => res();
      linkTag.onerror = () => {
        const errorMessage = errors_default.ERR0018 + "<br/>" + href;
        rej(new Error(errorMessage));
      };
    });
  } catch (e) {
    updateSplashStatus(e, "error");
    console.log(e);
  }
}
export {
  process
};

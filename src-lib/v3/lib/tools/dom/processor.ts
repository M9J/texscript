

import { findHostElementFromDOM } from "../../../texscript";
import Metrics from "../benchmark/metrics";
import { loadCSSConfigurations } from "../../css/configure";
import { injectPreconnectLinks } from "../configurations/preconnect";
import Compiler from "../../compiler/compiler";
import { loadCSSFiles } from "../../css/file-loader";
import { updateSplashProgress, updateSplashStatus } from "./splash";
import { loadTexscriptStyles } from "../utils/styles";
import CodeGenerator from "../../compiler/codeGenerator";


export async function process(compiler: Compiler, rawCode: string): Promise<void> {
  try {
    const metricsProcess = new Metrics("Texscript Process");
    metricsProcess.start();
    
    updateSplashStatus("Compiling...");
    const ast = compiler.compile(rawCode);

    
    await loadTexscriptStyles();

    
    if (ast) {
      const configurations = ast.configurations;
      if (configurations) {
        updateSplashStatus("Loading configurations...");
        await loadConfigurations(configurations);
        updateSplashProgress("95");
      }

      const references = ast.references;
      if (references) {
        updateSplashStatus("Loading references...");
        await loadReferences(references);
        updateSplashProgress("98");
      }
    }

    
    const codeGenerator = new CodeGenerator(ast);
    const htmlCode = codeGenerator.generateCodeForHTML();
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
    texscriptPagesContainer.classList.add("display-none");
    texscriptPagesContainer.appendChild(texscriptPages);

    
    const hostElement = findHostElementFromDOM();
    hostElement.innerHTML = texscriptPagesContainer.outerHTML;

    await document.fonts.ready;
    texscriptPagesContainer.classList.remove("display-none");

    
    updateSplashProgress("100");
    metricsProcess.end();

    
    window.TexscriptCompiler = compiler.toString();

    
    loadLighthouseBestPractices();
  } catch (e: unknown) {
    
    updateSplashStatus(e, "error");
  }
}

async function loadReferences(references: Record<string, any>) {
  if (references) {
    injectPreconnectLinks();
    if (references.css) await loadCSSFiles(references.css);
  }
}

async function loadConfigurations(configurations: Record<string, any>) {
  if (configurations) {
    await loadCSSConfigurations(configurations);
  }
}

function loadLighthouseBestPractices() {
  
  if (!document.title || document.title.trim() === "") {
    document.title = "Texscript | " + location.host + location.pathname;
  }

  // Set default <html lang> if missing or empty
  const htmlEl = document.documentElement;
  if (!htmlEl.lang || htmlEl.lang.trim() === "") {
    htmlEl.lang = "en";
  }

  
  let metaDescTag = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;

  if (!metaDescTag) {
    metaDescTag = document.createElement("meta") as HTMLMetaElement;
    metaDescTag.name = "description";
    metaDescTag.content = "This page was compiled by Texscript Compiler";
    document.head.appendChild(metaDescTag);
  } else if (!metaDescTag.content || metaDescTag.content.trim() === "") {
    metaDescTag.content = "This page was compiled by Texscript Compiler";
  }
}

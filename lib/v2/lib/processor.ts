import { updateSplashStatus } from "../splash";
import ERRORS from "./constants/errors.js";

interface Compiler {
  compile: (code: string) => void;
  ast: {
    dependencies?: {
      CustomCSSFilePath?: string;
    };
  } | null;
  generateCodeFor: (target: string) => string;
  toString: () => {
    version: string;
    repoURL: string;
    lastCompilation: Map<string, null>;
  };
}

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
    document.body.innerHTML = htmlCode;
    window.TexscriptCompiler = compiler.toString();
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

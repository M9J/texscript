import { updateSplashStatus } from "../splash";

export async function loadTexscriptStyles(): Promise<void> {
  const texscriptScriptTag = document.querySelector('script[src$="texscript.js"]');
  if (texscriptScriptTag instanceof HTMLScriptElement) {
    if (texscriptScriptTag.src) {
      const PATH = texscriptScriptTag.src.replace("texscript.js", "texscript.css");
      await injectStylesToHead(PATH);
      await injectMetaToHead();
    }
  }
}

async function injectStylesToHead(stylesFilePath: string): Promise<void> {
  try {
    const cssFileContent = await fetch(stylesFilePath);
    if (cssFileContent) {
      const cssAsText = await cssFileContent.text();
      if (cssAsText) {
        const styleTag = document.createElement("style");
        styleTag.innerHTML = cssAsText;
        document.head.appendChild(styleTag);
      }
    }
  } catch (e) {
    updateSplashStatus(e, "error");
    console.log(e);
  }
}

async function injectMetaToHead() {
  const meta = document.createElement("meta");
  meta.setAttribute("name", "viewport");
  meta.setAttribute("content", "initial-scale=1.0, maximum-scale=1.0, user-scalable=no");
  document.head.appendChild(meta);
}

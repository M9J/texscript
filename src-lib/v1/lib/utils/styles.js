export async function loadTexscriptStyles() {
  const texscriptScriptTag = document.querySelector('script[src$="texscript.js"]');
  if (texscriptScriptTag) {
    if (texscriptScriptTag.src) {
      const PATH = texscriptScriptTag.src.replace("texscript.js", "styles.css");
      await injectStylesToHead(PATH);
    }
  }
}

async function injectStylesToHead(stylesFilePath) {
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

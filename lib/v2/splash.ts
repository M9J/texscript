const css_texscriptSplash: string = `
.texscript-splash-status {
  overflow: auto;
}

.texscript-splash-status-error {
  color: #a00;
}
`;

export async function loadSplash(): Promise<void> {
  try {
    const styleTag = document.createElement("style");
    styleTag.innerHTML = css_texscriptSplash;
    document.head.appendChild(styleTag);
    updateSplashStatus("Fetching Texscript Loader...");
    const texscriptLoader_js = await import("./lib/loader");
    updateSplashStatus("Fetched Texscript Loader");
    updateSplashStatus("Loading Texscript modules...");
    await texscriptLoader_js.load();
  } catch (e) {
    updateSplashStatus(e, "error");
    console.log(e);
  }
}

export function updateSplashStatus(line: any, type?: string): void {
  let formattedLine = "";
  const formatLine = (t: string) => `<div class="texscript-splash-status-${t}">${line}</div>`;
  if (type === "error") formattedLine = formatLine("error");
  else formattedLine = line;
  const texscriptSplashStatusDiv = document.getElementById("texscript-splash-status");
  if (texscriptSplashStatusDiv) {
    const printLine = (formattedLine: string) => {
      texscriptSplashStatusDiv.innerHTML += formattedLine + "<br/>";
    };
    printLine(formattedLine);
  }
}

const css_texscriptSplash: string = `
.texscript-splash {
  font-family: monospace;
  position: fixed;
  background: #fff;
  color: #000;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  padding: 8px;
}

.texscript-splash-status-error {
  color: #a00;
}
`;

const html_texscriptSplash = (banner: string): string => `
<div class="texscript-splash">
  ${banner}
  <br/><br/>
  <div>$&gt; texscript run</div>
  <br/>
  <div id="texscript-splash-status"></div>
</div>
`;

export async function loadSplash(banner: string): Promise<void> {
  try {
    const styleTag = document.createElement("style");
    styleTag.innerHTML = css_texscriptSplash;
    document.head.appendChild(styleTag);
    document.body.innerHTML = html_texscriptSplash(banner);
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

const BANNER = `Texscript Markup Language [Version 0.2]<br/>Free and Open Source. Licensed under GPL-3.0.<br/>Hosted on GitHub: <a href="https://github.com/M9J/texscript.git">texscript.git</a>`;

const TEXSCRIPT_BANNER_HTML = `
<div class="texscript-splash-container" id="texscript-splash">
  <div class="texscript-banner">
    <div>${BANNER}</div>
    <br/>
    <div>$&gt; texscript run</div>
    <br/>
    <div id="texscript-splash-status"></div>
  </div>
</div>
`;

const TEXSCRIPT_BANNER_CSS = `
.texscript-splash-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;  
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  background: #252529;
  margin: 0;
  box-sizing: border-box;
  display: none;
}

.texscript-banner {
  font-family: monospace;
  background: #fff;
  color: #000;
  padding: 16px;
  box-shadow: -4px -8px 16px rgba(0, 0, 0, 0.5);
  box-sizing: border-box;
}

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
    styleTag.innerHTML = TEXSCRIPT_BANNER_CSS;
    document.head.appendChild(styleTag);
    const splashBannerContainer = document.createElement("div");
    splashBannerContainer.innerHTML = TEXSCRIPT_BANNER_HTML;
    document.body.appendChild(splashBannerContainer);
    updateSplashStatus("Fetching Texscript Loader...");
    const texscriptLoader_js = await import("./loader");
    updateSplashProgress("10");
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
  if (type && ["error"].includes(type)) {
    const texscriptSplash = document.getElementById("texscript-splash");
    if (texscriptSplash) texscriptSplash.style.display = "flex";
  }
}

export function toggleSplashStatus() {
  const splash = document.getElementById("texscript-splash");
  if (splash) splash.style.display = splash.style.display === "flex" ? "none" : "flex";
}

export function updateSplashProgress(value: string) {
  if (value) {
    const progressBar = document.getElementById("texscript-splash-progress");
    if (progressBar) progressBar.setAttribute("value", value);
    if (parseInt(value) > 99) hideSplashProgress();
  }
}

export function hideSplashProgress() {
  const progressBar = document.getElementById("texscript-splash-progress");
  if (progressBar) progressBar.style.display = "none";
}

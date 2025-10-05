// src-lib/v2/lib/splash.ts
var BANNER = `Texscript Markup Language [Version 0.2]<br/>Free and Open Source. Licensed under GPL-3.0.<br/>Hosted on GitHub: <a href="https://github.com/M9J/texscript.git">texscript.git</a>`;
var TEXSCRIPT_BANNER_HTML = `
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
var TEXSCRIPT_BANNER_CSS = `
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
async function loadSplash() {
  try {
    updateSplashProgress("8");
    const styleTag = document.createElement("style");
    styleTag.innerHTML = TEXSCRIPT_BANNER_CSS;
    document.head.appendChild(styleTag);
    const splashBannerContainer = document.createElement("div");
    splashBannerContainer.innerHTML = TEXSCRIPT_BANNER_HTML;
    document.body.appendChild(splashBannerContainer);
    updateSplashStatus("Fetching Texscript Loader...");
    const texscriptLoader_js = await import("./loader-EKXBBR7K.js");
    updateSplashProgress("10");
    updateSplashStatus("Fetched Texscript Loader");
    updateSplashStatus("Loading Texscript modules...");
    await texscriptLoader_js.load();
  } catch (e) {
    updateSplashStatus(e, "error");
    console.log(e);
  }
}
function updateSplashStatus(line, type) {
  let formattedLine = "";
  const formatLine = (t) => `<div class="texscript-splash-status-${t}">${line}</div>`;
  if (type === "error") formattedLine = formatLine("error");
  else formattedLine = line;
  const texscriptSplashStatusDiv = document.getElementById("texscript-splash-status");
  if (texscriptSplashStatusDiv) {
    const printLine = (formattedLine2) => {
      texscriptSplashStatusDiv.innerHTML += formattedLine2 + "<br/>";
    };
    printLine(formattedLine);
  }
  if (type && ["error"].includes(type)) {
    const texscriptSplash = document.getElementById("texscript-splash");
    if (texscriptSplash) texscriptSplash.style.display = "flex";
  }
}
function toggleSplashStatus() {
  const splash = document.getElementById("texscript-splash");
  if (splash) splash.style.display = splash.style.display === "flex" ? "none" : "flex";
}
function updateSplashProgress(value) {
  if (value) {
    const progressBar = document.getElementById("texscript-splash-progress");
    if (progressBar) progressBar.setAttribute("value", value);
    if (parseInt(value) > 99) hideSplashProgress();
  }
}
function hideSplashProgress() {
  const progressBar = document.getElementById("texscript-splash-progress");
  if (progressBar) progressBar.style.display = "none";
}

export {
  loadSplash,
  updateSplashStatus,
  toggleSplashStatus,
  updateSplashProgress,
  hideSplashProgress
};

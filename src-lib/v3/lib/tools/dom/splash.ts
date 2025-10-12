import { findHostElementFromDOM } from "../../../texscript";
import SPLASH_CSS from "./splash.css";

const BANNER = `Texscript Markup Language [Version 0.2]<br/>Free and Open Source. Licensed under GPL-3.0.<br/>Hosted on GitHub: <a href="https://github.com/M9J/texscript.git">texscript.git</a>`;

const TEXSCRIPT_SPLASH_HTML = `
<div class="texscript-splash-container" id="texscript-splash">
  <div class="texscript-splash">
    <div>${BANNER}</div>
    <br/><hr/><br/>
    <div id="texscript-splash-status"></div>
  </div>
</div>
`;

const TEXSCRIPT_SPLASH_CSS = SPLASH_CSS;

export async function loadSplash(): Promise<void> {
  try {
    updateSplashProgress("8");

    const styleTag = document.createElement("style");
    styleTag.innerHTML = TEXSCRIPT_SPLASH_CSS;
    document.head.appendChild(styleTag);

    const splashContainer = document.createElement("div");
    splashContainer.innerHTML = TEXSCRIPT_SPLASH_HTML;

    const hostElement = findHostElementFromDOM();
    hostElement.appendChild(splashContainer);

    updateSplashStatus("Fetching Texscript Loader...");

    const texscriptLoader_js = await import("./loader");

    updateSplashProgress("10");
    updateSplashStatus("Fetched Texscript Loader");

    updateSplashStatus("Loading Texscript modules...");
    await texscriptLoader_js.load();
  } catch (e) {
    updateSplashStatus(e, "error");
  }
}

export function updateSplashStatus(line: any, type?: string): void {
  let formattedLine = "";
  // Helper to wrap line in a styled div

  // Apply error styling if type is "error"
  if (type === "error") {
    const formatLine = (t: string) =>
      `<div class="texscript-splash-status-${t}">${line
        .toString()
        .replaceAll("\n", "<br/>")}</div>`;
    formattedLine = formatLine("error");
  } else {
    formattedLine = `<div>${line}</div>`;
  }

  const texscriptSplashStatusDiv = document.getElementById("texscript-splash-status");
  if (texscriptSplashStatusDiv) {
    const printLine = (formattedLine: string) => {
      texscriptSplashStatusDiv.innerHTML += formattedLine;
    };
    printLine(formattedLine);
  }

  if (type && ["error"].includes(type)) {
    const texscriptSplash = document.getElementById("texscript-splash");
    if (texscriptSplash) texscriptSplash.style.display = "flex";
  }

  if (type === "error") {
    console.error(line);
  }
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

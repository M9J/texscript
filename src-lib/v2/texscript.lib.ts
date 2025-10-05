import { findHostElementFromDOM } from "./texscript.js";

const PROGRESS_CSS = `
progress.texscript-splash-progress-bar {
  width: 100%;
  height: 4px;
  position: sticky;
  top: 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  appearance: none;
  block-size: 4px;
  vertical-align: top;
}

/* Chrome, Safari, Edge */
progress.texscript-splash-progress-bar::-webkit-progress-bar {
  background-color: #252529;
}

/* Firefox */
progress.texscript-splash-progress-bar::-moz-progress-bar {
  background-color: #252529;
}

progress.texscript-splash-progress-bar::-webkit-progress-value {
  background-color: #2196F3;
}

progress.texscript-splash-progress-bar::-webkit-progress-value {
  transition: width 1s ease-in-out;
}
`;

export async function load() {
  const hostElement = findHostElementFromDOM();
  const styleTag = document.createElement("style");
  styleTag.innerHTML = PROGRESS_CSS;
  document.head.appendChild(styleTag);
  const pg = document.createElement("progress");
  pg.setAttribute("class", "texscript-splash-progress-bar");
  pg.setAttribute("id", "texscript-splash-progress");
  pg.setAttribute("value", "0");
  pg.setAttribute("max", "100");
  hostElement.appendChild(pg);
  pg.setAttribute("value", "2");
  const splash = await import("./lib/splash.js");
  pg.setAttribute("value", "5");
  await splash.loadSplash();
}

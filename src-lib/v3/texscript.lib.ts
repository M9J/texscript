

import { findHostElementFromDOM } from "./texscript.js";
import TEXSCRIPT_LIB_CSS from "./texscript.lib.css";


const PROGRESS_CSS = TEXSCRIPT_LIB_CSS;


export async function load() {
  
  const hostElement = findHostElementFromDOM();

  
  const styleTag = document.createElement("style");
  styleTag.textContent = PROGRESS_CSS;
  document.head.appendChild(styleTag);

  
  const pg = document.createElement("progress");
  pg.setAttribute("class", "texscript-splash-progress-bar");
  pg.setAttribute("id", "texscript-splash-progress");
  pg.setAttribute("value", "0");
  pg.setAttribute("max", "100");

  
  hostElement.appendChild(pg);

  
  pg.setAttribute("value", "2");

  
  const splash = await import("./lib/tools/dom/splash.js");

  
  pg.setAttribute("value", "5");

  
  await splash.loadSplash();
}

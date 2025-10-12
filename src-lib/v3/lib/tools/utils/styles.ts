import TEXSCRIPT_STYLES from "../../../css/texscript.css";
import { updateSplashStatus } from "../../tools/dom/splash";

export async function loadTexscriptStyles(): Promise<void> {
  await injectStylesToHead();
  await injectMetaToHead();
}

async function injectStylesToHead(): Promise<void> {
  try {
    const styleTag = document.createElement("style");
    styleTag.textContent = TEXSCRIPT_STYLES;
    document.head.appendChild(styleTag);
  } catch (e) {
    updateSplashStatus(e, "error");
  }
}

async function injectMetaToHead() {
  const meta = document.createElement("meta");
  meta.setAttribute("name", "viewport");
  meta.setAttribute("content", "width=device-width, initial-scale=1.0");
  document.head.appendChild(meta);
}

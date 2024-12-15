import STYLES_BASE from "../styles/base.css.js";
import STYLES_BRANDING from "../styles/branding.css.js";
import STYLES_TEXSCRIPT from "../styles/texscript.css.js";
import STYLES_PRINT from "../styles/print.css.js";

export function setup() {
  addBaseStyles();
  addBrandingStyles();
  // addBranding();
  addTexscriptStyles();
  addPrintStyles();
}

function addBaseStyles() {
  const styles = document.createElement("style");
  styles.innerHTML = STYLES_BASE;
  document.head.appendChild(styles);
}

function addBrandingStyles() {
  const styles = document.createElement("style");
  styles.innerHTML = STYLES_BRANDING;
  document.head.appendChild(styles);
}

// function addBranding() {
//   const branding = document.createElement("div");
//   branding.classList.add("texscript-branding");
//   branding.innerHTML = "TEXScript";
//   document.body.appendChild(branding);
// }

function addTexscriptStyles() {
  const styles = document.createElement("style");
  styles.innerHTML = STYLES_TEXSCRIPT;
  document.head.appendChild(styles);
}

function addPrintStyles() {
  const styles = document.createElement("style");
  styles.innerHTML = STYLES_PRINT;
  document.head.appendChild(styles);
}

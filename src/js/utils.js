import * as CSS_STYLES from "./styles.js";

export function setup() {
  const texStyle = document.createElement("style");
  texStyle.innerHTML = CSS_STYLES.BRANDING;
  document.body.appendChild(texStyle);

  const branding = document.createElement("div");
  branding.classList.add("texscript-branding");
  branding.innerHTML = "TEXScript";
  document.body.appendChild(branding);
}

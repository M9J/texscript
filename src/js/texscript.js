const TEXSCRIPT_CSS_PATH = "./css/texscript.css";
const TEXSCRIPT_COMPILER_PATH = "./compiler.js";

fetch(TEXSCRIPT_CSS_PATH)
  .then((c) => c.text())
  .then((c) => {
    const texStyle = document.createElement("style");
    texStyle.innerHTML = c;
    document.body.appendChild(texStyle);
    addBrandingToScreen();
    import(TEXSCRIPT_COMPILER_PATH).then((m) => new m.default());
  });

function addBrandingToScreen() {
  const branding = document.createElement("div");
  branding.classList.add("texscript-branding");
  branding.innerHTML = "TEXScript";
  document.body.appendChild(branding);
}

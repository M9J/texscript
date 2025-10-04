const BANNER = `Texscript Markup Language [Version 0.2]<br/>Free and Open Source. Licensed under GPL-3.0.<br/>Hosted on GitHub: <a href="https://github.com/M9J/texscript.git">texscript.git</a>`;

const TEXSCRIPT_BANNER_HTML = `
<div class="texscript-banner-container">
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
.texscript-banner-container {
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
}

.texscript-banner {
  font-family: monospace;
  background: #fff;
  color: #000;
  padding: 16px;
  box-shadow: -4px -8px 16px rgba(0, 0, 0, 0.5);
  box-sizing: border-box;
}
`;

document.addEventListener("DOMContentLoaded", async () => {
  const styleTag = document.createElement("style");
  styleTag.innerHTML = TEXSCRIPT_BANNER_CSS;
  document.head.appendChild(styleTag);
  document.body.innerHTML = TEXSCRIPT_BANNER_HTML  ;
  const splash = await import("./splash");
  splash.loadSplash(); 
});

const css_texscriptSplashContainer = `
body {
  margin: 0;
  padding: 0;
  background: #888;
}

.texscript-splash-container {
  color: #000;
  text-align: left;
  font-family: monospace;
  padding: 24px;
  width: auto;
  height: auto;
  font-size: 1em;
}
`;

const html_texscriptSplash = `
<div class="texscript-splash-container">
  <div>$&gt; texscript --version</div>
  <br/>
  <div style="font-size: 24px;">TEXScript Markup Language</div>
  <div>Version: v0.1</div>
  <br/>
  <div>$&gt; texscript start</div>
  <br/>
  <div>Started TEXScript</div>
  <div id="texscript-loader-status"></div>
</div>
`;

export async function loadSplash() {
  const styleTag = document.createElement("style");
  styleTag.innerHTML = css_texscriptSplashContainer;
  document.head.appendChild(styleTag);
  document.body.innerHTML = html_texscriptSplash;
  const texscriptLoader_js = await import("./texscript.loader.js");
  await texscriptLoader_js.loadTexscript();
}

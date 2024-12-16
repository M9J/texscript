const css_texscriptSplashContainer = `
body {
  margin: 0;
  padding: 0;
}

.texscript-splash-container {
  font-family: monospace;
  padding: 24px;
  font-size: 2em;
}
`;

const html_texscriptSplash = `
<div class="texscript-splash-container">
  <div>$&gt; texscript --version</div>
  <br/>
  <div>TEXScript Markup Language</div>
  <div>Version: v0.1</div>
  <br/>
  <div>$&gt; texscript run</div>
  <br/>
  <div>Started TEXScript Loader...</div>
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

const css_texscriptSplashContainer = `
.texscript-splash-container {
  font-family: monospace;
}
`;

const html_texscriptSplash = `
<br/><br/>
<div class="texscript-splash-container">
  <div>$&gt; texscript run</div>
  <br/>
  <div id="texscript-loader-status"></div>
</div>
`;

export async function loadSplash() {
  const styleTag = document.createElement("style");
  styleTag.innerHTML = css_texscriptSplashContainer;
  document.head.appendChild(styleTag);
  document.body.innerHTML += html_texscriptSplash;
  const texscriptLoaderStatusDiv = document.getElementById("texscript-loader-status");
  const printLine = (line) => (texscriptLoaderStatusDiv.innerHTML += line + "<br/>");
  printLine("Fetching Texscript Loader...");
  const texscriptLoader_js = await import("./texscript.loader.js");
  printLine("Texscript Loader: Started");
  await texscriptLoader_js.load();
}

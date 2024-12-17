const css_texscriptSplash = `
.texscript-splash {
  font-family: monospace;
}

.texscript-splash-status-error {
  color: #a00;
}
`;

const html_texscriptSplash = `
<br/><br/>
<div class="texscript-splash">
  <div>$&gt; texscript run</div>
  <br/>
  <div id="texscript-splash-status"></div>
</div>
`;

export async function loadSplash() {
  try {
    const styleTag = document.createElement("style");
    styleTag.innerHTML = css_texscriptSplash;
    document.head.appendChild(styleTag);
    document.body.innerHTML += html_texscriptSplash;
    updateSplashStatus("Fetching Texscript Loader...");
    const texscriptLoader_js = await import("./texscript.loader.js");
    updateSplashStatus("Texscript Loader: Started");
    await texscriptLoader_js.load();
  } catch (e) {
    updateSplashStatus(e, "error");
    console.log(e);
  }
}

export function updateSplashStatus(line, type) {
  let formattedLine = "";
  const formatLine = (t) => `<div class="texscript-splash-status-${t}">${line}</div>`;
  if (type === "error") formattedLine = formatLine("error");
  else formattedLine = line;
  const texscriptSplashStatusDiv = document.getElementById("texscript-splash-status");
  const printLine = (formattedLine) => (texscriptSplashStatusDiv.innerHTML += formattedLine + "<br/>");
  printLine(formattedLine);
}

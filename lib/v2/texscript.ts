const BANNER = `Texscript Markup Language [Version 0.1]<br/>Free and Open Source. Licensed under GPL-3.0.<br/>Hosted on GitHub. Repository: <a href="https://github.com/M9J/texscript.git">texscript.git</a>`;

document.addEventListener("DOMContentLoaded", async () => {
  document.body.style.fontFamily = "monospace";
  document.body.innerHTML = BANNER;
  const splash = await import("./splash");
  splash.loadSplash(BANNER);
});

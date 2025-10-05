export async function load() {
  const pg = document.createElement("progress");
  pg.setAttribute("class", "texscript-splash-progress-bar");
  pg.setAttribute("id", "texscript-splash-progress");
  pg.setAttribute("value", "0");
  pg.setAttribute("max", "100");
  document.body.appendChild(pg);
  const splash = await import("./lib/splash.js");
  await splash.loadSplash();
}

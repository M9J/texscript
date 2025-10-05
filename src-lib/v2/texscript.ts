document.addEventListener("DOMContentLoaded", async () => {
  document.body.style.background = "#252529";
  const lib = await import("./texscript.lib.js");
  lib.load();
});

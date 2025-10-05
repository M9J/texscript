document.addEventListener("DOMContentLoaded", async () => {
  document.body.style.background = "#252529";
  document.body.style.margin = "0px";
  document.body.style.padding = "0px";
  const lib = await import("./texscript.lib.js");
  lib.load();
});

document.addEventListener("DOMContentLoaded", async () => {
  if (window.__texscript_loaded__) return;
  window.__texscript_loaded__ = true;

  const hostElement = findHostElementFromDOM();

  if (hostElement instanceof HTMLElement) {
    hostElement.setAttribute("id", "TexscriptHostElement");
    hostElement.classList.add("reset");

    if (!(hostElement instanceof HTMLBodyElement)) hostElement.innerHTML = "";
    
    hostElement.style.background = "#252529";
    hostElement.style.margin = "0px";
    hostElement.style.padding = "0px";
  }

  const lib = await import("./texscript.lib.js");
  lib.load();
});

export function findHostElementFromDOM(): HTMLElement | Element {
  const hostElement = document.querySelector("[data-texscript-host]");

  if (hostElement) return hostElement;
  else return document.body;
}

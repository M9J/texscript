/**
 * Texscript Initialization Module
 *
 * This module handles the initialization and setup of the Texscript runtime environment.
 * It ensures single initialization, prepares the host DOM element, and loads the core library.
 *
 * @module texscript
 */

/**
 * Initializes the Texscript environment when the DOM is fully loaded.
 *
 * This event listener performs the following steps:
 * 1. Prevents multiple initializations using a global flag
 * 2. Locates or defaults to a host element in the DOM
 * 3. Configures the host element with proper styling and attributes
 * 4. Dynamically imports and loads the Texscript library
 *
 * @listens DOMContentLoaded
 */
document.addEventListener("DOMContentLoaded", async () => {
  // Prevent multiple initializations by checking the global flag
  if (window.__texscript_loaded__) return;
  window.__texscript_loaded__ = true;

  // Locate the designated host element for Texscript
  const hostElement = findHostElementFromDOM();

  // Configure the host element if it's a valid HTML element
  if (hostElement instanceof HTMLElement) {
    // Set standardized ID for element identification
    hostElement.setAttribute("id", "TexscriptHostElement");

    // Apply reset class to clear inherited styles
    hostElement.classList.add("reset");

    // Clear content for non-body elements to provide clean slate
    if (!(hostElement instanceof HTMLBodyElement)) hostElement.innerHTML = "";

    // Apply dark theme background and reset spacing
    hostElement.style.background = "#252529";
    hostElement.style.margin = "0px";
    hostElement.style.padding = "0px";
  }

  // Dynamically import and initialize the Texscript core library
  const lib = await import("./texscript.lib.js");
  lib.load();
});

/**
 * Locates the host element for the Texscript runtime in the DOM.
 *
 * The function searches for an element with the `data-texscript-host` attribute.
 * If no such element exists, it falls back to using the document body as the host.
 *
 * This allows developers to explicitly designate a container for Texscript or
 * let it default to taking over the entire page body.
 *
 * @returns {HTMLElement | Element} The host element for Texscript initialization.
 *                                   Either a custom element with the data attribute
 *                                   or the document body.
 *
 * @example
 * // HTML with explicit host
 * // <div data-texscript-host></div>
 * const host = findHostElementFromDOM(); // Returns the div
 *
 * @example
 * // HTML without explicit host
 * const host = findHostElementFromDOM(); // Returns document.body
 */
export function findHostElementFromDOM(): HTMLElement | Element {
  const hostElement = document.querySelector("[data-texscript-host]");

  // Return explicit host if found, otherwise default to body
  if (hostElement) return hostElement;
  else return document.body;
}

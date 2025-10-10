/**
 * Texscript Library Loader
 *
 * This module manages the loading sequence of the Texscript library with visual feedback.
 * It creates and manages a progress bar to indicate loading status and coordinates
 * the splash screen initialization.
 *
 * @module texscript-lib
 */

import { findHostElementFromDOM } from "./texscript.js";
import TEXSCRIPT_LIB_CSS from "./texscript.lib.css";

/**
 * CSS styles for the Texscript loading progress bar.
 *
 * Defines a minimal, sticky progress bar with cross-browser compatibility.
 * The bar appears at the top of the host element and provides visual feedback
 * during the library loading process.
 *
 * Browser-specific pseudo-elements ensure consistent appearance across:
 * - WebKit browsers (Chrome, Safari, Edge)
 * - Firefox (Gecko)
 *
 * @constant {string}
 */
const PROGRESS_CSS = TEXSCRIPT_LIB_CSS;

/**
 * Loads the Texscript library with visual progress indication.
 *
 * This function orchestrates the library loading sequence:
 * 1. Injects progress bar styles into the document
 * 2. Creates and configures a progress bar element
 * 3. Updates progress as loading milestones are reached
 * 4. Dynamically imports and initializes the splash screen
 *
 * The progress bar provides user feedback during the asynchronous loading process,
 * improving perceived performance and user experience.
 *
 * @async
 * @returns {Promise<void>} Resolves when the splash screen has been loaded
 *
 * @example
 * // Initialize the library
 * await load();
 */
export async function load() {
  // Locate the host element where the progress bar will be mounted
  const hostElement = findHostElementFromDOM();

  // Inject progress bar styles into the document head
  const styleTag = document.createElement("style");
  styleTag.textContent = PROGRESS_CSS;
  document.head.appendChild(styleTag);

  // Create and configure the progress bar element
  const pg = document.createElement("progress");
  pg.setAttribute("class", "texscript-splash-progress-bar");
  pg.setAttribute("id", "texscript-splash-progress");
  pg.setAttribute("value", "0");
  pg.setAttribute("max", "100");

  // Mount the progress bar to the host element
  hostElement.appendChild(pg);

  // Initial progress update (2%)
  pg.setAttribute("value", "2");

  // Dynamically import the splash module
  const splash = await import("./lib/tools/dom/splash.js");

  // Update progress after module import (5%)
  pg.setAttribute("value", "5");

  // Initialize and display the splash screen
  await splash.loadSplash();
}

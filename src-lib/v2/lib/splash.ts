/**
 * Texscript Splash Screen Module
 *
 * Manages the initialization splash screen that displays during the Texscript
 * loading process. The splash screen provides visual feedback about loading
 * progress, displays version information, and shows any errors that occur
 * during initialization.
 *
 * The splash screen includes:
 * - A banner with version and licensing information
 * - A progress bar showing loading percentage
 * - A status log displaying loading steps and errors
 *
 * @module splash
 */

import { findHostElementFromDOM } from "../texscript";

/**
 * Banner content displaying Texscript version and licensing information.
 *
 * This HTML content is shown at the top of the splash screen to inform
 * users about the version they're running and provide a link to the
 * source repository.
 *
 * @constant {string}
 */
const BANNER = `Texscript Markup Language [Version 0.2]<br/>Free and Open Source. Licensed under GPL-3.0.<br/>Hosted on GitHub: <a href="https://github.com/M9J/texscript.git">texscript.git</a>`;

/**
 * HTML structure for the splash screen container.
 *
 * Creates a fixed overlay that displays the banner and a status area
 * for showing loading progress messages and errors.
 *
 * @constant {string}
 */
const TEXSCRIPT_BANNER_HTML = `
<div class="texscript-splash-container" id="texscript-splash">
  <div class="texscript-banner">
    <div>${BANNER}</div>
    <br/><hr/><br/>
    <div id="texscript-splash-status"></div>
  </div>
</div>
`;

/**
 * CSS styles for the splash screen.
 *
 * Defines a terminal-like appearance with:
 * - Full-screen dark background overlay
 * - Bottom-anchored white banner with monospace font
 * - Shadow effect for visual depth
 * - Error state styling (red text)
 *
 * The splash is hidden by default and only shown when errors occur
 * or explicitly toggled.
 *
 * @constant {string}
 */
const TEXSCRIPT_BANNER_CSS = `
.texscript-splash-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;  
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  background: #252529;
  margin: 0;
  box-sizing: border-box;
  display: none;
}

.texscript-banner {
  font-family: monospace;
  background: #fff;
  color: #000;
  padding: 16px;
  box-shadow: -4px -8px 16px rgba(0, 0, 0, 0.5);
  box-sizing: border-box;
}

.texscript-splash-status {
  overflow: auto;
}

.texscript-splash-status-error {
  color: #a00;
}
`;

/**
 * Initializes and displays the splash screen during Texscript loading.
 *
 * This function orchestrates the loading sequence:
 * 1. Injects splash screen styles
 * 2. Creates and mounts the splash screen HTML
 * 3. Updates progress indicators
 * 4. Dynamically imports and initializes the Texscript loader
 * 5. Displays status messages during each step
 *
 * If any error occurs during loading, it's caught and displayed in the
 * splash screen status area for debugging.
 *
 * @async
 * @returns {Promise<void>} Resolves when the loader has been initialized
 *
 * @example
 * await loadSplash();
 */
export async function loadSplash(): Promise<void> {
  try {
    // Update progress to 8% - splash initialization started
    updateSplashProgress("8");

    // Inject splash screen styles into document head
    const styleTag = document.createElement("style");
    styleTag.innerHTML = TEXSCRIPT_BANNER_CSS;
    document.head.appendChild(styleTag);

    // Create splash screen container
    const splashBannerContainer = document.createElement("div");
    splashBannerContainer.innerHTML = TEXSCRIPT_BANNER_HTML;

    // Mount splash screen to the host element
    const hostElement = findHostElementFromDOM();
    hostElement.appendChild(splashBannerContainer);

    // Inform user that loader is being fetched
    updateSplashStatus("Fetching Texscript Loader...");

    // Dynamically import the loader module
    const texscriptLoader_js = await import("./loader");

    // Update progress to 10% - loader fetched successfully
    updateSplashProgress("10");
    updateSplashStatus("Fetched Texscript Loader");

    // Begin loading Texscript modules
    updateSplashStatus("Loading Texscript modules...");
    await texscriptLoader_js.load();
  } catch (e) {
    // Display any errors that occur during loading
    updateSplashStatus(e, "error");
  }
}

/**
 * Appends a status message to the splash screen log.
 *
 * Messages are appended to the status area in the splash screen,
 * creating a sequential log of loading events. Error messages are
 * styled differently and also logged to the console.
 *
 * When an error occurs, the splash screen is automatically made
 * visible so users can see what went wrong.
 *
 * @param {any} line - The status message to display (converted to string)
 * @param {string} [type] - Optional message type. Use "error" for error messages
 * @returns {void}
 *
 * @example
 * updateSplashStatus("Compiling code...");
 * updateSplashStatus("Failed to parse syntax", "error");
 */
export function updateSplashStatus(line: any, type?: string): void {
  let formattedLine = "";

  // Helper to wrap line in a styled div
  const formatLine = (t: string) => `<div class="texscript-splash-status-${t}">${line}</div>`;

  // Apply error styling if type is "error"
  if (type === "error") formattedLine = formatLine("error");
  else formattedLine = `<div>${line}</div>`;

  // Append the formatted line to the status area
  const texscriptSplashStatusDiv = document.getElementById("texscript-splash-status");
  if (texscriptSplashStatusDiv) {
    const printLine = (formattedLine: string) => {
      texscriptSplashStatusDiv.innerHTML += formattedLine;
    };
    printLine(formattedLine);
  }

  // Show splash screen on error so users can see the problem
  if (type && ["error"].includes(type)) {
    const texscriptSplash = document.getElementById("texscript-splash");
    if (texscriptSplash) texscriptSplash.style.display = "flex";
  }

  // Also log errors to browser console for debugging
  if (type === "error") console.error(line);
}

/**
 * Toggles the visibility of the splash screen.
 *
 * Switches between showing and hiding the splash screen overlay.
 * Useful for debugging or allowing users to inspect loading details.
 *
 * @returns {void}
 *
 * @example
 * // Show/hide splash on keyboard shortcut
 * document.addEventListener('keydown', (e) => {
 *   if (e.key === 'F12') toggleSplashStatus();
 * });
 */
export function toggleSplashStatus() {
  const splash = document.getElementById("texscript-splash");
  if (splash) splash.style.display = splash.style.display === "flex" ? "none" : "flex";
}

/**
 * Updates the progress bar value.
 *
 * Sets the progress bar to a specific percentage value. When the
 * progress reaches 100%, the progress bar is automatically hidden.
 *
 * @param {string} value - Progress percentage as a string (0-100)
 * @returns {void}
 *
 * @example
 * updateSplashProgress("25"); // 25% complete
 * updateSplashProgress("100"); // 100% - progress bar will be hidden
 */
export function updateSplashProgress(value: string) {
  if (value) {
    const progressBar = document.getElementById("texscript-splash-progress");

    // Update progress bar value attribute
    if (progressBar) progressBar.setAttribute("value", value);

    // Hide progress bar when loading is complete
    if (parseInt(value) > 99) hideSplashProgress();
  }
}

/**
 * Hides the progress bar from view.
 *
 * Called automatically when loading reaches 100%. Removes the progress
 * bar from the UI while keeping the splash screen available for displaying
 * the status log.
 *
 * @returns {void}
 */
export function hideSplashProgress() {
  const progressBar = document.getElementById("texscript-splash-progress");
  if (progressBar) progressBar.style.display = "none";
}

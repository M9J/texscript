/**
 * Texscript Module Loader
 *
 * Orchestrates the sequential loading and initialization of all Texscript modules.
 * This module manages the dependency chain, ensuring components are loaded in the
 * correct order while providing visual feedback through the splash screen.
 *
 * Loading sequence:
 * 1. Utility modules (DOM and style utilities)
 * 2. Constants and error definitions
 * 3. Styling system initialization
 * 4. Core compiler engine
 * 5. Source code discovery and processing
 *
 * @module loader
 */

import { updateSplashProgress, updateSplashStatus } from "./splash";

/**
 * Loads and initializes all Texscript modules in the correct dependency order.
 *
 * This function manages the complete initialization sequence for Texscript:
 * - Dynamically imports modules to enable code splitting
 * - Updates progress indicators after each loading milestone
 * - Provides user-friendly status messages (with playful descriptions)
 * - Discovers Texscript source code in the DOM
 * - Compiles and processes the discovered code
 *
 * All loading steps are wrapped in error handling to catch and display
 * initialization failures in the splash screen.
 *
 * Progress milestones:
 * - 20%: Utility modules loaded
 * - 30%: Error constants loaded
 * - 40%: Styles applied
 * - 50%: Compiler loaded
 * - 60%: Processor loaded
 * - 90%: Source code discovered
 * - 100%: Compilation complete (set by processor)
 *
 * @async
 * @returns {Promise<void>} Resolves when all modules are loaded and code is processed
 * @throws {Error} Throws ERR0001 if no Texscript code is found in the document
 *
 * @example
 * // Called automatically by the splash screen
 * await load();
 */
export async function load(): Promise<void> {
  try {
    // Load utility modules for DOM manipulation and styling
    updateSplashStatus("Getting handy tools...");
    updateSplashProgress("20");
    const dom_js = await import("./utils/dom");
    const styles_js = await import("./utils/styles");

    // Load error message catalog
    updateSplashStatus("Opening curse words...");
    updateSplashProgress("30");
    const errors_js = await import("./constants/errors");

    // Initialize and inject Texscript styling into the document
    updateSplashStatus("Applying beauty makeup...");
    updateSplashProgress("40");
    await styles_js.loadTexscriptStyles();

    // Load the core compiler and processor modules
    updateSplashStatus("Loading brain power...");
    updateSplashProgress("50");
    const compiler_js = await import("./core/compiler");
    const compiler = new compiler_js.default();
    const processor = await import("./processor");
    updateSplashProgress("60");

    // Discover Texscript source code in the DOM
    updateSplashStatus("Finding your story...");
    const rawCode = await dom_js.findCodeFromDOM();

    // Validate that source code was found
    if (!rawCode) throw new Error(errors_js.default.ERR0001);

    updateSplashProgress("90");

    // Compile and render the discovered source code
    processor.process(compiler, rawCode);
  } catch (e) {
    // Display any errors that occur during the loading sequence
    updateSplashStatus(e, "error");
  }
}

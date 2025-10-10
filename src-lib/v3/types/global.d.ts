/**
 * Global Type Declarations for Texscript
 *
 * This module extends the global Window interface with Texscript-specific
 * properties and APIs. These declarations provide TypeScript type safety
 * for runtime globals that are added during Texscript initialization.
 *
 * The declarations enable:
 * - Type checking for Texscript global state
 * - IntelliSense/autocomplete in IDEs
 * - Compile-time validation of global API usage
 *
 * @module global
 * @file Type declarations for Texscript runtime globals
 */

// Empty export to ensure this file is treated as a module
export {};

/**
 * Augments the global namespace with Texscript-specific types.
 *
 * This declaration merging extends the built-in Window interface without
 * modifying the global scope at runtime. It only affects TypeScript's
 * type system.
 */
declare global {
  /**
   * Extended Window interface with Texscript runtime properties.
   */
  interface Window {
    /**
     * Flag indicating whether Texscript has been initialized.
     *
     * Used to prevent multiple initializations of the Texscript runtime.
     * Set to true by the main initialization script after loading begins.
     *
     * @see texscript.ts - DOMContentLoaded event handler
     *
     * @example
     * if (window.__texscript_loaded__) {
     *   console.log("Texscript already loaded");
     * }
     */
    __texscript_loaded__: boolean;

    /**
     * Global Texscript compiler API and debugging interface.
     *
     * Exposed to the window object after successful compilation to provide:
     * - Version information for debugging
     * - Repository URL for documentation access
     * - Access to the last compilation artifacts (LOC, tokens, AST)
     * - Splash screen toggle for viewing loading/error details
     *
     * This API is primarily intended for development, debugging, and
     * building developer tools. It's injected by the processor after
     * compilation completes.
     *
     * @see processor.ts - process() function
     *
     * @example
     * // Access compiler version
     * console.log(window.TexscriptCompiler.version); // "v0.2"
     *
     * @example
     * // Inspect compilation artifacts
     * const tokens = window.TexscriptCompiler.lastCompilation.get("tokens");
     * const ast = window.TexscriptCompiler.lastCompilation.get("ast");
     *
     * @example
     * // Toggle splash screen to view loading details
     * window.TexscriptCompiler.toggleSplashStatus();
     */
    TexscriptCompiler: {
      /** The version of the Texscript compiler (e.g., "v0.2") */
      version: string;

      /** URL to the Texscript GitHub repository */
      repoURL: string;

      /**
       * Map containing the most recent compilation artifacts.
       *
       * Available keys:
       * - "loc": Lines of code (string[])
       * - "tokens": Tokenized source (TokenNode[][])
       * - "ast": Abstract Syntax Tree (ASTRootNode)
       */
      lastCompilation: Map<string, unknown>;
    };
  }
}

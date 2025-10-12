/**
 * Texscript Code Processor
 *
 * Handles the end-to-end processing pipeline for Texscript source code:
 * compilation, dependency resolution, code generation, and DOM injection.
 * This module bridges the compiler with the runtime environment, transforming
 * Texscript source into rendered HTML in the document.
 *
 * Processing pipeline:
 * 1. Compile source code to AST
 * 2. Load external dependencies (stylesheets, etc.)
 * 3. Generate target code (HTML)
 * 4. Inject generated code into the DOM
 * 5. Expose compiler API to window object
 *
 * @module processor
 */

import { findHostElementFromDOM } from "../../../texscript";
import Metrics from "../benchmark/metrics";
import { loadCSSConfigurations } from "../../css/configure";
import { injectPreconnectLinks } from "../configurations/preconnect";
import Compiler from "../../compiler/compiler";
import { loadCSSFiles } from "../../css/file-loader";
import { updateSplashProgress, updateSplashStatus } from "./splash";
import { loadTexscriptStyles } from "../utils/styles";
import CodeGenerator from "../../compiler/codeGenerator";

/**
 * Processes Texscript source code through the complete compilation and rendering pipeline.
 *
 * This function orchestrates the transformation from source code to rendered output:
 * - Compiles the raw Texscript code into an AST
 * - Resolves and loads external dependencies (CSS files, etc.)
 * - Generates HTML code from the AST
 * - Injects the generated HTML into the host element
 * - Exposes a global compiler API for debugging and interaction
 *
 * The splash screen is updated throughout the process to provide user feedback.
 * Any errors during processing are caught and displayed in the splash screen.
 *
 * @async
 * @param {Compiler} compiler - The compiler instance to use for compilation
 * @param {string} rawCode - The Texscript source code to process
 * @returns {Promise<void>} Resolves when processing is complete and code is rendered
 *
 * @example
 * const compiler = new Compiler();
 * const code = 'Page: "Hello World" ';
 * await process(compiler, code);
 */
export async function process(compiler: Compiler, rawCode: string): Promise<void> {
  try {
    const metricsProcess = new Metrics("Texscript Process");
    metricsProcess.start();
    // Compile the source code into an Abstract Syntax Tree
    updateSplashStatus("Compiling...");
    const ast = compiler.compile(rawCode);

    // Load Texscript-specific styles
    await loadTexscriptStyles();

    // Load any configurations or references declared in the AST
    if (ast) {
      const configurations = ast.configurations;
      if (configurations) {
        updateSplashStatus("Loading configurations...");
        await loadConfigurations(configurations);
        updateSplashProgress("95");
      }

      const references = ast.references;
      if (references) {
        updateSplashStatus("Loading references...");
        await loadReferences(references);
        updateSplashProgress("98");
      }
    }

    // Generate HTML code from the compiled AST
    const codeGenerator = new CodeGenerator(ast);
    const htmlCode = codeGenerator.generateCodeForHTML();
    updateSplashStatus("Compilation done.");

    // Hide the splash banner container (if it exists)
    const texscriptBannerContainer = document.querySelector(".texscript-banner-container");
    if (texscriptBannerContainer instanceof HTMLElement) {
      texscriptBannerContainer.style.display = "none";
    }

    // Create container for the generated Texscript pages
    const texscriptPages = document.createElement("div");
    texscriptPages.className = "texscript-pages";
    // Inject the generated HTML into the pages container
    texscriptPages.innerHTML = htmlCode;
    // Wrap pages in an outer container for styling/layout purposes
    const texscriptPagesContainer = document.createElement("div");
    texscriptPagesContainer.className = "texscript-pages-container";
    texscriptPagesContainer.classList.add("display-none");
    texscriptPagesContainer.appendChild(texscriptPages);

    // Get the host element where content will be injected
    const hostElement = findHostElementFromDOM();
    hostElement.innerHTML = texscriptPagesContainer.outerHTML;

    await document.fonts.ready;
    texscriptPagesContainer.classList.remove("display-none");

    // Mark loading as complete
    updateSplashProgress("100");
    metricsProcess.end();

    // Expose compiler API to window for debugging and developer tools
    window.TexscriptCompiler = compiler.toString();

    // Max marks in Lighthouse audit
    loadLighthouseBestPractices();
  } catch (e: unknown) {
    // Display any processing errors in the splash screen
    updateSplashStatus(e, "error");
  }
}

async function loadReferences(references: Record<string, any>) {
  if (references) {
    injectPreconnectLinks();
    if (references.css) await loadCSSFiles(references.css);
  }
}

async function loadConfigurations(configurations: Record<string, any>) {
  if (configurations) {
    await loadCSSConfigurations(configurations);
  }
}

function loadLighthouseBestPractices() {
  // Set default <title> if missing or empty
  if (!document.title || document.title.trim() === "") {
    document.title = "Texscript | " + location.host + location.pathname;
  }

  // Set default <html lang> if missing or empty
  const htmlEl = document.documentElement;
  if (!htmlEl.lang || htmlEl.lang.trim() === "") {
    htmlEl.lang = "en";
  }

  // Set default <meta name="description"> if missing or empty
  let metaDescTag = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;

  if (!metaDescTag) {
    metaDescTag = document.createElement("meta") as HTMLMetaElement;
    metaDescTag.name = "description";
    metaDescTag.content = "This page was compiled by Texscript Compiler";
    document.head.appendChild(metaDescTag);
  } else if (!metaDescTag.content || metaDescTag.content.trim() === "") {
    metaDescTag.content = "This page was compiled by Texscript Compiler";
  }
}

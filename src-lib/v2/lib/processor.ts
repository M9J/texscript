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

import { findHostElementFromDOM } from "../texscript";
import { DEFAULT_CONFIG_PAGE } from "./configurations/default";
import { getPageSize } from "./configurations/page-size";
import ERRORS from "./constants/errors";
import Compiler from "./core/compiler";
import { toggleSplashStatus, updateSplashProgress, updateSplashStatus } from "./splash";

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
    // Compile the source code into an Abstract Syntax Tree
    updateSplashStatus("Compiling...");
    compiler.compile(rawCode);

    // Load any configurations or references declared in the AST
    if (compiler.ast) {
      const configurations = compiler.ast.configurations;
      if (configurations) {
        updateSplashStatus("Loading configurations...");
        await loadConfigurations(configurations);
        updateSplashProgress("95");
      }

      const references = compiler.ast.references;
      if (references) {
        updateSplashStatus("Loading references...");
        await loadReferences(references);
        updateSplashProgress("98");
      }
    }

    // Generate HTML code from the compiled AST
    const htmlCode = compiler.generateCodeFor("HTML");
    updateSplashStatus("Compilation done.");

    // Hide the splash banner container (if it exists)
    const texscriptBannerContainer = document.querySelector(".texscript-banner-container");
    if (texscriptBannerContainer instanceof HTMLElement) {
      texscriptBannerContainer.style.display = "none";
    }

    // Create container for the generated Texscript pages
    const texscriptPages = document.createElement("div");
    texscriptPages.className = "texscript-pages";

    // Mark loading as complete
    updateSplashProgress("100");

    // Get the host element where content will be injected
    const hostElement = findHostElementFromDOM();

    // Inject the generated HTML into the pages container
    texscriptPages.innerHTML = htmlCode;
    hostElement.appendChild(texscriptPages);

    // Wrap pages in an outer container for styling/layout purposes
    const texscriptPagesContainer = document.createElement("div");
    texscriptPagesContainer.className = "texscript-pages-container";
    texscriptPagesContainer.appendChild(texscriptPages);

    // Replace host element content with the complete structure
    hostElement.innerHTML = texscriptPagesContainer.outerHTML;

    // Expose compiler API to window for debugging and developer tools
    window.TexscriptCompiler = {
      ...compiler.toString(),
      toggleSplashStatus: () => toggleSplashStatus(),
    };
  } catch (e: unknown) {
    // Display any processing errors in the splash screen
    updateSplashStatus(e, "error");
  }
}

/**
 * Dynamically links an external stylesheet to the document head.
 *
 * Creates a <link> element and waits for it to fully load before resolving.
 * This ensures styles are available before rendering continues. If the
 * stylesheet fails to load, an error is thrown with the failed URL.
 *
 * @async
 * @param {string} href - The URL or path to the stylesheet
 * @returns {Promise<void>} Resolves when the stylesheet has loaded successfully
 * @throws {Error} Throws ERR0018 with the href if the stylesheet fails to load
 *
 * @example
 * await linkStylesToHead("https://example.com/theme.css");
 * // Stylesheet is now loaded and styles are available
 */
async function linkStylesToHead(href: string): Promise<void> {
  // Create a link element for the stylesheet
  const linkTag: HTMLLinkElement = document.createElement("link");
  linkTag.rel = "stylesheet";
  linkTag.href = href;

  try {
    // Append to head to begin loading
    document.head.appendChild(linkTag);

    // Wait for the stylesheet to load or fail
    await new Promise<void>((res, rej) => {
      // Resolve when stylesheet loads successfully
      linkTag.onload = () => res();

      // Reject with detailed error message if loading fails
      linkTag.onerror = () => {
        const errorMessage = ERRORS.ERR0018 + "\n" + href;
        rej(new Error(errorMessage));
      };
    });
  } catch (e: unknown) {
    // Display stylesheet loading errors
    updateSplashStatus(e, "error");
  }
}

async function loadConfigurations(configurations: Record<string, any>) {
  if (configurations) {
    await setupPageSize(configurations.pageSize || DEFAULT_CONFIG_PAGE.pageSize);
  }
}

async function loadReferences(references: Record<string, any>) {
  if (references) {
    const cssFiles = references.css;
    for (let cssFile of cssFiles) {
      await linkStylesToHead(cssFile);
    }
  }
}

async function setupPageSize(pageSize: string) {
  if (pageSize) {
    let css = "";
    const mediaPrintPageCss = `@media print { @page { size: ${pageSize}} }`;
    css += mediaPrintPageCss;
    const unit = "in";
    const pageDimensions = getPageSize(pageSize, unit);
    if (pageDimensions && pageDimensions.width && pageDimensions.height) {
      const pageSizeCSS = `
        .texscript-Page { 
          width: ${pageDimensions.width + unit}; 
          height: ${pageDimensions.height + unit};
        }`;
      css += pageSizeCSS;
    }
    const mediaPrintPageCssStyleTag = document.createElement("style");
    mediaPrintPageCssStyleTag.textContent = css;
    document.head.appendChild(mediaPrintPageCssStyleTag);
  }
}

/**
 * Texscript Main Stylesheet
 *
 * This is the primary entry point for all Texscript styling. It orchestrates the
 * loading order of CSS modules to ensure proper cascade and specificity management.
 *
 * Import Order Strategy:
 * 1. Native/Base - Foundation styles and resets
 * 2. Media - Print and responsive styles
 * 3. Custom - Component-specific styles
 *
 * The order is critical to maintain proper CSS specificity and allow custom
 * styles to override base styles as intended.
 *
 * @file Main stylesheet aggregator for Texscript
 */

/**
 * Base Styles
 *
 * Provides foundational styles including CSS resets, normalization,
 * and core HTML element styling. This should always be loaded first
 * to establish a consistent baseline across browsers.
 */
import BASE from "./native/base.css";

/**
 * Print Media Styles
 *
 * General print media queries and optimizations for printing documents.
 * Includes page break control, color adjustments, and print-specific layouts.
 */
import PRINT from "./media/print.css";

/**
 * Core Component Styles
 *
 * Fundamental styling for core Texscript components and utilities.
 * Includes layout primitives, typography, and shared component patterns.
 */
import TEXSCRIPT_CORE from "./custom/texscript-core.css";

/**
 * List Component Styles
 *
 * Styling for the texscript-List component including ordered lists,
 * unordered lists, and custom list markers.
 */
import TEXSCRIPT_LIST from "./custom/texscript-List.css";

export default BASE + PRINT + TEXSCRIPT_CORE + TEXSCRIPT_LIST;

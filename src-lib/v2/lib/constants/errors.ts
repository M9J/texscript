/**
 * Error Message Catalog
 *
 * Central repository for all error messages used throughout the Texscript compiler
 * and runtime. Using a centralized error catalog provides several benefits:
 * - Consistent error messaging across the codebase
 * - Easy localization and internationalization in the future
 * - Single source of truth for error text modifications
 * - Simplified error code documentation and reference
 *
 * Error codes follow the format ERRxxxx where xxxx is a zero-padded number.
 *
 * @module errors
 * @constant
 */

/**
 * Map of error codes to their corresponding human-readable error messages.
 *
 * Error Code Categories:
 * - ERR0001-ERR0003: Source code loading and detection errors
 * - ERR0004-ERR0008: Compilation input validation errors
 * - ERR0009-ERR0012: AST and code generation errors
 * - ERR0013: Metrics and instrumentation errors
 * - ERR0014-ERR0020: Runtime script element detection and loading errors
 *
 * Note: HTML entities (&lt; &gt;) are used instead of angle brackets
 * to prevent potential rendering issues in certain contexts.
 *
 * @type {Record<string, string>}
 */
const ERRORS: Record<string, string> = {
  /** Unable to locate source code for compilation */
  ERR0001: `Unable to find the raw code to be compiled`,

  /** Missing required 'rawCode' parameter */
  ERR0002: `'rawCode' not provided`,

  /** Instructions for proper Texscript script tag usage */
  ERR0003: `Make sure the code is wrapped in &lt;script type="text/texscript">...&lt;/script&gt;`,

  /** Missing required 'codeLOC' (Lines of Code) parameter */
  ERR0004: `'codeLOC' not provided`,

  /** Missing required lexer/parser 'rule' parameter */
  ERR0005: `'rule' not provided`,

  /** Missing required regex 'matches' array */
  ERR0006: `'matches' not provided`,

  /** Missing required 'tokens' array for parsing */
  ERR0007: `'tokens' not provided`,

  /** Token object is missing its type property */
  ERR0008: `token.type is null`,

  /** Missing required Abstract Syntax Tree (AST) */
  ERR0009: `'ast' is not provided`,

  /** Missing required AST node for traversal or transformation */
  ERR0010: `'node' is not provided`,

  /** Missing target language specification for code generation */
  ERR0011: `'lang' is not provided`,

  /** Code generator implementation not found for specified language */
  ERR0012: `Code generator for mentioned language is not provided`,

  /** Missing required metrics name for performance tracking */
  ERR0013: `'metricsName' not provided`,

  /** No Texscript code detected in the document */
  ERR0014: `Unable to find any code written in Texscript`,

  /** Script element exists but contains no Texscript code */
  ERR0015: `Not able to find any Texscript code inside &lt;script&gt; element`,

  /** Required script element not found in DOM */
  ERR0016: `&lt;script&gt; element not found`,

  /** General compilation process failure */
  ERR0017: `Compilation failed`,

  /** Required module or library dependency could not be resolved */
  ERR0018: `Dependency not found`,

  /** Script element with 'src' attribute has no valid URL */
  ERR0019: `Unable to find any Texscript source URL inside &lt;script&gt; element`,

  /** Instructions for both inline and external Texscript usage */
  ERR0020: `Texscript code should be provided inside &lt;script type="text/texscript">...&lt;/script&gt; or as URL using &lt;script src="file.txs" type="text/texscript">&lt;/script&gt;`,
};

export default ERRORS;

/**
 * Texscript Grammar Definition
 *
 * This module defines the lexical grammar and syntax rules for the Texscript language.
 * It uses a token-based approach where individual regex patterns (meta tokens) are
 * combined into grammar rules that match complete language constructs.
 *
 * The grammar is compiled at module initialization and exported as a Map for use
 * by the lexer/parser during the compilation process.
 *
 * @module grammar
 */

/**
 * Basic meta tokens for fundamental language elements.
 *
 * These tokens match the most common language constructs:
 * - KEYWORD: Component and element names (e.g., Page, Text, List)
 * - STRING: Quoted string literals with escape sequence support
 *
 * @constant {Record<string, RegExp>}
 */
const MetaTokensBasic: Record<string, RegExp> = {
  /** Matches keywords starting with uppercase followed by lowercase letters */
  KEYWORD: /(^[A-Z][a-z]*)/,

  /** Matches double-quoted strings, including escaped quotes */
  STRING: /"(.*)"$|(\\\"(.*)\\\"$)/,
  // STRING: /(?<=")(?:\\.|[^"\\\r\n])*(?=")/,
};

/**
 * Extended meta tokens for advanced language features.
 *
 * These tokens handle more specialized syntax elements:
 * - CSS_CLASS: CSS class name selectors for styling
 * - PARAMETERS: Function/component parameter lists
 *
 * @constant {Record<string, RegExp>}
 */
const MetaTokensExtended: Record<string, RegExp> = {
  /** Matches CSS class names prefixed with a dot (e.g., .myClass) */
  CSS_CLASS: /\.([a-z]+[a-zA-Z]*)/,

  /** Matches external references like @Reference css: "file.css" */
  COMMAND: /(@[A-Z][a-zA-Z]*\s[\s\w]+:\s*("[^"]*"|\w+))/,

  /** Matches parameter lists in parentheses (e.g., (title: "Hello", size: 12)) */
  PARAMETERS: /(\(([\s\w]+:\s*("[^"]*"|\w+),?\s*)+\))/,

  /** Matches URL patterns */
  URL: /^\"(?:https?:\/\/|\/\/|www\.)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\.[a-zA-Z]{2,})?\"$/,

  /** Matches Email ID patterns */
  MAIL: /^\"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\"$/,
};

/**
 * Punctuation and delimiter meta tokens.
 *
 * These tokens match structural elements that define syntax boundaries
 * and separate language constructs.
 *
 * @constant {Record<string, RegExp>}
 */
const MetaTokensPunctuation: Record<string, RegExp> = {
  /** Matches closing square bracket ] */
  BRACKET_SQUARE_CLOSE: /(\])/,

  /** Matches opening square bracket [ */
  BRACKET_SQUARE_OPEN: /(\[)/,

  /** Matches colon : */
  COLON: /(:)/,

  /** Matches optional whitespace characters */
  SPACE: /(\s*)/,

  /** Matches mandatory whitespace character */
  WHITESPACE: /(\s)/,

  /** Matches closing angle bracket */
  BRACKET_ANGLE_CLOSE: /(\>)/,

  /** Matches double quote */
  DOUBLE_QUOTE: /(\")/,
};

/**
 * Special syntax meta tokens for shorthand notation.
 *
 * These tokens provide convenient shortcuts for common elements:
 * - BR: Line break shorthand
 * - HR: Horizontal rule shorthand
 *
 * @constant {Record<string, RegExp>}
 */
const MetaTokensSpecial: Record<string, RegExp> = {
  /** Matches :: for line breaks */
  BR: /(::)/,

  /** Matches -- for horizontal rules */
  HR: /(--)/,
};

/**
 * Complete collection of all meta tokens.
 *
 * This combines all token categories into a single lookup object
 * used during grammar rule compilation.
 *
 * @constant {Record<string, RegExp>}
 */
const META_TOKENS: Record<string, RegExp> = {
  ...MetaTokensBasic,
  ...MetaTokensExtended,
  ...MetaTokensPunctuation,
  ...MetaTokensSpecial,
};

/**
 * Grammar rules defining valid Texscript syntax patterns.
 *
 * Each rule is a pipe-delimited (|) sequence of meta tokens that represents
 * a valid language construct. The order matters for precedence during parsing.
 *
 * Rule categories:
 * - Simple elements: BR, HR, STRING
 * - Basic tags: KEYWORD with optional content
 * - Styled tags: KEYWORD with CSS classes
 * - Parameterized tags: KEYWORD with parameters
 * - Container tags: KEYWORD with opening brackets for nested content
 * - External references: Imports and dependencies
 *
 * @constant {string[]}
 *
 * @example
 * // "Text: 'Hello'" matches: KEYWORD|COLON|SPACE|STRING
 * // "Page.container [" matches: KEYWORD|CSS_CLASS|SPACE|BRACKET_SQUARE_OPEN
 * // "List(items: 5) [" matches: KEYWORD|SPACE|PARAMETERS|SPACE|BRACKET_SQUARE_OPEN
 */
const GRAMMAR_RULES: string[] = [
  "BR", // Line break (::)
  "BRACKET_SQUARE_CLOSE", // Closing container (])
  "COMMAND",
  "HR", // Horizontal rule (--)
  "MAIL",
  "KEYWORD|COLON|SPACE|STRING", // Simple tag with content (e.g., Text: "Hello")
  "KEYWORD|CSS_CLASS|COLON|SPACE|STRING", // Styled tag with content
  "KEYWORD|CSS_CLASS|SPACE|BRACKET_SQUARE_OPEN", // Styled container opening
  "KEYWORD|CSS_CLASS|SPACE|PARAMETERS|COLON|SPACE|STRING", // Styled tag with params and content
  "KEYWORD|CSS_CLASS|SPACE|PARAMETERS|SPACE|BRACKET_SQUARE_OPEN", // Styled container with params
  "KEYWORD|SPACE|BRACKET_SQUARE_OPEN", // Simple container opening
  "KEYWORD|SPACE|PARAMETERS",
  "KEYWORD|SPACE|PARAMETERS|COLON|SPACE|STRING", // Tag with params and content
  "KEYWORD|SPACE|PARAMETERS|SPACE|BRACKET_SQUARE_OPEN", // Container with params
  "URL",
  // *** DO NOT CHANGE *** KEEP THIS "STRING" AS THE LAST ITEM IN THIS LIST *** //
  "STRING", // Standalone string literal
  // *** DO NOT CHANGE *** KEEP THIS "STRING" AS THE LAST ITEM IN THIS LIST *** //
];

/**
 * Compiles grammar rules into executable regular expressions.
 *
 * This function takes human-readable grammar rules (pipe-delimited token sequences)
 * and converts them into compiled regex patterns that can efficiently match
 * Texscript syntax during lexical analysis.
 *
 * The compilation process:
 * 1. Splits each rule by the pipe (|) delimiter
 * 2. Looks up each token's regex pattern from the meta tokens
 * 3. Combines the patterns into a single regex
 * 4. Stores the result in a Map for fast lookup during parsing
 *
 * @param {string[]} grammarRules - Array of pipe-delimited token sequences
 * @param {Record<string, RegExp>} metaTokens - Lookup table of token regex patterns
 * @returns {Map<string, RegExp>} Map of grammar rules to compiled regex patterns
 * @throws {Error} Throws if a rule references an unknown token
 *
 * @example
 * const grammar = convertRulesToGrammar(
 *   ["KEYWORD|SPACE|STRING"],
 *   { KEYWORD: /[A-Z]+/, SPACE: /\s/, STRING: /".*"/ }
 * );
 * // Returns: Map { "KEYWORD|SPACE|STRING" => /[A-Z]+\s".*"/ }
 */
function convertRulesToGrammar(
  grammarRules: string[],
  metaTokens: Record<string, RegExp>
): Map<string, RegExp> {
  const grammar = new Map<string, RegExp>();

  // Process each grammar rule
  for (const grammarRule of grammarRules) {
    // Split rule into individual token names
    const patterns = grammarRule.split("|").map((token) => {
      const regex = metaTokens[token];

      // Validate that the token exists in the meta tokens
      if (!regex) {
        throw new Error(`Unknown token: ${token}`);
      }

      // Extract the regex source pattern (without flags)
      return regex.source;
    });

    // Combine all token patterns into a single regex
    const grammarRegex = new RegExp(patterns.join(""));

    // Store the compiled rule for use during parsing
    grammar.set(grammarRule, grammarRegex);
  }

  return grammar;
}

/**
 * Compiled Texscript grammar ready for lexical analysis.
 *
 * This exported Map contains all grammar rules compiled into executable
 * regular expressions. The lexer uses this to tokenize source code and
 * identify valid language constructs.
 *
 * @type {Map<string, RegExp>}
 */
export default convertRulesToGrammar(GRAMMAR_RULES, META_TOKENS);

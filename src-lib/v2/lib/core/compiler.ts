/**
 * Texscript Compiler
 *
 * The core compiler implementation for the Texscript language. This class orchestrates
 * the complete compilation pipeline from raw source code to executable output.
 *
 * Compilation Pipeline:
 * 1. Source Code → Lines of Code (LOC) - Preprocessing and cleanup
 * 2. LOC → Tokens - Lexical analysis using grammar rules
 * 3. Tokens → Abstract Syntax Tree (AST) - Syntax analysis and tree construction
 * 4. AST → Target Code - Code generation (currently supports HTML)
 *
 * The compiler maintains state for the last compilation, allowing inspection of
 * intermediate representations (tokens, AST) for debugging and tooling purposes.
 *
 * @module compiler
 * @class Compiler
 */

import Metrics from "../benchmark/metrics";
import ERRORS from "../constants/errors";
import { ASTLiteralNode, ASTRootNode, ASTSpecialTagNode, ASTTagNode } from "./ast";
import GRAMMAR from "./grammar";
import Stack from "./stack";

/**
 * Represents a token produced by lexical analysis.
 *
 * Tokens are the atomic units of syntax identified during the lexing phase.
 * Each token has a type (from the grammar) and a value (the matched text).
 *
 * @typedef {Object} TokenNode
 * @property {string} type - The token type (e.g., "KEYWORD", "STRING", "BRACKET_SQUARE_OPEN")
 * @property {string} value - The actual text value of the token
 */
type TokenNode = {
  type: string;
  value: string;
};

/**
 * The Texscript compiler implementation.
 *
 * Provides methods for compiling Texscript source code and generating target code.
 * The compiler maintains performance metrics and stores intermediate compilation
 * artifacts for debugging and analysis.
 *
 * @class Compiler
 */
export default class Compiler {
  /** Compiler version identifier */
  version: string = "v0.2";

  /** URL to the Texscript source repository */
  repourl: string = "https://github.com/M9J/texscript.git";

  /** Performance metrics for the compilation phase */
  metricsCompilation: Metrics = new Metrics("Compilation");

  /** Performance metrics for the code generation phase */
  metricsCodeGeneration: Metrics = new Metrics("Code Generation");

  /** The raw source code being compiled */
  rawCode: string | null = null;

  /** Lines of code after preprocessing (trimmed, non-empty lines) */
  loc: string[] | null = null;

  /** Tokenized representation of the source code (2D array: lines × tokens) */
  tokens: TokenNode[][] | null = null;

  /** The compiled Abstract Syntax Tree */
  ast: ASTRootNode | null = null;

  /**
   * Creates a new Compiler instance.
   *
   * Logs the compiler version to the console for debugging and version tracking.
   */
  constructor() {
    console.log(`[Texscript: Info] > Compiler ${this.version}`);
  }

  /**
   * Create a getter to invoke the last compilation data and returns it as a Map.
   */
  get lastCompilation(): Map<string, unknown> {
    return new Map<string, unknown>([
      ["loc", this.loc],
      ["tokens", this.tokens],
      ["ast", this.ast],
    ]);
  }

  /**
   * Returns a string representation of the compiler state.
   *
   * Provides access to compiler version, repository URL, and the most recent
   * compilation artifacts. Useful for debugging, tooling, and runtime inspection.
   *
   * @returns {Object} Compiler information and last compilation state
   * @returns {string} .version - The compiler version
   * @returns {string} .repoURL - The repository URL
   * @returns {Map<string, unknown>} .lastCompilation - Map containing loc, tokens, and ast
   *
   * @example
   * const info = compiler.toString();
   * console.log(info.version); // "v0.2"
   * console.log(info.lastCompilation.get("tokens")); // Token array
   */
  toString(): {
    version: string;
    repoURL: string;
    lastCompilation: Map<string, unknown>;
  } {
    return {
      version: this.version,
      repoURL: this.repourl,
      lastCompilation: this.lastCompilation,
    };
  }

  /**
   * Compiles Texscript source code into an Abstract Syntax Tree.
   *
   * Executes the complete compilation pipeline:
   * 1. Stores the raw source code
   * 2. Converts to lines of code (preprocessing)
   * 3. Performs lexical analysis (tokenization)
   * 4. Performs syntax analysis (AST construction)
   *
   * Performance metrics are captured for the entire compilation process.
   * All intermediate representations are stored in the compiler instance
   * for inspection and debugging.
   *
   * @param {string} rawCode - The Texscript source code to compile
   * @returns {void}
   *
   * @example
   * const compiler = new Compiler();
   * compiler.compile('Page { Text "Hello World" }');
   * console.log(compiler.ast); // Compiled AST
   */
  compile(rawCode: string): void {
    this.rawCode = rawCode;
    this.metricsCompilation.start();
    this.loc = this.convertToLinesOfCode();
    this.tokens = this.lexicalAnalysis();
    this.ast = this.syntaxAnalysis();
    this.metricsCompilation.end();
  }

  /**
   * Generates target code from the compiled AST.
   *
   * Currently supports HTML as the only target language. The generated code
   * is optimized for the specified target platform.
   *
   * @param {string} lang - Target language identifier (currently only "HTML" is supported)
   * @returns {string} Generated code in the target language
   * @throws {Error} Throws ERR0011 if lang parameter is not provided
   * @throws {Error} Throws ERR0012 if the specified language is not supported
   *
   * @example
   * compiler.compile('Page { Text "Hello" }');
   * const html = compiler.generateCodeFor("HTML");
   * // Returns: '<div class="texscript-Page">...</div>'
   */
  generateCodeFor(lang: string): string {
    if (!lang) throw new Error(ERRORS.ERR0011);
    this.metricsCodeGeneration.start();
    let code: string | null = null;
    if (lang === "HTML") code = this.generateCodeForHTML();
    else throw new Error(ERRORS.ERR0012);
    this.metricsCodeGeneration.end();
    return code;
  }

  /**
   * Generates HTML code from the compiled AST.
   *
   * Traverses the AST's body and generates HTML for each top-level node.
   * Each node type (TAG, SPEC_TAG, LITERAL) has specific HTML generation rules.
   *
   * @private
   * @returns {string} Generated HTML code, trimmed of leading/trailing whitespace
   * @throws {Error} Throws ERR0009 if the AST is not available
   *
   * @example
   * const html = compiler.generateCodeForHTML();
   * // Returns complete HTML structure for the document
   */
  generateCodeForHTML(): string {
    if (!this.ast) throw new Error(ERRORS.ERR0009);
    let html = ``;

    // Generate HTML for each top-level node in the AST body
    for (const node of this.ast.body) {
      const type = node.getNodeType();
      if (type === "TAG" || type === "SPEC_TAG" || type === "LITERAL") {
        html += this.generateHTMLForNode(node as ASTTagNode | ASTSpecialTagNode | ASTLiteralNode);
      }
    }

    return html.trim();
  }

  /**
   * Recursively generates HTML for a single AST node.
   *
   * Handles three node types:
   * - TAG: Standard components with children (e.g., Page, Section, List)
   * - SPEC_TAG: Self-closing special elements (e.g., BR, HR)
   * - LITERAL: Raw text content
   *
   * For TAG nodes, generates:
   * - Opening tag with appropriate HTML element
   * - CSS classes (base class + custom classes + parameter-based classes)
   * - Recursively generated child content
   * - Closing tag
   *
   * @private
   * @param {ASTTagNode | ASTSpecialTagNode | ASTLiteralNode} node - The AST node to generate HTML for
   * @returns {string} Generated HTML string for the node and its descendants
   * @throws {Error} Throws ERR0010 if the node parameter is not provided
   *
   * @example
   * // For a TAG node representing: Page.container(title: home) { ... }
   * // Generates: <div class="texscript-Page container texscript-Page-TITLE-HOME">...</div>
   */
  generateHTMLForNode(node: ASTTagNode | ASTSpecialTagNode | ASTLiteralNode): string {
    if (!node) throw new Error(ERRORS.ERR0010);

    // Extract node properties
    const type = node.getNodeType();
    const value = node.value;
    const htmlElement = (node as ASTTagNode | ASTSpecialTagNode).htmlElement;
    const parameters = (node as ASTTagNode).parameters;
    const customCSSClasses = (node as ASTTagNode).customCSSClasses;
    const children = (node as ASTTagNode).children || [];

    let customCSSClassesHTML = "";
    let parametersHTML = "";

    // Build custom CSS classes string
    if (Array.isArray(customCSSClasses) && customCSSClasses.length > 0) {
      customCSSClassesHTML = ` ${customCSSClasses.join(" ")}`;
    }

    // Build parameter-based CSS classes (for styling based on props)
    if (parameters) {
      for (const paramName in parameters) {
        const paramValue = parameters[paramName];
        parametersHTML += ` texscript-${value}-${paramName.toUpperCase()}-${paramValue.toUpperCase()}`;
      }
    }

    // Generate HTML based on node type
    if (type === "TAG") {
      return `<${htmlElement} class="texscript-${value}${customCSSClassesHTML}${parametersHTML}">
    ${children
      .filter((c): c is ASTTagNode | ASTSpecialTagNode | ASTLiteralNode => {
        const t = c.getNodeType();
        return t === "TAG" || t === "SPEC_TAG" || t === "LITERAL";
      })
      .map((c) => this.generateHTMLForNode(c))
      .join("")}
  </${htmlElement}>`;
    } else if (type === "SPEC_TAG") {
      // Self-closing tags for special elements
      return `<${htmlElement} class="texscript-${value}"/>`;
    } else if (type === "LITERAL") {
      // Raw text content (no wrapping element)
      return `${value}`;
    }

    return "";
  }

  /**
   * Performs syntax analysis to build an Abstract Syntax Tree from tokens.
   *
   * This is the parser phase of compilation. It consumes the token stream
   * and constructs a hierarchical tree structure representing the program.
   *
   * Parsing strategy:
   * - Uses stacks to track nesting context (tags, colons, spaces)
   * - Processes tokens sequentially, updating the AST
   * - Handles nested structures (brackets create parent-child relationships)
   * - Manages special cases (list items, external references, etc.)
   *
   * The resulting AST includes:
   * - Document metadata (language name, compiler version)
   * - Dependency declarations
   * - Hierarchical node structure
   *
   * @private
   * @returns {ASTRootNode} The complete Abstract Syntax Tree
   * @throws {Error} Throws ERR0007 if tokens are not available
   * @throws {Error} Throws ERR0008 if a token is missing its type
   * @throws {Error} Throws if currentNode is null when required
   */
  syntaxAnalysis(): ASTRootNode {
    if (!this.tokens) throw new Error(ERRORS.ERR0007);

    // Initialize the root AST node with metadata
    const ast = new ASTRootNode();
    ast.value = "Program";
    ast.meta.languageName = "Texscript";
    ast.meta.languageCompilerVersion = this.version;

    // Stacks for managing parsing context
    const tagStack = new Stack<ASTTagNode>(); // Tracks nested tag hierarchy
    const colonStack = new Stack<TokenNode>(); // Tracks colon operators
    const spaceStack = new Stack<TokenNode>(); // Tracks spacing tokens

    // Current node being constructed
    let currentNode: ASTTagNode | null = null;

    // Process each line of tokens
    for (const tokenLine of this.tokens) {
      for (const token of tokenLine) {
        if (!token.type) throw new Error(ERRORS.ERR0008);

        switch (token.type) {
          case "BR": {
            // Line break - insert <br> element
            const brNode = new ASTSpecialTagNode();
            brNode.htmlElement = "br";
            brNode.value = "BR";
            currentNode?.children.push(brNode);
            break;
          }

          case "BRACKET_SQUARE_CLOSE": {
            // Closing bracket - exit current nesting level
            if (!tagStack.isEmpty()) tagStack.pop();
            if (!tagStack.isEmpty()) currentNode = !tagStack.isEmpty() ? tagStack.peek() : null;
            break;
          }

          case "BRACKET_SQUARE_OPEN": {
            // Opening bracket - enter new nesting level
            if (currentNode) tagStack.push(currentNode);
            break;
          }

          case "COLON": {
            // Colon operator - marks content assignment
            colonStack.push(token);
            break;
          }

          case "COMMAND": {
            if (token.value) {
              const [commandWithKey, value] = token.value.split(":");
              if (commandWithKey) {
                const [command, key] = commandWithKey?.split(" ");
                if (command && key && value) {
                  if (command === "@Reference") {
                    const cleanedValue = value.replace(/[\@\s\"]/g, "");
                    ast.references[key] = ast.references[key]
                      ? [...ast.references[key], cleanedValue]
                      : [cleanedValue];
                  } else if (command === "@Configure") {
                    const cleanedValue = value.replace(/[\@\s\"]/g, "");
                    ast.configurations[key] = cleanedValue;
                  }
                }
              }
            }
            break;
          }

          case "CSS_CLASS": {
            // CSS class name - add to current node's classes
            currentNode?.customCSSClasses.push(token.value);
            break;
          }

          case "HR": {
            // Horizontal rule - insert <hr> element
            const hrNode = new ASTSpecialTagNode();
            hrNode.htmlElement = "hr";
            hrNode.value = "HR";
            currentNode?.children.push(hrNode);
            break;
          }

          case "KEYWORD": {
            // Component/element keyword - create new tag node
            const tagNode = new ASTTagNode();
            tagNode.value = token.value;

            // Map Texscript components to HTML elements
            tagNode.htmlElement =
              token.value === "Section" ? "section" : token.value === "List" ? "ul" : "div";

            currentNode = tagNode;

            // Add to AST body or parent's children based on nesting
            if (tagStack.isEmpty()) {
              if (ast.body.length > 0) {
                const pageBreakNode = new ASTTagNode();
                pageBreakNode.value = "PageBreak";
                pageBreakNode.htmlElement = "div";
                pageBreakNode.customCSSClasses = ["page-break"];
                ast.body.push(pageBreakNode);
                ast.body.push(currentNode);
              } else {
                ast.body.push(currentNode);
              }
            } else {
              const prevTag = !tagStack.isEmpty() ? tagStack.peek() : null;
              if (prevTag) prevTag.children.push(currentNode);
            }
            break;
          }

          case "PARAMETERS": {
            // Component parameters - parse and store as key-value pairs
            const cleanedStr = token.value.replace(/[\(\)\s]/g, "");
            const parametersArr = cleanedStr.split(",");
            for (const param of parametersArr) {
              const [paramName, paramValue] = param.split(":");
              if (paramName && paramValue) {
                if (!currentNode?.parameters) currentNode!.parameters = {};
                currentNode!.parameters[paramName] = paramValue;
              }
            }
            break;
          }

          case "SPACE":
          case "SPACE_OPTIONAL": {
            // Whitespace - used for syntax structure tracking
            spaceStack.push(token);
            break;
          }

          case "STRING": {
            // String literal - wrap in appropriate container based on context
            const stringNode = new ASTLiteralNode();
            stringNode.value = token.value;

            const node = new ASTTagNode();

            // Context-aware container selection
            if (!tagStack.isEmpty()) {
              const tag = !tagStack.isEmpty() ? tagStack.peek() : null;
              if (tag?.value === "List") {
                // Inside List - wrap in ListItem (<li>)
                node.value = "ListItem";
                node.htmlElement = "li";
              } else {
                // Inside other container - wrap in Line (<div>)
                node.value = "Line";
                node.htmlElement = "div";
              }
            } else {
              // Top-level string - wrap in Line (<div>)
              node.value = "Line";
              node.htmlElement = "div";
            }

            node.children.push(stringNode);
            if (!currentNode) throw new Error(`'currentNode' doesn't exist`);
            currentNode.children.push(node);

            // Handle colon-assignment syntax (e.g., "Text: 'Hello'")
            if (!colonStack.isEmpty() && !spaceStack.isEmpty()) {
              currentNode = !tagStack.isEmpty() ? tagStack.peek() : null;
              colonStack.pop();
              spaceStack.pop();
            }
            break;
          }
        }
      }
    }

    return ast;
  }

  /**
   * Performs lexical analysis to convert lines of code into tokens.
   *
   * This is the lexing/tokenization phase of compilation. Each line is matched
   * against grammar rules to identify its token structure. Lines that don't
   * match any grammar rule result in compilation errors.
   *
   * Process:
   * 1. Iterate through each line of code
   * 2. Try to match line against each grammar rule
   * 3. If match found, extract tokens using regex capture groups
   * 4. If no match found, throw compilation error with line number
   *
   * @private
   * @returns {TokenNode[][]} 2D array of tokens (one array per line)
   * @throws {Error} Throws ERR0004 if lines of code are not available
   * @throws {Error} Throws ERR0017 with line number if a line fails to match any grammar rule
   *
   * @example
   * // Input LOC: ["Page [", "Text: 'Hello'", "]"]
   * // Output: [
   * //   [{type: "KEYWORD", value: "Page"}, {type: "BRACKET_SQUARE_OPEN", value: "["}],
   * //   [{type: "KEYWORD", value: "Text"}, {type: "COLON", value: ":"}, ...],
   * //   [{type: "BRACKET_SQUARE_CLOSE", value: "]"}]
   * // ]
   */
  lexicalAnalysis(): TokenNode[][] {
    if (!this.loc) throw new Error(ERRORS.ERR0004);
    const tokens: TokenNode[][] = [];

    for (const [index, line] of this.loc.entries()) {
      let foundGrammarMatch = false;
      // Try to match line against each grammar rule
      for (const [grammarRule, grammarRegEx] of GRAMMAR) {
        const matches = line.match(grammarRegEx);
        if (matches && matches.length > 0) {
          foundGrammarMatch = true;
          const [lineMatch, ...grammarRegExMatches] = matches;

          // Ensure the entire line was matched (not just a prefix)
          if (lineMatch === line) {
            const perLineTokens = this.convertLineToTokens(grammarRule, grammarRegExMatches);
            tokens.push(perLineTokens);
            break;
          }
        }
      }

      // Report syntax error if no grammar rule matched
      if (!foundGrammarMatch) {
        const lineNo = index + 1;
        const message = `${ERRORS.ERR0017}, line: ${lineNo}\n${line}`;
        throw new Error(message);
      }
    }

    return tokens;
  }

  /**
   * Converts a matched grammar rule and its captures into token objects.
   *
   * Takes a grammar rule (pipe-delimited token types) and the corresponding
   * regex capture groups, and creates structured TokenNode objects.
   *
   * @private
   * @param {string} rule - Grammar rule string (e.g., "KEYWORD|SPACE|STRING")
   * @param {string[]} matches - Array of regex capture group values
   * @returns {TokenNode[]} Array of token objects with type and value
   * @throws {Error} Throws ERR0005 if rule is not provided
   * @throws {Error} Throws ERR0006 if matches are not provided
   *
   * @example
   * convertLineToTokens("KEYWORD|COLON|SPACE|STRING", ["Text", ":", " ", '"Hello"'])
   * // Returns: [
   * //   {type: "KEYWORD", value: "Text"},
   * //   {type: "COLON", value: ":"},
   * //   {type: "SPACE", value: " "},
   * //   {type: "STRING", value: '"Hello"'}
   * // ]
   */
  convertLineToTokens(rule: string, matches: string[]): TokenNode[] {
    if (!rule) throw new Error(ERRORS.ERR0005);
    if (!matches) throw new Error(ERRORS.ERR0006);

    const nodes: TokenNode[] = [];
    const ruleTokens = rule.split("|");

    // Create a token for each rule component and its corresponding match
    for (const [i, token] of ruleTokens.entries()) {
      const match = matches[i];
      if (match !== undefined) {
        nodes.push({ type: token, value: match });
      }
    }

    return nodes;
  }

  /**
   * Converts raw source code into an array of cleaned lines.
   *
   * Preprocessing step that:
   * - Splits source code by newlines
   * - Trims whitespace from each line
   * - Filters out empty lines
   *
   * This produces a clean, normalized input for lexical analysis.
   *
   * @private
   * @returns {string[]} Array of non-empty, trimmed lines of code
   * @throws {Error} Throws ERR0002 if raw code is not available
   *
   * @example
   * // Input: "Page [\n  Text: 'Hello'\n\n  \n]"
   * // Output: ["Page [", "Text: 'Hello'", "]"]
   */
  convertToLinesOfCode(): string[] {
    if (!this.rawCode) throw new Error(ERRORS.ERR0002);
    return this.rawCode
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
  }
}

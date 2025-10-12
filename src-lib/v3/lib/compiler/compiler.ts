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

import ERRORS from "../constants/errors";
import Metrics from "../tools/benchmark/metrics";
import { ASTRootNode } from "./core/ast";
import GRAMMAR from "./core/grammar";
import LexicalAnalyser from "./lexicalAnalyser";
import PreProcessor from "./preProcessor";
import SyntaxAnalyser from "./syntaxAnalyser";

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
  metrics: Metrics = new Metrics("Texscript Compilation");

  /** The raw source code being compiled */
  rawCode: string = "";

  /** Lines of code after preprocessing (trimmed, non-empty lines) */
  loc: string[] | null = null;

  /** Tokenized representation of the source code (2D array: lines × tokens) */
  tokens: TokenNode[] | null = null;

  /** The compiled Abstract Syntax Tree */
  ast: ASTRootNode | null = null;

  locCount: number = 0;

  constructor() {
    console.log(`[Texscript: Info] > Compiler ${this.version}`);
  }

  get lastCompilation(): Map<string, unknown> {
    return new Map<string, unknown>([
      ["loc", this.loc],
      ["tokens", this.tokens],
      ["ast", this.ast],
    ]);
  }

  toString(): {
    version: string;
    repoURL: string;
    lastCompilation: Map<string, unknown>;
    grammar: Map<string, RegExp>;
  } {
    return {
      version: this.version,
      repoURL: this.repourl,
      lastCompilation: this.lastCompilation,
      grammar: GRAMMAR,
    };
  }

  compile(rawCode: string): ASTRootNode {
    if (!rawCode) throw new Error(ERRORS.ERR0002);
    this.metrics.start();
    this.rawCode = rawCode;
    const preprocessor = new PreProcessor(this.rawCode);
    const characterStream = preprocessor.preprocessCode();
    const lexicalAnalyser = new LexicalAnalyser(characterStream);
    const { tokens, locCount } = lexicalAnalyser.lexicalAnalysis();
    this.tokens = tokens;
    this.locCount = locCount;
    const syntaxAnalyser = new SyntaxAnalyser(tokens);
    const ast = syntaxAnalyser.syntaxAnalysis();
    ast.value = "Program";
    ast.meta.languageName = "Texscript";
    ast.meta.languageCompilerVersion = this.version;
    this.metrics.end();
    return ast;
  }

  generateCodeFor(html: string): string {
    return html + "";
  }
}

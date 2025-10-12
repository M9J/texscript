import ERRORS from "../constants/errors";
import Metrics from "../tools/benchmark/metrics";
import { ASTRootNode } from "./core/ast";
import LexicalAnalyser from "./lexicalAnalyser";
import PreProcessor from "./preProcessor";
import SyntaxAnalyser from "./syntaxAnalyser";

type TokenNode = {
  type: string;
  value: string;
};

export default class Compiler {
  version: string = "v0.2";

  repourl: string = "https://github.com/M9J/texscript.git";

  metrics: Metrics = new Metrics("Texscript Compilation");

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
  } {
    return {
      version: this.version,
      repoURL: this.repourl,
      lastCompilation: this.lastCompilation,
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
}

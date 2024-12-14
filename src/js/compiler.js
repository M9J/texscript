import ERRORS from "./errors.js";
import { GRAMMAR } from "./grammar.js";
import Metrics from "./metrics.js";
import Stack from "./stack.js";

export default class Compiler {
  version = "v0.1";
  metrics = new Metrics();

  constructor() {
    console.log(`--::([ TEXScript Compiler ${this.version} ])::--`);
    this.metrics.start();
    const rawCode = this.findCodeFromHTML();
    if (!rawCode) throw new Error(ERRORS.ERR0001);
    const linesOfCode = this.convertToLinesOfCode(rawCode);
    this.compile(linesOfCode);
    this.metrics.end();
  }

  compile(linesOfCode) {
    if (!linesOfCode) throw new Error(ERRORS.ERR0009);
    const tokens = this.lexicalAnalysis(linesOfCode);
    console.log("tokens", tokens);
    const ast = this.syntaxAnalysis(tokens);
    console.log("ast", ast);
    const html = this.generateHTMLCode(ast);
    console.log("html", html);
  }

  generateHTMLCode(ast) {}

  syntaxAnalysis(tokens) {
    if (!tokens) throw new Error(ERRORS.ERR0008);
    const ast = { type: "Program", language: "TEXScript", body: [] };
    const hasTokens = Array.isArray(tokens) ? tokens.length > 0 : false;
    if (hasTokens) {
      for (const tokenLine of tokens) {
        const hasTokenLine = Array.isArray(tokenLine) ? tokenLine.length > 0 : false;
        if (hasTokenLine) {
          for (const token of tokenLine) {
            const astNode = { ...token };
            if (token.type === "KEYWORD") {
            } else if (token.type === "STRING") {
            } else if (token.type === "BR") {
            } else if (token.type === "COLON") {
            } else if (token.type === "BRACKET_SQUARE_CLOSE") {
            } else if (token.type === "BRACKET_SQUARE_OPEN") {
            } else if (token.type === "CSS_CLASS") {
            } else if (token.type === "PARAMETERS") {
            } else if (token.type === "HR") {
            } else if (token.type === "SPACE") {
            }
          }
        }
      }
    }
  }

  lexicalAnalysis(linesOfCode) {
    if (!linesOfCode) throw new Error(ERRORS.ERR0005);
    const tokens = [];
    for (const line of linesOfCode) {
      for (const [grammarRule, grammarRegEx] of GRAMMAR) {
        const matches = line.match(grammarRegEx);
        const hasMatches = Array.isArray(matches) ? matches.length > 0 : false;
        if (hasMatches) {
          const [lineMatch, ...grammarRegExMatches] = matches;
          if (lineMatch === line) {
            const perLineTokens = this.convertLineToTokens(grammarRule, grammarRegExMatches);
            tokens.push(perLineTokens);
          }
        }
      }
    }
    return tokens;
  }

  convertLineToTokens(rule, matches) {
    if (!rule) throw new Error(ERRORS.ERR0006);
    if (!matches) throw new Error(ERRORS.ERR0007);
    const nodes = [];
    const ruleTokens = rule.split("|");
    for (const [i, token] of ruleTokens.entries()) {
      if (i < matches.length) {
        const node = {};
        node.type = token;
        node.value = matches[i];
        nodes.push(node);
      }
    }
    return nodes;
  }

  convertToLinesOfCode(rawCode) {
    if (!rawCode) throw new Error(ERRORS.ERR0002);
    const linesOfCode = rawCode.split("\n");
    const cleanedLinesOfCode = linesOfCode.map((c) => c.trim()).filter((c) => c.length > 0);
    return cleanedLinesOfCode;
  }

  findCodeFromHTML() {
    const scriptElem = document.querySelectorAll('script[type="text/texscript"]');
    if (!scriptElem) throw new Error(ERRORS.ERR0003);
    const script = scriptElem ? scriptElem[0] : null;
    return script ? script.innerText : null;
  }
}

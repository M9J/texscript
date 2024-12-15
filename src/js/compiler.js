import { ASTLiteralNode, ASTRootNode, ASTSpecialTagNode, ASTTagNode } from "./ast.js";
import ERRORS from "./errors.js";
import GRAMMAR from "./grammar.js";
import Metrics from "./metrics.js";
import Stack from "./stack.js";

export default class Compiler {
  version = "v0.1";
  metrics = new Metrics();

  constructor() {
    console.log(`[TEXScript] :: https://github.com/m9j/texscript) :: ${this.version}`);
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
    // console.log("tokens", tokens);
    const ast = this.syntaxAnalysis(tokens);
    console.log("ast", ast);
    const html = this.generateHTMLCode(ast);
    console.log("html", html);
  }

  generateHTMLCode(ast) {}

  syntaxAnalysis(tokens) {
    if (!tokens) throw new Error(ERRORS.ERR0008);
    const ast = new ASTRootNode();
    ast.value = "Program";
    ast.meta.languageName = "TEXScript";
    ast.meta.languageCompilerVersion = this.version;
    const hasTokens = Array.isArray(tokens) ? tokens.length > 0 : false;
    const tagStack = new Stack();
    const colonStack = new Stack();
    const spaceStack = new Stack();
    if (hasTokens) {
      let currentNode = null;
      for (const tokenLine of tokens) {
        const hasTokenLine = Array.isArray(tokenLine) ? tokenLine.length > 0 : false;
        if (hasTokenLine) {
          for (const token of tokenLine) {
            if (!token.type) throw new Error(ERRORS.ERR0010);
            switch (token.type) {
              case "KEYWORD": {
                const tagNode = new ASTTagNode();
                tagNode.value = token.value;
                if (token.value === "Section") tagNode.htmlElement = "section";
                else tagNode.htmlElement = "div";
                currentNode = tagNode;
                if (tagStack.isEmpty()) ast.body.push(currentNode);
                else {
                  const prevTag = tagStack.peek();
                  if (prevTag) prevTag.children.push(currentNode);
                }
                break;
              }

              case "BR": {
                const brNode = new ASTSpecialTagNode();
                brNode.htmlElement = "br";
                currentNode.children.push(brNode);
                break;
              }

              case "HR": {
                const hrNode = new ASTSpecialTagNode();
                hrNode.htmlElement = "hr";
                currentNode.children.push(hrNode);
                break;
              }

              case "STRING": {
                const stringNode = new ASTLiteralNode();
                stringNode.value = token.value;
                const lineNode = new ASTTagNode();
                lineNode.value = "Line";
                lineNode.htmlElement = "div";
                lineNode.children.push(stringNode);
                if (!currentNode) debugger;
                currentNode.children.push(lineNode);
                if (!colonStack.isEmpty() && !spaceStack.isEmpty()) {
                  if (!tagStack.isEmpty()) currentNode = tagStack.peek();
                  colonStack.pop();
                  spaceStack.pop();
                }
                break;
              }

              case "CSS_CLASS": {
                currentNode.customCSSClasses.push(token.value);
                break;
              }

              case "PARAMETERS": {
                currentNode.parameters = token.value;
                break;
              }

              case "BRACKET_SQUARE_OPEN": {
                tagStack.push(currentNode);
                break;
              }

              case "BRACKET_SQUARE_CLOSE": {
                if (!tagStack.isEmpty()) tagStack.pop();
                if (!tagStack.isEmpty()) currentNode = tagStack.peek();
                break;
              }

              case "COLON": {
                colonStack.push(token);
                break;
              }

              case "SPACE": {
                spaceStack.push(token);
                break;
              }
            }
          }
        }
      }
    }
    return ast;
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

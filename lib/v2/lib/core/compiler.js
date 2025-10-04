import Metrics from "../benchmark/metrics.ts";
import ERRORS from "../constants/errors.ts";
import { ASTLiteralNode, ASTRootNode, ASTSpecialTagNode, ASTTagNode } from "./ast.ts";
import GRAMMAR from "./grammar.ts";
import Stack from "./stack.ts";

export default class Compiler {
  version = "v0.2";
  repourl = "https://github.com/M9J/texscript.git";
  metricsCompilation = new Metrics("Compilation");
  metricsCodeGeneration = new Metrics("Code Generation");
  rawCode = null;
  loc = null;
  tokens = null;
  ast = null;

  constructor() {
    console.log(`[Texscript: Info] > Compiler ${this.version}`);
  }

  toString() {
    return {
      version: this.version,
      repoURL: this.repourl,
      lastCompilation: new Map([
        ["loc", this.loc],
        ["tokens", this.tokens],
        ["ast", this.ast],
      ]),
    };
  }

  compile(rawCode) {
    this.rawCode = rawCode;
    this.metricsCompilation.start();
    this.loc = this.convertToLinesOfCode();
    this.tokens = this.lexicalAnalysis();
    this.ast = this.syntaxAnalysis();
    this.metricsCompilation.end();
  }

  generateCodeFor(lang) {
    if (!lang) throw new Error(ERRORS.ERR0011);
    this.metricsCodeGeneration.start();
    let code = null;
    if (lang === "HTML") code = this.generateCodeForHTML();
    else throw new Error(ERRORS.ERR0012);
    this.metricsCodeGeneration.end();
    return code;
  }

  generateCodeForHTML() {
    const ast = this.ast;
    if (!ast) throw new Error(ERRORS.ERR0009);
    let html = ``;
    const body = ast.body;
    if (body) {
      for (const node of body) {
        html += this.generateHTMLForNode(node);
      }
    }
    return html.trim();
  }

  generateHTMLForNode(node) {
    if (!node) throw new Error(ERRORS.ERR0010);
    const type = node.getNodeType();
    const value = node.value;
    const parameters = node.parameters;
    const htmlElement = node.htmlElement;
    const customCSSClasses = node.customCSSClasses;
    let customCSSClassesHTML = "";
    let parametersHTML = "";
    const hasCustomCSSClasses = Array.isArray(customCSSClasses)
      ? customCSSClasses.length > 0
      : false;
    const hasParameters = parameters || false;
    if (hasCustomCSSClasses) customCSSClassesHTML = ` ${customCSSClasses.join(" ")}`;
    if (hasParameters) {
      for (const paramName in parameters) {
        const paramValue = parameters[paramName];
        parametersHTML += ` texscript-${value}-${paramName.toUpperCase()}-${paramValue.toUpperCase()}`;
      }
    }
    const children = node.children || [];
    if (type === "TAG") {
      return `<${htmlElement} class="texscript-${value}${customCSSClassesHTML}${parametersHTML}">
          ${children.length > 0 && children.map((c) => this.generateHTMLForNode(c)).join("")}
      </${htmlElement}>
      `;
    } else if (type === "SPEC_TAG") return `<${htmlElement} class="texscript-${value}"/>`;
    else if (type === "LITERAL") return `${value}`;
  }

  syntaxAnalysis() {
    const tokens = this.tokens;
    if (!tokens) throw new Error(ERRORS.ERR0007);
    const ast = new ASTRootNode();
    ast.value = "Program";
    ast.meta.languageName = "Texscript";
    ast.meta.languageCompilerVersion = this.version;
    const hasTokens = Array.isArray(tokens) ? tokens.length > 0 : false;
    const [tagStack, colonStack, spaceStack] = [new Stack(), new Stack(), new Stack()];
    if (hasTokens) {
      let currentNode = null;
      for (const tokenLine of tokens) {
        const hasTokenLine = Array.isArray(tokenLine) ? tokenLine.length > 0 : false;
        if (hasTokenLine) {
          for (const token of tokenLine) {
            if (!token.type) throw new Error(ERRORS.ERR0008);
            switch (token.type) {
              case "BR": {
                const brNode = new ASTSpecialTagNode();
                brNode.htmlElement = "br";
                brNode.value = "BR";
                currentNode.children.push(brNode);
                break;
              }
              case "BRACKET_SQUARE_CLOSE": {
                if (!tagStack.isEmpty()) tagStack.pop();
                if (!tagStack.isEmpty()) currentNode = tagStack.peek();
                break;
              }
              case "BRACKET_SQUARE_OPEN": {
                tagStack.push(currentNode);
                break;
              }
              case "COLON": {
                colonStack.push(token);
                break;
              }
              case "CSS_CLASS": {
                currentNode.customCSSClasses.push(token.value);
                break;
              }
              case "EXTERNAL_REFERENCE": {
                if (token.value) {
                  const cleanedValue = token.value.replace(/[\@\s\"]/g, "");
                  const [referenceType, referenceValue] = cleanedValue.split(":");
                  if (referenceType === "CustomCSSFilePath") {
                    ast.dependencies[referenceType] = referenceValue;
                  }
                }
                break;
              }
              case "HR": {
                const hrNode = new ASTSpecialTagNode();
                hrNode.htmlElement = "hr";
                hrNode.value = "HR";
                currentNode.children.push(hrNode);
                break;
              }
              case "KEYWORD": {
                const tagNode = new ASTTagNode();
                tagNode.value = token.value;
                if (token.value === "Section") tagNode.htmlElement = "section";
                else if (token.value === "List") {
                  tagNode.htmlElement = "ul";
                } else tagNode.htmlElement = "div";
                currentNode = tagNode;
                if (tagStack.isEmpty()) ast.body.push(currentNode);
                else {
                  const prevTag = tagStack.peek();
                  if (prevTag) prevTag.children.push(currentNode);
                }
                break;
              }
              case "PARAMETERS": {
                const cleanedStr = token.value.replace(/[\(\)\s]/g, "");
                const parametersArr = cleanedStr.split(",");
                for (const param of parametersArr) {
                  const [paramName, paramValue] = param.split(":");
                  if (!currentNode.parameters) currentNode.parameters = {};
                  currentNode.parameters[paramName] = paramValue;
                }
                break;
              }
              case "SPACE": {
                spaceStack.push(token);
                break;
              }
              case "STRING": {
                const stringNode = new ASTLiteralNode();
                stringNode.value = token.value;
                const node = new ASTTagNode();
                if (!tagStack.isEmpty()) {
                  if (tagStack.peek().value === "List") {
                    node.value = "ListItem";
                    node.htmlElement = "li";
                  } else {
                    node.value = "Line";
                    node.htmlElement = "div";
                  }
                } else {
                  node.value = "Line";
                  node.htmlElement = "div";
                }
                node.children.push(stringNode);
                if (!currentNode) throw new Error(`'currentNode' doesn't exist`);
                currentNode.children.push(node);
                if (!colonStack.isEmpty() && !spaceStack.isEmpty()) {
                  if (!tagStack.isEmpty()) currentNode = tagStack.peek();
                  colonStack.pop();
                  spaceStack.pop();
                }
                break;
              }
            }
          }
        }
      }
    }
    return ast;
  }

  lexicalAnalysis() {
    const linesOfCode = this.loc;
    if (!linesOfCode) throw new Error(ERRORS.ERR0004);
    const tokens = [];
    for (const [index, line] of linesOfCode.entries()) {
      let foundGrammarMatch = false;
      for (const [grammarRule, grammarRegEx] of GRAMMAR) {
        const matches = line.match(grammarRegEx);
        const hasMatches = Array.isArray(matches) ? matches.length > 0 : false;
        if (hasMatches) {
          foundGrammarMatch = true;
          const [lineMatch, ...grammarRegExMatches] = matches;
          if (lineMatch === line) {
            const perLineTokens = this.convertLineToTokens(grammarRule, grammarRegExMatches);
            tokens.push(perLineTokens);
            break;
          }
        }
      }
      if (!foundGrammarMatch) {
        const lineNo = index + 1;
        const message = `${ERRORS.ERR0017}, line: ${lineNo}<br/>${line}`;
        throw new Error(message);
      }
    }
    return tokens;
  }

  convertLineToTokens(rule, matches) {
    if (!rule) throw new Error(ERRORS.ERR0005);
    if (!matches) throw new Error(ERRORS.ERR0006);
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

  convertToLinesOfCode() {
    const rawCode = this.rawCode;
    if (!rawCode) throw new Error(ERRORS.ERR0002);
    const linesOfCode = rawCode.split("\n");
    const cleanedLinesOfCode = linesOfCode.map((c) => c.trim()).filter((c) => c.length > 0);
    return cleanedLinesOfCode;
  }
}

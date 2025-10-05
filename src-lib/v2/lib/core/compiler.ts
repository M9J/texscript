import Metrics from "../benchmark/metrics";
import ERRORS from "../constants/errors";
import { ASTLiteralNode, ASTRootNode, ASTSpecialTagNode, ASTTagNode } from "./ast";
import GRAMMAR from "./grammar";
import Stack from "./stack";

type TokenNode = {
  type: string;
  value: string;
};

export default class Compiler {
  version: string = "v0.2";
  repourl: string = "https://github.com/M9J/texscript.git";
  metricsCompilation: Metrics = new Metrics("Compilation");
  metricsCodeGeneration: Metrics = new Metrics("Code Generation");
  rawCode: string | null = null;
  loc: string[] | null = null;
  tokens: TokenNode[][] | null = null;
  ast: ASTRootNode | null = null;

  constructor() {
    console.log(`[Texscript: Info] > Compiler ${this.version}`);
  }

  toString(): {
    version: string;
    repoURL: string;
    lastCompilation: Map<string, unknown>;
  } {
    return {
      version: this.version,
      repoURL: this.repourl,
      lastCompilation: new Map<string, unknown>([
        ["loc", this.loc],
        ["tokens", this.tokens],
        ["ast", this.ast],
      ]),
    };
  }

  compile(rawCode: string): void {
    this.rawCode = rawCode;
    this.metricsCompilation.start();
    this.loc = this.convertToLinesOfCode();
    this.tokens = this.lexicalAnalysis();
    this.ast = this.syntaxAnalysis();
    this.metricsCompilation.end();
  }

  generateCodeFor(lang: string): string {
    if (!lang) throw new Error(ERRORS.ERR0011);
    this.metricsCodeGeneration.start();
    let code: string | null = null;
    if (lang === "HTML") code = this.generateCodeForHTML();
    else throw new Error(ERRORS.ERR0012);
    this.metricsCodeGeneration.end();
    return code;
  }

  generateCodeForHTML(): string {
    if (!this.ast) throw new Error(ERRORS.ERR0009);
    let html = ``;
    for (const node of this.ast.body) {
      const type = node.getNodeType();
      if (type === "TAG" || type === "SPEC_TAG" || type === "LITERAL") {
        html += this.generateHTMLForNode(node as ASTTagNode | ASTSpecialTagNode | ASTLiteralNode);
      }
    }

    return html.trim();
  }

  generateHTMLForNode(node: ASTTagNode | ASTSpecialTagNode | ASTLiteralNode): string {
    if (!node) throw new Error(ERRORS.ERR0010);
    const type = node.getNodeType();
    const value = node.value;
    const htmlElement = (node as ASTTagNode | ASTSpecialTagNode).htmlElement;
    const parameters = (node as ASTTagNode).parameters;
    const customCSSClasses = (node as ASTTagNode).customCSSClasses;
    const children = (node as ASTTagNode).children || [];

    let customCSSClassesHTML = "";
    let parametersHTML = "";

    if (Array.isArray(customCSSClasses) && customCSSClasses.length > 0) {
      customCSSClassesHTML = ` ${customCSSClasses.join(" ")}`;
    }

    if (parameters) {
      for (const paramName in parameters) {
        const paramValue = parameters[paramName];
        parametersHTML += ` texscript-${value}-${paramName.toUpperCase()}-${paramValue.toUpperCase()}`;
      }
    }

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
      return `<${htmlElement} class="texscript-${value}"/>`;
    } else if (type === "LITERAL") {
      return `${value}`;
    }

    return "";
  }

  syntaxAnalysis(): ASTRootNode {
    if (!this.tokens) throw new Error(ERRORS.ERR0007);
    const ast = new ASTRootNode();
    ast.value = "Program";
    ast.meta.languageName = "Texscript";
    ast.meta.languageCompilerVersion = this.version;

    const tagStack = new Stack<ASTTagNode>();
    const colonStack = new Stack<TokenNode>();
    const spaceStack = new Stack<TokenNode>();

    let currentNode: ASTTagNode | null = null;

    for (const tokenLine of this.tokens) {
      for (const token of tokenLine) {
        if (!token.type) throw new Error(ERRORS.ERR0008);

        switch (token.type) {
          case "BR":
            const brNode = new ASTSpecialTagNode();
            brNode.htmlElement = "br";
            brNode.value = "BR";
            currentNode?.children.push(brNode);
            break;

          case "BRACKET_SQUARE_CLOSE":
            if (!tagStack.isEmpty()) {
              tagStack.pop();
              currentNode = tagStack.isEmpty() ? null : tagStack.peek()!;
            }
            break;

          case "BRACKET_SQUARE_OPEN":
            if (currentNode) tagStack.push(currentNode);
            break;

          case "COLON":
            colonStack.push(token);
            break;

          case "CSS_CLASS":
            currentNode?.customCSSClasses.push(token.value);
            break;

          case "EXTERNAL_REFERENCE":
            if (token.value) {
              const cleanedValue = token.value.replace(/[\@\s\"]/g, "");
              const [referenceType, referenceValue] = cleanedValue.split(":");
              if (referenceType === "CustomCSSFilePath") {
                ast.dependencies[referenceType] = referenceValue;
              }
            }
            break;

          case "HR":
            const hrNode = new ASTSpecialTagNode();
            hrNode.htmlElement = "hr";
            hrNode.value = "HR";
            currentNode?.children.push(hrNode);
            break;

          case "KEYWORD":
            const tagNode = new ASTTagNode();
            tagNode.value = token.value;
            tagNode.htmlElement =
              token.value === "Section" ? "section" : token.value === "List" ? "ul" : "div";
            currentNode = tagNode;
            if (tagStack.isEmpty()) {
              ast.body.push(currentNode);
            } else {
              tagStack.peek()?.children.push(currentNode);
            }
            break;

          case "PARAMETERS":
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

          case "SPACE":
            spaceStack.push(token);
            break;

          case "STRING":
            const stringNode = new ASTLiteralNode();
            stringNode.value = token.value;

            const node = new ASTTagNode();
            node.value = tagStack.peek()?.value === "List" ? "ListItem" : "Line";
            node.htmlElement = node.value === "ListItem" ? "li" : "div";
            node.children.push(stringNode);

            if (!currentNode) throw new Error(`'currentNode' doesn't exist`);
            currentNode.children.push(node);

            if (!colonStack.isEmpty() && !spaceStack.isEmpty()) {
              currentNode = tagStack.peek() || null;
              colonStack.pop();
              spaceStack.pop();
            }
            break;
        }
      }
    }

    return ast;
  }

  lexicalAnalysis(): TokenNode[][] {
    if (!this.loc) throw new Error(ERRORS.ERR0004);
    const tokens: TokenNode[][] = [];

    for (const [index, line] of this.loc.entries()) {
      let foundGrammarMatch = false;

      for (const [grammarRule, grammarRegEx] of GRAMMAR) {
        const matches = line.match(grammarRegEx);
        if (matches && matches.length > 0) {
          const [lineMatch, ...grammarRegExMatches] = matches;
          if (lineMatch === line) {
            const perLineTokens = this.convertLineToTokens(grammarRule, grammarRegExMatches);
            tokens.push(perLineTokens);
            foundGrammarMatch = true;
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

  convertLineToTokens(rule: string, matches: string[]): TokenNode[] {
    if (!rule) throw new Error(ERRORS.ERR0005);
    if (!matches) throw new Error(ERRORS.ERR0006);

    const nodes: TokenNode[] = [];
    const ruleTokens = rule.split("|");

    for (const [i, token] of ruleTokens.entries()) {
      const match = matches[i];
      if (match !== undefined) {
        nodes.push({ type: token, value: match });
      }
    }

    return nodes;
  }

  convertToLinesOfCode(): string[] {
    if (!this.rawCode) throw new Error(ERRORS.ERR0002);
    return this.rawCode
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
  }
}

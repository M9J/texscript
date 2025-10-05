import {
  errors_default
} from "./chunk-AN3GKGAC.js";
import {
  __privateAdd,
  __privateGet,
  __privateSet
} from "./chunk-77J4NURK.js";

// src-lib/v2/lib/benchmark/metrics.ts
var _metricsName, _startTime, _endTime;
var Metrics = class {
  constructor(metricsName) {
    __privateAdd(this, _metricsName, null);
    __privateAdd(this, _startTime, null);
    __privateAdd(this, _endTime, null);
    if (!metricsName) throw new Error(errors_default.ERR0013);
    __privateSet(this, _metricsName, metricsName);
  }
  start() {
    __privateSet(this, _startTime, performance.now());
  }
  end() {
    __privateSet(this, _endTime, performance.now());
    const totalTime = this.getFormattedTime();
    console.log(`[Texscript: Metrics] > ${__privateGet(this, _metricsName)} finished in ${totalTime}`);
  }
  getTotalTimeMilliseconds() {
    if (__privateGet(this, _endTime) && __privateGet(this, _startTime)) {
      return __privateGet(this, _endTime) - __privateGet(this, _startTime);
    } else return 0;
  }
  getFormattedTime() {
    const ms = this.getTotalTimeMilliseconds();
    if (ms < 1e3) {
      return `${ms.toFixed(3)}ms`;
    } else {
      return `${(ms / 1e3).toFixed(3)}s`;
    }
  }
};
_metricsName = new WeakMap();
_startTime = new WeakMap();
_endTime = new WeakMap();

// src-lib/v2/lib/core/ast.ts
var _nodeType;
var ASTNode = class {
  constructor(type) {
    __privateAdd(this, _nodeType, null);
    __privateSet(this, _nodeType, type);
  }
  getNodeType() {
    return __privateGet(this, _nodeType);
  }
};
_nodeType = new WeakMap();
var ASTRootNode = class extends ASTNode {
  constructor() {
    super("ROOT");
    this.value = null;
    this.meta = {};
    this.body = [];
    this.dependencies = {};
  }
};
var ASTTagNode = class extends ASTNode {
  constructor() {
    super("TAG");
    this.value = null;
    this.htmlElement = null;
    this.customCSSClasses = [];
    this.parameters = null;
    this.children = [];
  }
};
var ASTLiteralNode = class extends ASTNode {
  constructor() {
    super("LITERAL");
    this.value = null;
  }
};
var ASTSpecialTagNode = class extends ASTNode {
  constructor() {
    super("SPEC_TAG");
    this.htmlElement = null;
    this.value = null;
  }
};

// src-lib/v2/lib/core/grammar.ts
var MetaTokensBasic = {
  KEYWORD: /(^[A-Z][a-z]*)/,
  STRING: /"(.*)"$|(\\\"(.*)\\\"$)/
};
var MetaTokensExtended = {
  CSS_CLASS: /\.([a-z]+[a-zA-Z]*)/,
  EXTERNAL_REFERENCE: /(@[A-Z][a-zA-Z]*:\s".*")/,
  PARAMETERS: /(\([\s*\w+:\s*\w+,*\s*]*\))/
};
var MetaTokensPunctuation = {
  BRACKET_SQUARE_CLOSE: /(\])/,
  BRACKET_SQUARE_OPEN: /(\[)/,
  COLON: /(:)/,
  SPACE: /(\s)/
};
var MetaTokensSpecial = {
  BR: /(::)/,
  HR: /(--)/
};
var META_TOKENS = {
  ...MetaTokensBasic,
  ...MetaTokensExtended,
  ...MetaTokensPunctuation,
  ...MetaTokensSpecial
};
var GRAMMAR_RULES = [
  "BR",
  "BRACKET_SQUARE_CLOSE",
  "HR",
  "KEYWORD|COLON|SPACE|STRING",
  "KEYWORD|CSS_CLASS|COLON|SPACE|STRING",
  "KEYWORD|CSS_CLASS|SPACE|BRACKET_SQUARE_OPEN",
  "KEYWORD|CSS_CLASS|SPACE|PARAMETERS|COLON|SPACE|STRING",
  "KEYWORD|CSS_CLASS|SPACE|PARAMETERS|SPACE|BRACKET_SQUARE_OPEN",
  "KEYWORD|SPACE|BRACKET_SQUARE_OPEN",
  "KEYWORD|SPACE|PARAMETERS|COLON|SPACE|STRING",
  "KEYWORD|SPACE|PARAMETERS|SPACE|BRACKET_SQUARE_OPEN",
  "STRING",
  "EXTERNAL_REFERENCE"
];
function convertRulesToGrammar(grammarRules, metaTokens) {
  const grammar = /* @__PURE__ */ new Map();
  for (const grammarRule of grammarRules) {
    const patterns = grammarRule.split("|").map((token) => {
      const regex = metaTokens[token];
      if (!regex) {
        throw new Error(`Unknown token: ${token}`);
      }
      return regex.source;
    });
    const grammarRegex = new RegExp(patterns.join(""));
    grammar.set(grammarRule, grammarRegex);
  }
  return grammar;
}
var grammar_default = convertRulesToGrammar(GRAMMAR_RULES, META_TOKENS);

// src-lib/v2/lib/core/stack.ts
var Stack = class {
  constructor() {
    this.items = [];
  }
  push(element) {
    this.items.push(element);
  }
  pop() {
    if (this.isEmpty()) {
      throw new Error("Stack underflow");
    }
    return this.items.pop();
  }
  isEmpty() {
    return this.items.length === 0;
  }
  size() {
    return this.items.length;
  }
  peek() {
    if (!this.isEmpty()) return this.items[this.items.length - 1];
    else return null;
  }
};

// src-lib/v2/lib/core/compiler.ts
var Compiler = class {
  constructor() {
    this.version = "v0.2";
    this.repourl = "https://github.com/M9J/texscript.git";
    this.metricsCompilation = new Metrics("Compilation");
    this.metricsCodeGeneration = new Metrics("Code Generation");
    this.rawCode = null;
    this.loc = null;
    this.tokens = null;
    this.ast = null;
    console.log(`[Texscript: Info] > Compiler ${this.version}`);
  }
  toString() {
    return {
      version: this.version,
      repoURL: this.repourl,
      lastCompilation: /* @__PURE__ */ new Map([
        ["loc", this.loc],
        ["tokens", this.tokens],
        ["ast", this.ast]
      ])
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
    if (!lang) throw new Error(errors_default.ERR0011);
    this.metricsCodeGeneration.start();
    let code = null;
    if (lang === "HTML") code = this.generateCodeForHTML();
    else throw new Error(errors_default.ERR0012);
    this.metricsCodeGeneration.end();
    return code;
  }
  generateCodeForHTML() {
    if (!this.ast) throw new Error(errors_default.ERR0009);
    let html = ``;
    for (const node of this.ast.body) {
      const type = node.getNodeType();
      if (type === "TAG" || type === "SPEC_TAG" || type === "LITERAL") {
        html += this.generateHTMLForNode(node);
      }
    }
    return html.trim();
  }
  generateHTMLForNode(node) {
    if (!node) throw new Error(errors_default.ERR0010);
    const type = node.getNodeType();
    const value = node.value;
    const htmlElement = node.htmlElement;
    const parameters = node.parameters;
    const customCSSClasses = node.customCSSClasses;
    const children = node.children || [];
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
    ${children.filter((c) => {
        const t = c.getNodeType();
        return t === "TAG" || t === "SPEC_TAG" || t === "LITERAL";
      }).map((c) => this.generateHTMLForNode(c)).join("")}
  </${htmlElement}>`;
    } else if (type === "SPEC_TAG") {
      return `<${htmlElement} class="texscript-${value}"/>`;
    } else if (type === "LITERAL") {
      return `${value}`;
    }
    return "";
  }
  syntaxAnalysis() {
    if (!this.tokens) throw new Error(errors_default.ERR0007);
    const ast = new ASTRootNode();
    ast.value = "Program";
    ast.meta.languageName = "Texscript";
    ast.meta.languageCompilerVersion = this.version;
    const tagStack = new Stack();
    const colonStack = new Stack();
    const spaceStack = new Stack();
    let currentNode = null;
    for (const tokenLine of this.tokens) {
      for (const token of tokenLine) {
        if (!token.type) throw new Error(errors_default.ERR0008);
        switch (token.type) {
          case "BR":
            const brNode = new ASTSpecialTagNode();
            brNode.htmlElement = "br";
            brNode.value = "BR";
            currentNode == null ? void 0 : currentNode.children.push(brNode);
            break;
          case "BRACKET_SQUARE_CLOSE": {
            if (!tagStack.isEmpty()) tagStack.pop();
            if (!tagStack.isEmpty()) currentNode = !tagStack.isEmpty() ? tagStack.peek() : null;
            break;
          }
          case "BRACKET_SQUARE_OPEN":
            if (currentNode) tagStack.push(currentNode);
            break;
          case "COLON":
            colonStack.push(token);
            break;
          case "CSS_CLASS":
            currentNode == null ? void 0 : currentNode.customCSSClasses.push(token.value);
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
            currentNode == null ? void 0 : currentNode.children.push(hrNode);
            break;
          case "KEYWORD":
            const tagNode = new ASTTagNode();
            tagNode.value = token.value;
            tagNode.htmlElement = token.value === "Section" ? "section" : token.value === "List" ? "ul" : "div";
            currentNode = tagNode;
            if (tagStack.isEmpty()) {
              ast.body.push(currentNode);
            } else {
              const prevTag = !tagStack.isEmpty() ? tagStack.peek() : null;
              if (prevTag) prevTag.children.push(currentNode);
            }
            break;
          case "PARAMETERS":
            const cleanedStr = token.value.replace(/[\(\)\s]/g, "");
            const parametersArr = cleanedStr.split(",");
            for (const param of parametersArr) {
              const [paramName, paramValue] = param.split(":");
              if (paramName && paramValue) {
                if (!(currentNode == null ? void 0 : currentNode.parameters)) currentNode.parameters = {};
                currentNode.parameters[paramName] = paramValue;
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
            if (!tagStack.isEmpty()) {
              const tag = !tagStack.isEmpty() ? tagStack.peek() : null;
              if ((tag == null ? void 0 : tag.value) === "List") {
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
              currentNode = !tagStack.isEmpty() ? tagStack.peek() : null;
              colonStack.pop();
              spaceStack.pop();
            }
            break;
        }
      }
    }
    return ast;
  }
  lexicalAnalysis() {
    if (!this.loc) throw new Error(errors_default.ERR0004);
    const tokens = [];
    for (const [index, line] of this.loc.entries()) {
      let foundGrammarMatch = false;
      for (const [grammarRule, grammarRegEx] of grammar_default) {
        const matches = line.match(grammarRegEx);
        if (matches && matches.length > 0) {
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
        const message = `${errors_default.ERR0017}, line: ${lineNo}<br/>${line}`;
        throw new Error(message);
      }
    }
    return tokens;
  }
  convertLineToTokens(rule, matches) {
    if (!rule) throw new Error(errors_default.ERR0005);
    if (!matches) throw new Error(errors_default.ERR0006);
    const nodes = [];
    const ruleTokens = rule.split("|");
    for (const [i, token] of ruleTokens.entries()) {
      const match = matches[i];
      if (match !== void 0) {
        nodes.push({ type: token, value: match });
      }
    }
    return nodes;
  }
  convertToLinesOfCode() {
    if (!this.rawCode) throw new Error(errors_default.ERR0002);
    return this.rawCode.split("\n").map((line) => line.trim()).filter((line) => line.length > 0);
  }
};
export {
  Compiler as default
};

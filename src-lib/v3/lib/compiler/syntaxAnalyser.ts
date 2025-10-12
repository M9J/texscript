import ERRORS from "../constants/errors";
import Metrics from "../tools/benchmark/metrics";
import { ASTLiteralNode, ASTRootNode, ASTSpecialTagNode, ASTTagNode } from "./core/ast";
import Stack from "./core/stack";
import { Token, TokenType } from "./types/token";

export default class SyntaxAnalyser {
  private metrics = new Metrics("PrePrecessor");
  private tokens: Token[] = [];
  private ast: ASTRootNode = new ASTRootNode();

  private declarations: Record<string, any> = {
    configure: {},
    reference: {},
  };

  private declarationStack = new Stack<string>();
  private contextStack = new Stack<string>();
  private tagStack = new Stack<ASTTagNode>();
  private bracketRoundStack = new Stack<string>();
  private bracketSquareStack = new Stack<string>();
  private colonStack = new Stack<string>();
  private dotStack = new Stack<string>();
  private keyStack = new Stack<string>();

  private currentNode: ASTTagNode | null = null;

  constructor(tokens: Token[]) {
    if (!tokens) throw new Error(ERRORS.ERR0007);
    this.tokens = tokens;
  }

  syntaxAnalysis(): ASTRootNode {
    this.metrics.start();
    for (const [_, token] of Object.entries(this.tokens)) {
      switch (token.type) {
        case TokenType.BRACKET_ROUND_CLOSE:
          this.handleBracketRoundClose();
          break;

        case TokenType.BRACKET_ROUND_OPEN:
          this.handleBracketRoundOpen();
          break;

        case TokenType.BRACKET_SQUARE_CLOSE:
          this.handleBracketSquareClose();
          break;

        case TokenType.BRACKET_SQUARE_OPEN:
          this.handleBracketSquareOpen();
          break;

        case TokenType.COLON:
          this.handleColon(token);
          break;

        case TokenType.COMMA:
          continue;

        case TokenType.CONSTANT:
          this.handleConstant(token);
          break;

        case TokenType.DECLARATION:
          this.handleDeclaration(token);
          break;

        case TokenType.DECORATOR:
          this.handleDecorator(token);
          break;

        case TokenType.DOT:
          this.handleDot();
          break;

        case TokenType.IDENTIFIER:
          this.handleIdentifier(token);
          break;

        case TokenType.INTEGER:
          continue;

        case TokenType.KEYWORD:
          this.handleKeyword(token);
          break;

        case TokenType.STRING:
          this.handleString(token);
          break;
      }
    }

    this.ast.configurations = this.declarations.configure;
    this.ast.references = this.declarations.reference;

    this.metrics.end();

    return this.ast;
  }

  private handleString(token: Token) {
    const isDeclaration = this.contextStack.peek() === TokenType.DECLARATION;
    const isParameter =
      this.contextStack.peek() === TokenType.KEYWORD &&
      this.bracketRoundStack.peek() === TokenType.BRACKET_ROUND_OPEN &&
      this.keyStack.peek();
    if (isDeclaration) this.handleDeclarationStatement(token);
    else if (isParameter) this.handleParameterStatement(token);
    else this.handleStringLiteralStatement(token);
  }

  private handleKeyword(token: Token) {
    this.contextStack.push(TokenType.KEYWORD);

    const tagNode = new ASTTagNode();
    tagNode.value = token.value;
    tagNode.htmlElement = "div";

    if (token.value === "Section") tagNode.htmlElement = "section";
    else if (token.value === "List") tagNode.htmlElement = "ul";

    this.currentNode = tagNode;

    if (this.tagStack.isEmpty()) {
      if (this.ast.body.length > 0) {
        const pageBreakNode = new ASTTagNode();
        pageBreakNode.value = "PageBreak";
        pageBreakNode.htmlElement = "div";
        this.ast.body.push(pageBreakNode);
      }
      const pageWrapperNode = new ASTTagNode();
      pageWrapperNode.value = "PageWrapper";
      pageWrapperNode.htmlElement = "div";
      pageWrapperNode.children.push(this.currentNode);
      this.ast.body.push(pageWrapperNode);
    } else {
      const prevTag = !this.tagStack.isEmpty() ? this.tagStack.peek() : null;
      if (prevTag && prevTag.children) prevTag.children.push(this.currentNode);
    }
  }

  private handleIdentifier(token: Token) {
    const isDeclaration = this.contextStack.peek() === TokenType.DECLARATION;
    const isCSSClass =
      this.contextStack.peek() === TokenType.KEYWORD && this.dotStack.peek() === TokenType.DOT;
    const isKey =
      this.contextStack.peek() === TokenType.KEYWORD &&
      this.bracketRoundStack.peek() === TokenType.BRACKET_ROUND_OPEN;
    if (isDeclaration) {
      this.declarationStack.push(token.value);
    } else if (isCSSClass) {
      this.currentNode?.customCSSClasses.push(token.value);
      this.dotStack.pop();
    } else if (isKey) {
      this.keyStack.push(token.value);
    }
  }

  private handleDot() {
    const isKeyword = this.contextStack.peek() === TokenType.KEYWORD;
    if (isKeyword) {
      this.dotStack.push(TokenType.DOT);
    }
  }

  private handleDecorator(token: Token) {
    const decoratorNode = new ASTSpecialTagNode();
    const isLineBreak = /\:+/.test(token.value);
    const isHorizontalRule = /\-+/.test(token.value);
    if (isLineBreak) {
      decoratorNode.htmlElement = "br";
      decoratorNode.value = "BR";
    } else if (isHorizontalRule) {
      decoratorNode.htmlElement = "hr";
      decoratorNode.value = "HR";
    }
    this.currentNode?.children.push(decoratorNode);
  }

  private handleDeclaration(token: Token) {
    this.contextStack.push(TokenType.DECLARATION);
    this.declarationStack.push(token.value);
  }

  private handleConstant(token: Token) {
    const isDeclaration = this.contextStack.peek() === TokenType.DECLARATION;
    const isParameter =
      this.contextStack.peek() === TokenType.KEYWORD &&
      this.bracketRoundStack.peek() === TokenType.BRACKET_ROUND_OPEN &&
      this.keyStack.peek();
    if (isDeclaration) this.handleDeclarationStatement(token);
    else if (isParameter) this.handleParameterStatement(token);
  }

  private handleColon(token: Token) {
    this.colonStack.push(token.value);
  }

  private handleBracketSquareOpen() {
    this.bracketSquareStack.push(TokenType.BRACKET_SQUARE_OPEN);
    if (this.currentNode) this.tagStack.push(this.currentNode);
  }

  private handleBracketSquareClose() {
    if (!this.tagStack.isEmpty()) this.tagStack.pop();
    if (!this.tagStack.isEmpty()) {
      this.currentNode = !this.tagStack.isEmpty() ? this.tagStack.peek() : null;
    }
    this.contextStack.pop();
    this.bracketSquareStack.pop();
  }

  private handleBracketRoundOpen() {
    this.bracketRoundStack.push(TokenType.BRACKET_ROUND_OPEN);
  }

  private handleBracketRoundClose() {
    this.bracketRoundStack.pop();
  }

  private handleDeclarationStatement(token: Token) {
    const value = token.value;
    const key = this.declarationStack.pop();
    const topic = (this.declarationStack.pop() as string).toLowerCase();
    if (topic && key && value) {
      if (!this.declarations[topic]) this.declarations[topic] = {};
      if (topic === "configure") {
        this.declarations[topic][key as string] = value;
      } else if (topic === "reference") {
        if (!this.declarations[topic][key as string]) {
          this.declarations[topic][key as string] = [];
        }
        if (Array.isArray(this.declarations[topic][key as string])) {
          const arr = this.declarations[topic][key as string];
          if (!arr.includes(value)) this.declarations[topic][key as string].push(value);
        }
      }
      this.colonStack.pop();
      this.contextStack.pop();
    }
  }

  private handleParameterStatement(token: Token) {
    const key = this.keyStack.pop() as string;
    if (this.currentNode) {
      if (!this.currentNode.parameters) this.currentNode.parameters = {};
      this.currentNode.parameters[key] = token.value;
      this.colonStack.pop();
    }
  }

  private handleStringLiteralStatement(token: Token) {
    
    const stringNode = new ASTLiteralNode();
    stringNode.value = token.value;

    const node = new ASTTagNode();

    
    if (!this.tagStack.isEmpty()) {
      const tag = !this.tagStack.isEmpty() ? this.tagStack.peek() : null;
      if (tag?.value === "List") {
        
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
    if (!this.currentNode) throw new Error(`'currentNode' doesn't exist`);
    this.currentNode.children.push(node);

    
    if (!this.colonStack.isEmpty()) {
      this.currentNode = !this.tagStack.isEmpty() ? this.tagStack.peek() : null;
      this.colonStack.pop();
    }
  }
}

class ASTNode {
  #nodeType = null;

  constructor(type) {
    this.#nodeType = type;
  }
}

export class ASTRootNode extends ASTNode {
  value = null;
  meta = {};
  body = [];

  constructor() {
    super("ROOT");
  }
}

export class ASTTagNode extends ASTNode {
  value = null;
  htmlElement = null;
  customCSSClasses = [];
  parameters = {};
  children = [];

  constructor() {
    super("TAG");
  }
}

export class ASTLiteralNode extends ASTNode {
  value = null;

  constructor() {
    super("LITERAL");
  }
}

export class ASTSpecialTagNode extends ASTNode {
  htmlElement = null;

  constructor() {
    super("SPEC_TAG");
  }
}

export default class AST {
  root = null;

  constructor() {
    this.root = new ASTRootNode("Program");
  }
}

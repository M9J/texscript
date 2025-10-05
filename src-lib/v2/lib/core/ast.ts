class ASTNode {
  #nodeType: string | null = null;

  constructor(type: string) {
    this.#nodeType = type;
  }

  getNodeType(): string | null {
    return this.#nodeType;
  }
}

export class ASTRootNode extends ASTNode {
  value: string | null = null;
  meta: Record<string, any> = {};
  body: ASTNode[] = [];
  dependencies: Record<string, any> = {};

  constructor() {
    super("ROOT");
  }
}

export class ASTTagNode extends ASTNode {
  value: string | null = null;
  htmlElement: string | null = null;
  customCSSClasses: string[] = [];
  parameters: Record<string, any> | null = null;
  children: ASTNode[] = [];

  constructor() {
    super("TAG");
  }
}

export class ASTLiteralNode extends ASTNode {
  value: string | null = null;

  constructor() {
    super("LITERAL");
  }
}

export class ASTSpecialTagNode extends ASTNode {
  htmlElement: string | null = null;
  value: string | null = null;

  constructor() {
    super("SPEC_TAG");
  }
}

export default class AST {
  root: ASTRootNode | null = null;

  constructor() {
    this.root = new ASTRootNode();
  }
}

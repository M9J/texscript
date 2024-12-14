class ASTNode {
  constructor(type, value = null, children = []) {
    this.type = type;
    this.value = value;
    this.children = children;
  }
}

export default class AST {
  ast = null;

  constructor() {
    this.ast = new ASTNode("Program");
  }
}

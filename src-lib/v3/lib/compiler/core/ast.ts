/**
 * Abstract Syntax Tree (AST) Implementation
 *
 * This module defines the AST structure used by the Texscript compiler to represent
 * parsed code in a tree format. The AST serves as an intermediate representation
 * between the lexer/parser and code generation phases.
 *
 * The AST hierarchy follows this structure:
 * - ASTNode: Base class for all nodes
 *   - ASTRootNode: Top-level document node
 *   - ASTTagNode: Component/element nodes with children
 *   - ASTLiteralNode: Text and primitive value nodes
 *   - ASTSpecialTagNode: Special syntax nodes (imports, metadata, etc.)
 *
 * @module ast
 */

/**
 * Base class for all AST nodes.
 *
 * Provides common functionality for node type identification. All specific
 * node types inherit from this class to ensure type safety and consistent
 * node classification throughout the AST traversal and transformation process.
 *
 * @class ASTNode
 * @abstract
 */
class ASTNode {
  /** The type identifier for this node (e.g., "ROOT", "TAG", "LITERAL") */
  #nodeType: string | null = null;

  /**
   * Creates a new AST node with the specified type.
   *
   * @param {string} type - The node type identifier
   */
  constructor(type: string) {
    this.#nodeType = type;
  }

  /**
   * Returns the type identifier of this node.
   *
   * Used during AST traversal to determine how to process or transform
   * each node without relying on instanceof checks.
   *
   * @returns {string | null} The node type identifier
   */
  getNodeType(): string | null {
    return this.#nodeType;
  }
}

/**
 * Root node of the AST representing the entire document.
 *
 * This is the top-level node that contains all other nodes in the tree.
 * It stores document-wide metadata, dependencies, and the main body of content.
 * Every AST has exactly one root node.
 *
 * @class ASTRootNode
 * @extends ASTNode
 */
export class ASTRootNode extends ASTNode {
  /** Optional document-level value or title */
  value: string | null = null;

  /** Document metadata (author, version, configuration, etc.) */
  meta: Record<string, any> = {};

  /** Top-level nodes in the document (the main content tree) */
  body: ASTNode[] = [];

  /** References required by the document */
  references: Record<string, any> = {};

  /** Configurations required by the document */
  configurations: Record<string, any> = {};

  /**
   * Creates a new root node for the AST.
   */
  constructor() {
    super("ROOT");
  }
}

/**
 * Represents a component or element tag in the AST.
 *
 * Tag nodes correspond to Texscript components and elements. They can have:
 * - A value (text content or identifier)
 * - An HTML element mapping for code generation
 * - CSS classes for styling
 * - Parameters/props passed to the component
 * - Child nodes forming a subtree
 *
 * @class ASTTagNode
 * @extends ASTNode
 *
 * @example
 * // Represents: Page(title="Home") { Text "Hello" }
 * const pageNode = new ASTTagNode();
 * pageNode.value = "Page";
 * pageNode.parameters = { title: "Home" };
 * pageNode.children = [textNode];
 */
export class ASTTagNode extends ASTNode {
  /** The tag/component name or identifier */
  value: string | null = null;

  /** Target HTML element for code generation (e.g., "div", "span") */
  htmlElement: string | null = null;

  /** CSS class names to apply to the generated element */
  customCSSClasses: string[] = [];

  /** Component parameters/props as key-value pairs */
  parameters: Record<string, any> | null = {};

  /** Child nodes nested within this tag */
  children: ASTNode[] = [];

  /**  */
  htmlAttributes: Record<string, string> = {};

  /**
   * Creates a new tag node.
   */
  constructor() {
    super("TAG");
  }
}

/**
 * Represents a literal value in the AST.
 *
 * Literal nodes contain raw text, strings, numbers, or other primitive values
 * that appear in the source code. These are typically leaf nodes in the AST
 * with no children.
 *
 * @class ASTLiteralNode
 * @extends ASTNode
 *
 * @example
 * // Represents: "Hello World"
 * const literalNode = new ASTLiteralNode();
 * literalNode.value = "Hello World";
 */
export class ASTLiteralNode extends ASTNode {
  /** The literal value (string, number, etc.) */
  value: string | null = null;

  /**
   * Creates a new literal node.
   */
  constructor() {
    super("LITERAL");
  }
}

/**
 * Represents a special syntax tag in the AST.
 *
 * Special tags handle language features that require unique processing,
 * such as imports, metadata declarations, or other compiler directives.
 * They may have different code generation rules than standard tags.
 *
 * @class ASTSpecialTagNode
 * @extends ASTNode
 *
 * @example
 * // Represents: Import "stylesheet.css"
 * const importNode = new ASTSpecialTagNode();
 * importNode.htmlElement = "link";
 * importNode.value = "stylesheet.css";
 */
export class ASTSpecialTagNode extends ASTNode {
  /** Target HTML element or special handling type */
  htmlElement: string | null = null;

  /** The value associated with this special tag */
  value: string | null = null;

  /**
   * Creates a new special tag node.
   */
  constructor() {
    super("SPEC_TAG");
  }
}

/**
 * The complete Abstract Syntax Tree structure.
 *
 * This class represents the entire AST for a Texscript document.
 * It always contains a root node which serves as the entry point
 * for traversal and code generation.
 *
 * @class AST
 *
 * @example
 * const ast = new AST();
 * ast.root.body.push(new ASTTagNode());
 */
export default class AST {
  /** The root node of the tree */
  root: ASTRootNode | null = null;

  /**
   * Creates a new AST with an initialized root node.
   */
  constructor() {
    this.root = new ASTRootNode();
  }
}

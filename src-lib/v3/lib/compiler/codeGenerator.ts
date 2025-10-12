import ERRORS from "../constants/errors";
import Metrics from "../tools/benchmark/metrics";
import { ASTLiteralNode, ASTRootNode, ASTSpecialTagNode, ASTTagNode } from "./core/ast";

export default class CodeGenerator {
  private ast: ASTRootNode | null = null;
  private metrics: Metrics = new Metrics("Texscript Code Generation");

  constructor(ast: ASTRootNode) {
    if (!ast) throw new Error(ERRORS.ERR0009);
    this.ast = ast;
  }

  generateCodeForHTML(): string {
    if (!this.ast) throw new Error(ERRORS.ERR0009);
    let html = ``;
    this.metrics.start();
    // Generate HTML for each top-level node in the AST body
    for (const node of this.ast.body) {
      const type = node.getNodeType();
      if (type === "TAG" || type === "SPEC_TAG" || type === "LITERAL") {
        html += this.generateHTMLForNode(node as ASTTagNode | ASTSpecialTagNode | ASTLiteralNode);
      }
    }
    this.metrics.end();
    return html.trim();
  }

  private generateHTMLForNode(node: ASTTagNode | ASTSpecialTagNode | ASTLiteralNode): string {
    if (!node) throw new Error(ERRORS.ERR0010);

    // Extract node properties
    const type = node.getNodeType();
    const value = node.value;
    const htmlElement = (node as ASTTagNode | ASTSpecialTagNode).htmlElement;
    const htmlAttributes = (node as ASTTagNode).htmlAttributes;
    const parameters = (node as ASTTagNode).parameters;
    const customCSSClasses = (node as ASTTagNode).customCSSClasses;
    const children = (node as ASTTagNode).children || [];

    let customCSSClassesHTML = "";
    let parametersHTML = "";
    let htmlAttributesHTML = "";

    // Build custom CSS classes string
    if (Array.isArray(customCSSClasses) && customCSSClasses.length > 0) {
      customCSSClassesHTML = ` ${customCSSClasses.join(" ")}`;
    }

    // Build parameter-based CSS classes (for styling based on props)
    if (parameters) {
      for (const paramName in parameters) {
        const paramValue = parameters[paramName];
        parametersHTML += ` texscript-${value}-${paramName.toUpperCase()}-${paramValue.toUpperCase()}`;
      }
    }

    if (htmlAttributes) {
      for (const htmlAttributeName in htmlAttributes) {
        const htmlAttributeValue = htmlAttributes[htmlAttributeName];
        htmlAttributesHTML += ` ${htmlAttributeName}="${htmlAttributeValue}"`;
      }
    }

    // Generate HTML based on node type
    if (type === "TAG") {
      return `<${htmlElement} class="texscript-${value}${customCSSClassesHTML}${parametersHTML}" ${htmlAttributesHTML}>
    ${children
      .filter((c): c is ASTTagNode | ASTSpecialTagNode | ASTLiteralNode => {
        const t = c.getNodeType();
        return t === "TAG" || t === "SPEC_TAG" || t === "LITERAL";
      })
      .map((c) => this.generateHTMLForNode(c))
      .join("")}</${htmlElement}>`;
    } else if (type === "SPEC_TAG") {
      return `<${htmlElement} class="texscript-${value}"/>`;
    } else if (type === "LITERAL") {
      return `${value}`;
    }

    return "";
  }
}

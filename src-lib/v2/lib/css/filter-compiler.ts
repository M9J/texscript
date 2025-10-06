import Metrics from "../benchmark/metrics";

const allowedProperties = [
  "font-size",
  "font-weight",
  "color",
  "font-family",
  "display",
  "flex-direction",
  "justify-content",
  "text-align",
] as const;

type CSSProperty = (typeof allowedProperties)[number];
interface CSSDeclaration {
  property: CSSProperty;
  value: string;
}

interface CSSClassRule {
  selector: string;
  declarations: CSSDeclaration[];
}

interface CSSAST {
  classes: CSSClassRule[];
}

export default class CSSFilterCompiler {
  metricsCSSFilterCompiler: Metrics = new Metrics("CSS Filter Compiler");
  private allowedProperties = allowedProperties;

  compile(rawCSS: string): CSSAST {
    this.metricsCSSFilterCompiler.start();
    const ast: CSSAST = { classes: [] };

    // Match class selectors and their declaration blocks
    const classRegex = /\.([a-zA-Z0-9_-]+)\s*\{([^}]+)\}/g;
    let match: RegExpExecArray | null;

    while ((match = classRegex.exec(rawCSS)) !== null) {
      const selector = `.${match[1]}`;
      const declarationsBlock = match[2];
      const declarations: CSSDeclaration[] = [];

      // Split declarations by semicolon and filter valid properties
      if (declarationsBlock) {
        declarationsBlock.split(";").forEach((decl) => {
          const [propertyRaw, valueRaw] = decl.split(":").map((s) => s.trim());
          if (this.allowedProperties.includes(propertyRaw as CSSProperty)) {
            declarations.push({
              property: propertyRaw as CSSProperty,
              value: valueRaw!,
            });
          }
        });
      }

      if (declarations.length > 0) {
        ast.classes.push({ selector, declarations });
      }
    }

    this.metricsCSSFilterCompiler.end();
    return ast;
  }

  generateFilteredCSSContent(ast: CSSAST): string {
    if (ast) {
      return ast.classes
        .map((rule) => {
          const declarations = rule.declarations
            .map((decl) => `  ${decl.property}: ${decl.value};`)
            .join("\n");
          return `${rule.selector} {\n${declarations}\n}`;
        })
        .join("\n\n");
    } else return "";
  }
}

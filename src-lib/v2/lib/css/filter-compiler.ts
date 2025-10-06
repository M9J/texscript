import Metrics from "../benchmark/metrics";

const allowedProperties = [
  "color",
  "display",
  "flex-direction",
  "font-family",
  "font-size",
  "font-weight",
  "justify-content",
  "padding-left",
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
  imports: string[];
  classes: CSSClassRule[];
}

export default class CSSFilterCompiler {
  metricsCSSFilterCompiler: Metrics = new Metrics("CSS Filter Compiler");
  private allowedProperties = allowedProperties;

  compile(rawCSS: string): CSSAST {
    this.metricsCSSFilterCompiler.start();
    const ast: CSSAST = { classes: [], imports: [] };

    // Match @import statements
    const importRegex = /@import\s+(?:url\()?["']?([^"')]+)["']?\)?\s*;/g;
    let importMatch: RegExpExecArray | null;

    while ((importMatch = importRegex.exec(rawCSS)) !== null) {
      const importUrl = importMatch[1];
      if (typeof importUrl === "string" && importUrl.trim()) {
        ast.imports.push(importUrl.trim());
      }
    }

    // Match one or more selectors followed by a declaration block
    const classRegex = /((?:\.[a-zA-Z0-9_-]+\s*,?\s*)+)\{([^}]+)\}/g;
    let match: RegExpExecArray | null;

    while ((match = classRegex.exec(rawCSS)) !== null) {
      const selectorsRaw = match[1];
      const declarationsBlock = match[2];
      const declarations: CSSDeclaration[] = [];

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

      if (selectorsRaw) {
        const selectors = selectorsRaw.split(",").map((s) => s.trim());
        selectors.forEach((selector) => {
          if (selector.startsWith(".")) {
            ast.classes.push({ selector, declarations: [...declarations] });
          }
        });
      }
    }

    this.metricsCSSFilterCompiler.end();
    return ast;
  }

  generateFilteredCSSContent(ast: CSSAST): string {
    if (!ast) return "";

    const importLines = ast.imports?.map((url) => `@import url("${url}");`) || [];

    const classLines = ast.classes.map((rule) => {
      const declarations = rule.declarations
        .map((decl) => `  ${decl.property}: ${decl.value};`)
        .join("\n");
      return `${rule.selector} {\n${declarations}\n}`;
    });

    return [...importLines, ...classLines].join("\n\n");
  }
}

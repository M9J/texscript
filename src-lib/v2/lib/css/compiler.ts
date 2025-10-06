type CSSProperty = "font-size" | "font-weight" | "color";

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

class CSSCompiler {
  private allowedProperties: CSSProperty[] = ["font-size", "font-weight", "color"];

  compile(rawCSS: string): CSSAST {
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

    return ast;
  }
}

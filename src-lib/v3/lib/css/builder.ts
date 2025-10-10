import Metrics from "../tools/benchmark/metrics";

type CSSProperties = Record<string, string>;
type CSSConfigMap = Record<string, CSSProperties>;

interface CSSBundle {
  classes: CSSConfigMap;
  globalRules: string[];
}

export default class CSSBuilder {
  metricsCSSBuilder: Metrics = new Metrics("CSS Builder");
  CSSConfig: CSSBundle = {
    classes: {},
    globalRules: [],
  };

  addStyle(className: string, property: string, value: string): void {
    if (!this.CSSConfig.classes[className]) {
      this.CSSConfig.classes[className] = {};
    }
    this.CSSConfig.classes[className][property] = value;
  }

  addGlobalRule(rule: string): void {
    this.CSSConfig.globalRules.push(rule);
  }

  buildCSS(): string {
    this.metricsCSSBuilder.start();
    const classCSS = Object.entries(this.CSSConfig.classes)
      .map(([className, styles]) => {
        const styleString = Object.entries(styles)
          .map(([prop, val]) => `${prop}: ${val};`)
          .join(" ");
        return `${className} { ${styleString} }`;
      })
      .join("\n");

    const globalCSS = this.CSSConfig.globalRules.join("\n");
    this.metricsCSSBuilder.end();
    return `${classCSS}\n${globalCSS}`;
  }
}

export function injectCSS(css: string): void {
  const styleTag = document.createElement("style");
  styleTag.textContent = css;
  document.head.appendChild(styleTag);
}

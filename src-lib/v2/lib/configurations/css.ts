import { DEFAULT_CONFIG_PAGE } from "./default";
import { getPageSize } from "./page-size";

type CSSProperties = Record<string, string>;
type CSSConfigMap = Record<string, CSSProperties>;

interface CSSBundle {
  classes: CSSConfigMap;
  globalRules: string[];
}

const CSSConfig: CSSBundle = {
  classes: {},
  globalRules: [],
};

function addStyle(className: string, property: string, value: string): void {
  if (!CSSConfig.classes[className]) {
    CSSConfig.classes[className] = {};
  }
  CSSConfig.classes[className][property] = value;
}

function addGlobalRule(rule: string): void {
  CSSConfig.globalRules.push(rule);
}

function buildCSS(config: CSSBundle): string {
  const classCSS = Object.entries(config.classes)
    .map(([className, styles]) => {
      const styleString = Object.entries(styles)
        .map(([prop, val]) => `${prop}: ${val};`)
        .join(" ");
      return `${className} { ${styleString} }`;
    })
    .join("\n");

  const globalCSS = config.globalRules.join("\n");

  return `${classCSS}\n${globalCSS}`;
}

function injectCSS(css: string): void {
  const styleTag = document.createElement("style");
  styleTag.textContent = css;
  document.head.appendChild(styleTag);
}

export async function loadCSSConfigurations(configurations: Record<string, any>) {
  if (configurations) {
    await setupPageSize(configurations.pageSize);
    await setupPagePadding(configurations.pagePadding);
    await setupLineHeight(configurations.lineHeight);
    const finalConfigCSS = buildCSS(CSSConfig);
    injectCSS(finalConfigCSS);
  }
}

async function setupLineHeight(lineHeight: string = DEFAULT_CONFIG_PAGE.lineHeight) {
  if (lineHeight) addStyle(".texscript-Page", "line-height", lineHeight);
}

async function setupPagePadding(pagePadding: string = DEFAULT_CONFIG_PAGE.pagePadding) {
  if (pagePadding) if (pagePadding) addStyle(".texscript-Page", "padding", pagePadding);
}

async function setupPageSize(pageSize: string = DEFAULT_CONFIG_PAGE.pageSize) {
  if (pageSize) {
    const unit = "in";
    const pageDimensions = getPageSize(pageSize, unit);
    if (pageDimensions && pageDimensions.width && pageDimensions.height) {
      addGlobalRule(`@media print { @page { size: ${pageSize}} }`);
      addStyle(".texscript-Page", "width", pageDimensions.width + unit);
      addStyle(".texscript-Page", "height", pageDimensions.height + unit);
    }
  }
}

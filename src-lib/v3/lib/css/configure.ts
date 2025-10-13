import { DEFAULT_CONFIG_PAGE } from "../tools/configurations/default";
import { getPageSize } from "../tools/configurations/page-size";
import CSSBuilder, { injectCSS } from "./builder";

const cssBuilder = new CSSBuilder();

export async function loadCSSConfigurations(configurations: Record<string, any>) {
  if (configurations) {
    await setupPageSize(configurations.pageSize);
    await setupPagePadding(configurations.pagePadding);
    await setupLineHeight(configurations.lineHeight);
    await setupLetterSpacing(configurations.letterSpacing);
    const configCSS = cssBuilder.buildCSS();
    injectCSS(configCSS);
  }
}

async function setupLetterSpacing(letterSpacing: string = DEFAULT_CONFIG_PAGE.letterSpacing) {
  if (letterSpacing) cssBuilder.addStyle(".texscript-Page", "letter-spacing", letterSpacing);
}

async function setupLineHeight(lineHeight: string = DEFAULT_CONFIG_PAGE.lineHeight) {
  if (lineHeight) cssBuilder.addStyle(".texscript-Page", "line-height", lineHeight);
}

async function setupPagePadding(pagePadding: string = DEFAULT_CONFIG_PAGE.pagePadding) {
  if (pagePadding)
    if (pagePadding) cssBuilder.addStyle(".texscript-PageWrapper", "padding", pagePadding);
}

async function setupPageSize(pageSize: string = DEFAULT_CONFIG_PAGE.pageSize) {
  if (pageSize) {
    const unit = "in";
    const pageDimensions = getPageSize(pageSize, unit);
    if (pageDimensions && pageDimensions.width && pageDimensions.height) {
      cssBuilder.addGlobalRule(`@media print { @page { size: ${pageSize}} }`);
      cssBuilder.addStyle(".texscript-PageWrapper", "width", pageDimensions.width + unit);
      cssBuilder.addStyle(".texscript-PageWrapper", "height", pageDimensions.height + unit);
    }
  }
}

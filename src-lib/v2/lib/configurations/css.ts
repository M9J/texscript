import CSSBuilder, { injectCSS } from "../css/builder";
import { DEFAULT_CONFIG_PAGE } from "./default";
import { getPageSize } from "./page-size";

const cssBuilder = new CSSBuilder();

export async function loadCSSConfigurations(configurations: Record<string, any>) {
  if (configurations) {
    await setupPageSize(configurations.pageSize);
    await setupPagePadding(configurations.pagePadding);
    await setupLineHeight(configurations.lineHeight);
    const finalConfigCSS = cssBuilder.buildCSS();
    injectCSS(finalConfigCSS);
  }
}

async function setupLineHeight(lineHeight: string = DEFAULT_CONFIG_PAGE.lineHeight) {
  if (lineHeight) cssBuilder.addStyle(".texscript-Page", "line-height", lineHeight);
}

async function setupPagePadding(pagePadding: string = DEFAULT_CONFIG_PAGE.pagePadding) {
  if (pagePadding) if (pagePadding) cssBuilder.addStyle(".texscript-Page", "padding", pagePadding);
}

async function setupPageSize(pageSize: string = DEFAULT_CONFIG_PAGE.pageSize) {
  if (pageSize) {
    const unit = "in";
    const pageDimensions = getPageSize(pageSize, unit);
    if (pageDimensions && pageDimensions.width && pageDimensions.height) {
      cssBuilder.addGlobalRule(`@media print { @page { size: ${pageSize}} }`);
      cssBuilder.addStyle(".texscript-Page", "width", pageDimensions.width + unit);
      cssBuilder.addStyle(".texscript-Page", "height", pageDimensions.height + unit);
    }
  }
}

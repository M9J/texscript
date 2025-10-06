import Metrics from "../benchmark/metrics";
import { injectCSS } from "./builder";
import CSSFilterCompiler from "./filter-compiler";

const metricsFileLoader = new Metrics("CSS File Loader");

export async function loadCSSFilesContent(cssFilePaths: string[]) {
  metricsFileLoader.start();
  for (let cssFilePath of cssFilePaths) {
    const cssFileFetchRequest = await fetch(cssFilePath);
    if (cssFileFetchRequest) {
      const cssFileContent = await cssFileFetchRequest.text();
      if (cssFileContent) {
        const cssCompiler = new CSSFilterCompiler();
        const compiledCssAST = cssCompiler.compile(cssFileContent);
        const filteredCSSContent = cssCompiler.generateFilteredCSSContent(compiledCssAST);
        injectCSS(filteredCSSContent);
      }
    }
  }
  metricsFileLoader.end();
}

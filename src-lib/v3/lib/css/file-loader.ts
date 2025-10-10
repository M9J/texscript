import Metrics from "../benchmark/metrics";
import ERRORS from "../constants/errors";
import { injectCSS } from "./builder";
import CSSFilterCompiler from "./filter-compiler";

export async function loadCSSFiles(cssFilePaths: string[]) {
  const metricsFileLoader = new Metrics("CSS File Loader");
  metricsFileLoader.start();
  for (let cssFilePath of cssFilePaths) {
    const cssFileFetchRequest = await fetch(cssFilePath);
    if (cssFileFetchRequest.status === 404) throw new Error(ERRORS.ERR0022 + ": " + cssFilePath);
    const cssFileContent = await cssFileFetchRequest.text();
    if (cssFileContent) {
      const cssCompiler = new CSSFilterCompiler();
      const compiledCssAST = cssCompiler.compile(cssFileContent);
      const compiledOutput = cssCompiler.generateFilteredCSSContent(compiledCssAST);
      injectCSS(compiledOutput);
    }
  }
  metricsFileLoader.end();
}

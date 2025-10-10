import Metrics from "../tools/benchmark/metrics";
import ERRORS from "../constants/errors";
import { injectCSS } from "./builder";
import CSSFilterCompiler from "./filter-compiler";

export async function loadCSSFiles(cssFilePaths: string[]) {
  const metricsFileLoader = new Metrics("CSS File Loader");
  metricsFileLoader.start();
  const fetchedFiles: string[] = [];
  for (let cssFilePath of cssFilePaths) {
    if (!fetchedFiles.includes(cssFilePath)) {
      const cssFileFetchRequest = await fetch(cssFilePath);
      if (cssFileFetchRequest.status === 404) throw new Error(ERRORS.ERR0022 + ": " + cssFilePath);
      const cssFileContent = await cssFileFetchRequest.text();
      if (cssFileContent) {
        const cssCompiler = new CSSFilterCompiler();
        const compiledCssAST = cssCompiler.compile(cssFileContent);
        const compiledOutput = cssCompiler.generateFilteredCSSContent(compiledCssAST);
        injectCSS(compiledOutput);
        fetchedFiles.push(cssFilePath);
      }
    }
  }
  metricsFileLoader.end();
}

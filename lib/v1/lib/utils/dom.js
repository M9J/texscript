import { updateSplashStatus } from "../../splash.js";
import ERRORS from "../constants/errors.js";

export async function findCodeFromDOM() {
  try {
    const customSources = [];
    const scriptElem = document.querySelectorAll('script[type="text/texscript"]');
    if (!scriptElem) throw new Error(ERRORS.ERR0003);
    const hasMultipleScriptsTags = scriptElem.length > 1;
    if (hasMultipleScriptsTags) {
      for (const scriptTag of scriptElem) {
        const code = await findCodeFromScriptTag(scriptTag);
        if (code) customSources.push(code);
      }
    } else {
      const code = await findCodeFromScriptTag(scriptElem[0]);
      if (code) customSources.push(code);
    }
    const hasCustomSources = customSources.length > 0;
    if (!hasCustomSources) throw new Error(ERRORS.ERR0014);
    return customSources.join("\n");
  } catch (e) {
    updateSplashStatus(e, "error");
    console.log(e);
  }
}

async function findCodeFromScriptTag(scriptTag) {
  if (!scriptTag) throw new Error(ERRORS.ERR0016);
  const inlineCode = scriptTag ? scriptTag.innerText : null;
  const scriptSrc = scriptTag ? scriptTag.getAttribute("src") : null;
  if (!inlineCode && !scriptSrc) throw new Error(ERRORS.ERR0020);
  let cleanedInlineCode = null;
  let cleanedExternalCode = null;
  if (inlineCode) {
    cleanedInlineCode = inlineCode.trim();
    if (!cleanedInlineCode) throw new Error(ERRORS.ERR0014);
  }
  if (scriptSrc) {
    const sourceFile = await fetch(scriptSrc);
    if (sourceFile) {
      const sourceFileAsText = await sourceFile.text();
      cleanedExternalCode = sourceFileAsText.trim();
      if (!cleanedExternalCode) throw new Error(ERRORS.ERR0014);
    }
  }
  if (cleanedInlineCode && cleanedExternalCode) {
    return cleanedInlineCode + "\n" + cleanedExternalCode;
  } else if (cleanedInlineCode) {
    return cleanedInlineCode;
  } else if (cleanedExternalCode) {
    return cleanedExternalCode;
  }
}

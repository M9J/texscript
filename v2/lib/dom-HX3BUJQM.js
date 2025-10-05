import {
  errors_default
} from "./chunk-AN3GKGAC.js";
import {
  updateSplashStatus
} from "./chunk-RRXX54FP.js";
import "./chunk-77J4NURK.js";

// src-lib/v2/lib/utils/dom.ts
async function findCodeFromDOM() {
  try {
    const customSources = [];
    const scriptElem = document.querySelectorAll(
      'script[type="text/texscript"]'
    );
    if (!scriptElem) throw new Error(errors_default.ERR0003);
    const hasMultipleScriptsTags = scriptElem.length > 1;
    if (hasMultipleScriptsTags) {
      for (const scriptTag of Array.from(scriptElem)) {
        const code = await findCodeFromScriptTag(scriptTag);
        if (code) customSources.push(code);
      }
    } else {
      const firstScriptTag = scriptElem[0];
      if (firstScriptTag) {
        const code = await findCodeFromScriptTag(firstScriptTag);
        if (code) customSources.push(code);
      }
    }
    const hasCustomSources = customSources.length > 0;
    if (!hasCustomSources) throw new Error(errors_default.ERR0014);
    return customSources.join("\n");
  } catch (e) {
    updateSplashStatus(e, "error");
    console.log(e);
  }
}
async function findCodeFromScriptTag(scriptTag) {
  var _a;
  if (!scriptTag) throw new Error(errors_default.ERR0016);
  const inlineCode = (_a = scriptTag.innerText) != null ? _a : null;
  const scriptSrc = scriptTag.getAttribute("src");
  if (!inlineCode && !scriptSrc) throw new Error(errors_default.ERR0020);
  let cleanedInlineCode = null;
  let cleanedExternalCode = null;
  if (inlineCode) {
    cleanedInlineCode = inlineCode.trim();
    if (!cleanedInlineCode) throw new Error(errors_default.ERR0014);
  }
  if (scriptSrc) {
    const sourceFile = await fetch(scriptSrc);
    const sourceFileAsText = await sourceFile.text();
    cleanedExternalCode = sourceFileAsText.trim();
    if (!cleanedExternalCode) throw new Error(errors_default.ERR0014);
  }
  if (cleanedInlineCode && cleanedExternalCode) {
    return `${cleanedInlineCode}
${cleanedExternalCode}`;
  } else if (cleanedInlineCode) {
    return cleanedInlineCode;
  } else if (cleanedExternalCode) {
    return cleanedExternalCode;
  }
  return void 0;
}
export {
  findCodeFromDOM
};

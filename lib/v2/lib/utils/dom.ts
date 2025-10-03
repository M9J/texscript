import { updateSplashStatus } from "../../splash";
import ERRORS from "../constants/errors.js";

export async function findCodeFromDOM(): Promise<string | void> {
  try {
    const customSources: string[] = [];
    const scriptElem = document.querySelectorAll<HTMLScriptElement>(
      'script[type="text/texscript"]'
    );
    if (!scriptElem) throw new Error(ERRORS.ERR0003);
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
    if (!hasCustomSources) throw new Error(ERRORS.ERR0014);
    return customSources.join("\n");
  } catch (e: unknown) {
    updateSplashStatus(e, "error");
    console.log(e);
  }
}

async function findCodeFromScriptTag(scriptTag: HTMLScriptElement): Promise<string | undefined> {
  if (!scriptTag) throw new Error(ERRORS.ERR0016);

  const inlineCode: string | null = scriptTag.innerText ?? null;
  const scriptSrc: string | null = scriptTag.getAttribute("src");

  if (!inlineCode && !scriptSrc) throw new Error(ERRORS.ERR0020);

  let cleanedInlineCode: string | null = null;
  let cleanedExternalCode: string | null = null;

  if (inlineCode) {
    cleanedInlineCode = inlineCode.trim();
    if (!cleanedInlineCode) throw new Error(ERRORS.ERR0014);
  }

  if (scriptSrc) {
    const sourceFile: Response = await fetch(scriptSrc);
    const sourceFileAsText: string = await sourceFile.text();
    cleanedExternalCode = sourceFileAsText.trim();
    if (!cleanedExternalCode) throw new Error(ERRORS.ERR0014);
  }

  if (cleanedInlineCode && cleanedExternalCode) {
    return `${cleanedInlineCode}\n${cleanedExternalCode}`;
  } else if (cleanedInlineCode) {
    return cleanedInlineCode;
  } else if (cleanedExternalCode) {
    return cleanedExternalCode;
  }

  return undefined;
}

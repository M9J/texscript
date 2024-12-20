import ERRORS from "../constants/errors.js";

export function findCodeFromDOM() {
  const scriptElem = document.querySelectorAll('script[type="text/texscript"]');
  if (!scriptElem) throw new Error(ERRORS.ERR0003);
  const script = scriptElem ? scriptElem[0] : null;
  if (!script) throw new Error(ERRORS.ERR0016);
  const rawCode = script ? script.innerText : null;
  if (!rawCode) throw new Error(ERRORS.ERR0015);
  const cleanedRawCode = rawCode.trim();
  if (!cleanedRawCode) throw new Error(ERRORS.ERR0014);
  return cleanedRawCode;
}
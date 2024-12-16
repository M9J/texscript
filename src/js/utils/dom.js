import ERRORS from "../constants/errors.js";

export function findCodeFromDOM() {
  const scriptElem = document.querySelectorAll('script[type="text/texscript"]');
  if (!scriptElem) throw new Error(ERRORS.ERR0003);
  const script = scriptElem ? scriptElem[0] : null;
  return script ? script.innerText : null;
}

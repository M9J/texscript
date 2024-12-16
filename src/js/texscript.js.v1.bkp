import Compiler from "./core/compiler.js";
import ERRORS from "./constants/errors.js";
import { findCodeFromDOM } from "./utils/dom.js";
import { appendTexscriptStyles } from "./utils/styles.js";

appendTexscriptStyles();

const rawCode = findCodeFromDOM();
if (!rawCode) throw new Error(ERRORS.ERR0001);
const compiler = new Compiler();
compiler.compile(rawCode);
document.body.innerHTML = compiler.generateCodeFor("HTML");

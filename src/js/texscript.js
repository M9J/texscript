import Compiler from "./core/compiler.js";
import ERRORS from "./constants/errors.js";
import { findCodeFromDOM } from "./utils/dom.js";
import { appendStyles } from "./utils/styles.js";

appendStyles();
const rawCode = findCodeFromDOM();
if (!rawCode) throw new Error(ERRORS.ERR0001);
const texscriptCompiler = new Compiler();
texscriptCompiler.compile(rawCode);
document.body.innerHTML = texscriptCompiler.generateCodeFor("HTML");


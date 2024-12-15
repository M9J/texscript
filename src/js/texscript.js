import Compiler from "./core/compiler.js";
import { setup } from "./utils/setup.js";

setup();
const texscriptCompiledHTML = new Compiler().compile();
// console.log("texscriptCompiledHTML", texscriptCompiledHTML);
const existingBodyHTML = document.body.innerHTML;
// console.log("bodyHTML", existingBodyHTML);
const newBodyHTML = existingBodyHTML + texscriptCompiledHTML;
document.body.innerHTML = newBodyHTML;

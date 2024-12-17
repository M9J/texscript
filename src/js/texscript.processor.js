import { updateSplashStatus } from "./texscript.splash.js";

export async function process(compiler, rawCode, callbackFn) {
  try {
    compiler.compile(rawCode);
    const htmlCode = compiler.generateCodeFor("HTML");
    document.body.innerHTML = htmlCode;
    if (callbackFn) callbackFn();
    console.log("Compiler", compiler.toString());
  } catch (e) {
    updateSplashStatus(e, "error");
    console.log(e);
  }
}

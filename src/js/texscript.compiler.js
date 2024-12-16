export async function compile(compilerInstance, rawCode) {
  compilerInstance.compile(rawCode);
  document.body.innerHTML = compilerInstance.generateCodeFor("HTML");
}

import { TModule, TRunnerModule } from "../types";

export class Runner {
  private _modulesRegistry: Record<string, TRunnerModule> = {};

  addModule(module: TModule) {
    if (!module) throw new Error(`'module' not provided`);
    this._modulesRegistry[module.uuid] = {
      moduleUUID: module.uuid,
      moduleFunction: module.fn,
      moduleInput: null,
      moduleOutput: null,
      prevModuleUUID: "",
      nextModuleUUID: "",
    };
  }

  run() {
    if (Object.keys(this._modulesRegistry).length < 1) throw new Error(`No modules to run`);
    for (let moduleUUID in this._modulesRegistry) {
      const module = this._modulesRegistry[moduleUUID];
      console.log("module", moduleUUID, module);
    }
  }
}

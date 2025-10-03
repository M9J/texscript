export type TRunnerModule = {
  moduleUUID: string;
  moduleFunction: Function;
  moduleInput: any;
  moduleOutput: any;
  prevModuleUUID: string;
  nextModuleUUID: string;
};

export { };

declare global {
  interface Window {
    TexscriptCompiler: {
      version: string;
      repoURL: string;
      lastCompilation: Map<string, unknown>;
      toggleSplashStatus: Function;
    };
  }
}

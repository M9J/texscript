


export {};


declare global {
  
  interface Window {
    
    __texscript_loaded__: boolean;

    
    TexscriptCompiler: {
      
      version: string;

      
      repoURL: string;

      
      lastCompilation: Map<string, unknown>;
    };
  }
}

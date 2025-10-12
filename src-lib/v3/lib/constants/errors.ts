const ERRORS: Record<string, string> = {
  ERR0001: `Unable to find the raw code to be compiled`,

  ERR0002: `'rawCode' not provided`,

  ERR0003: `Make sure the code is wrapped in &lt;script type="text/texscript">...&lt;/script&gt;`,

  ERR0004: `'codeLOC' not provided`,

  ERR0005: `'rule' not provided`,

  ERR0006: `'matches' not provided`,

  ERR0007: `'tokens' not provided`,

  ERR0008: `token.type is null`,

  ERR0009: `'ast' is not provided`,

  ERR0010: `'node' is not provided`,

  ERR0011: `'lang' is not provided`,

  ERR0012: `Code generator for mentioned language is not provided`,

  ERR0013: `'metricsName' not provided`,

  ERR0014: `Unable to find any code written in Texscript`,

  ERR0015: `Not able to find any Texscript code inside &lt;script&gt; element`,

  ERR0016: `&lt;script&gt; element not found`,

  ERR0017: `Compilation failed`,

  ERR0018: `Dependency not found`,

  ERR0019: `Unable to find any Texscript source URL inside &lt;script&gt; element`,

  ERR0020: `Texscript code should be provided inside &lt;script type="text/texscript">...&lt;/script&gt; or as URL using &lt;script src="file.txs" type="text/texscript">&lt;/script&gt;`,

  ERR0021: `External Texscript source code not found`,

  ERR0022: `External CSS file not found`,

  ERR0023: `'characterStream' not provided`,

  ERR0024: `Missing closing round bracket`,
  
  ERR0025: `Missing closing square bracket`,

  ERR0026: `Syntax is wrong. Kindly recheck your code`,

  ERR0027: `Missing opening round bracket`,
  
  ERR0028: `Missing opening square bracket`,
};

export default ERRORS;

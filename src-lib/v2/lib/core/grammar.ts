const MetaTokensBasic: Record<string, RegExp> = {
  KEYWORD: /(^[A-Z][a-z]*)/,
  STRING: /"(.*)"$|(\\\"(.*)\\\"$)/,
};

const MetaTokensExtended: Record<string, RegExp> = {
  CSS_CLASS: /\.([a-z]+[a-zA-Z]*)/,
  EXTERNAL_REFERENCE: /(@[A-Z][a-zA-Z]*:\s".*")/,
  PARAMETERS: /(\([\s*\w+:\s*\w+,*\s*]*\))/,
};

const MetaTokensPunctuation: Record<string, RegExp> = {
  BRACKET_SQUARE_CLOSE: /(\])/,
  BRACKET_SQUARE_OPEN: /(\[)/,
  COLON: /(:)/,
  SPACE: /(\s)/,
};

const MetaTokensSpecial: Record<string, RegExp> = {
  BR: /(::)/,
  HR: /(--)/,
};

const META_TOKENS: Record<string, RegExp> = {
  ...MetaTokensBasic,
  ...MetaTokensExtended,
  ...MetaTokensPunctuation,
  ...MetaTokensSpecial,
};

const GRAMMAR_RULES: string[] = [
  "BR",
  "BRACKET_SQUARE_CLOSE",
  "HR",
  "KEYWORD|COLON|SPACE|STRING",
  "KEYWORD|CSS_CLASS|COLON|SPACE|STRING",
  "KEYWORD|CSS_CLASS|SPACE|BRACKET_SQUARE_OPEN",
  "KEYWORD|CSS_CLASS|SPACE|PARAMETERS|COLON|SPACE|STRING",
  "KEYWORD|CSS_CLASS|SPACE|PARAMETERS|SPACE|BRACKET_SQUARE_OPEN",
  "KEYWORD|SPACE|BRACKET_SQUARE_OPEN",
  "KEYWORD|SPACE|PARAMETERS|COLON|SPACE|STRING",
  "KEYWORD|SPACE|PARAMETERS|SPACE|BRACKET_SQUARE_OPEN",
  "STRING",
  "EXTERNAL_REFERENCE",
];

function convertRulesToGrammar(
  grammarRules: string[],
  metaTokens: Record<string, RegExp>
): Map<string, RegExp> {
  const grammar = new Map<string, RegExp>();
  for (const grammarRule of grammarRules) {
    const patterns = grammarRule.split("|").map((token) => {
      const regex = metaTokens[token];
      if (!regex) {
        throw new Error(`Unknown token: ${token}`);
      }
      return regex.source;
    });
    const grammarRegex = new RegExp(patterns.join(""));
    grammar.set(grammarRule, grammarRegex);
  }
  return grammar;
}

export default convertRulesToGrammar(GRAMMAR_RULES, META_TOKENS);

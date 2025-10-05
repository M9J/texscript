const MetaTokensBasic = {
  KEYWORD: /(^[A-Z][a-z]*)/,
  STRING: /\"(.*)\"$|(\\\"(.*)\\\"$)/,
};

const MetaTokensExtended = {
  CSS_CLASS: /\.([a-z]+[a-zA-Z]*)/,
  EXTERNAL_REFERENCE: /(\@[A-Z][a-zA-Z]*\:\s\".*\")/,
  PARAMETERS: /(\([\s*\w+\:\s*\w+\,*\s*]*\))/,
};

const MetaTokensPunctuation = {
  BRACKET_SQUARE_CLOSE: /(\])/,
  BRACKET_SQUARE_OPEN: /(\[)/,
  COLON: /(\:)/,
  SPACE: /(\s)/,
};

const MetaTokensSpecial = {
  BR: /(\:\:)/,
  HR: /(\-\-)/,
};

const META_TOKENS = {
  ...MetaTokensBasic,
  ...MetaTokensExtended,
  ...MetaTokensPunctuation,
  ...MetaTokensSpecial,
};

const GRAMMAR_RULES = [
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

function convertRulesToGrammar(grammarRules, metaTokens) {
  const grammar = new Map();
  for (const grammarRule of grammarRules) {
    const patterns = grammarRule.split("|").map((token) => metaTokens[token].source);
    const grammarRegex = new RegExp(patterns.join(""));
    grammar.set(grammarRule, grammarRegex);
  }
  return grammar;
}

export default convertRulesToGrammar(GRAMMAR_RULES, META_TOKENS);

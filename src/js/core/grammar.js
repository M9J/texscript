const MetaTokensBasic = {
  KEYWORD: /(^[A-Z][a-z]*)/,
  STRING: /\"(.*)\"$|(\\\"(.*)\\\"$)/,
};

const MetaTokensExtended = {
  BR: /(\:\:)/,
  BRACKET_SQUARE_CLOSE: /(\])/,
  BRACKET_SQUARE_OPEN: /(\[)/,
  COLON: /(\:)/,
  CSS_CLASS: /\.([a-z]+[a-zA-Z]*)/,
  PARAMETERS: /(\([a-z]*[A-Z]*\:\s[a-zA-Z0-9]*\))/,
  HR: /(\-\-)/,
  SPACE: /(\s)/,
};

const META_TOKENS = { ...MetaTokensBasic, ...MetaTokensExtended };

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
];

function convertRulesToGrammar(grammarRules, metaTokens) {
  const grammar = new Map();
  grammarRules.forEach((grammarRule) => {
    const patterns = grammarRule.split("|").map((token) => metaTokens[token].source);
    const grammarRegex = new RegExp(patterns.join(""));
    grammar.set(grammarRule, grammarRegex);
  });
  return grammar;
}

export default convertRulesToGrammar(GRAMMAR_RULES, META_TOKENS);
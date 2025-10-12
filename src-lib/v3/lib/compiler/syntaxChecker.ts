import ERRORS from "../constants/errors";
import Metrics from "../tools/benchmark/metrics";
import Stack from "./core/stack";
import { Token, TokenType } from "./types/token";

export default class SyntaxChecker {
  private metrics: Metrics = new Metrics("Syntax Checker");
  private tokens: Token[] = [];

  constructor(tokens: Token[]) {
    if (!tokens) throw new Error(ERRORS.ERR0007);
    this.tokens = tokens;
  }

  checkSyntax(): boolean {
    let isSyntaxFine = false;
    this.metrics.start();
    isSyntaxFine = this.checkBracketsBalance();
    this.metrics.end();
    return isSyntaxFine;
  }

  private checkBracketsBalance(): boolean {
    const bracketStack = new Stack<string>();
    for (let token of this.tokens) {
      if (token.type === TokenType.BRACKET_ROUND_OPEN) {
        bracketStack.push(token.value);
      } else if (token.type === TokenType.BRACKET_ROUND_CLOSE) {
        if (bracketStack.peek() === "(") bracketStack.pop();
        else throw new Error(`Unmatched ) after Ln ${token.line}, Col ${token.column}`);
      } else if (token.type === TokenType.BRACKET_SQUARE_OPEN) {
        bracketStack.push(token.value);
      } else if (token.type === TokenType.BRACKET_SQUARE_CLOSE) {
        if (bracketStack.peek() === "[") bracketStack.pop();
        else throw new Error(`Unmatched ] after Ln ${token.line}, Col ${token.column}`);
      }
    }
    return true;
  }

  // private checkBracketsBalance(): boolean {
  //   const bracketRoundOpenStack = new Stack<Token>();
  //   const bracketRoundCloseStack = new Stack<Token>();
  //   const bracketSquareOpenStack = new Stack<Token>();
  //   const bracketSquareCloseStack = new Stack<Token>();
  //   for (let token of this.tokens) {
  //     if (token.type === TokenType.BRACKET_ROUND_OPEN) bracketRoundOpenStack.push(token);
  //     else if (token.type === TokenType.BRACKET_ROUND_CLOSE) bracketRoundCloseStack.push(token);
  //     else if (token.type === TokenType.BRACKET_SQUARE_OPEN) bracketSquareOpenStack.push(token);
  //     else if (token.type === TokenType.BRACKET_SQUARE_CLOSE) bracketSquareCloseStack.push(token);
  //     else continue;
  //   }

  //   const isBracketRoundOpenMissing = bracketRoundOpenStack.size < bracketRoundCloseStack.size;
  //   const isBracketRoundCloseMissing = bracketRoundOpenStack.size > bracketRoundCloseStack.size;
  //   const isBracketSquareOpenMissing = bracketSquareOpenStack.size < bracketSquareCloseStack.size;
  //   const isBracketSquareCloseMissing = bracketSquareOpenStack.size > bracketSquareCloseStack.size;
  //   if (isBracketRoundOpenMissing) throw new Error(ERRORS.ERR0027);
  //   else if (isBracketRoundCloseMissing) throw new Error(ERRORS.ERR0024);
  //   else if (isBracketSquareOpenMissing) throw new Error(ERRORS.ERR0028);
  //   else if (isBracketSquareCloseMissing) throw new Error(ERRORS.ERR0025);
  //   return true;
  // }
}

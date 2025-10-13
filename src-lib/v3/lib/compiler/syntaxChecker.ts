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

}

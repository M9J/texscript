import ERRORS from "../constants/errors";
import Metrics from "../tools/benchmark/metrics";
import { Token, TokenType } from "./types/token";

export default class LexicalAnalyser {
  private metrics = new Metrics("PrePrecessor");
  private characterStream: string[] = [];

  constructor(characterStream: string[]) {
    if (!characterStream) throw new Error(ERRORS.ERR0023);
    this.characterStream = characterStream;
  }

  lexicalAnalysis(): { locCount: number; tokens: Token[] } {
    this.metrics.start();
    const tokens: Token[] = [];
    let locCount: number = 0;
    let state = State.Start;
    let buffer = "";
    let streamLength = this.characterStream.length;
    let line = 1;
    let column = 1;
    const getColumn = () => column - buffer.length;
    for (let i = 0; i < streamLength + 1; i++, column++) {
      const ch: string = this.characterStream[i] || "";
      switch (state) {
        case State.Start: {
          if (isSpace(ch) || isTab(ch)) continue;
          else if (isNewLine(ch)) {
            locCount++;
            line++;
            column = 1;
            continue;
          } else if (isBracketRoundClose(ch)) {
            state = State.BracketRoundClose;
            i--;
            column--;
          } else if (isBracketRoundOpen(ch)) state = State.BracketRoundOpen;
          else if (isBracketSquareClose(ch)) {
            state = State.BracketSquareClose;
            i--;
            column--;
          } else if (isBracketSquareOpen(ch)) state = State.BracketSquareOpen;
          else if (isColon(ch)) state = State.Colon;
          else if (isComma(ch)) state = State.Comma;
          else if (isDollar(ch)) state = State.Constant;
          else if (isAtrate(ch)) state = State.Declaration;
          else if (isForwardSlash(ch)) {
            state = State.DecoratorComponent;
          } else if (isDot(ch)) state = State.Dot;
          else if (isLowerCase(ch)) {
            state = State.Identifier;
            i--;
            column--;
          } else if (isDigit(ch)) state = State.Integer;
          else if (isUpperCase(ch)) {
            state = State.Keyword;
            i--;
            column--;
          } else if (isQuote(ch)) state = State.String;
          else if (isEmpty(ch)) state = State.End;
          else state = State.Error;
          break;
        }

        case State.BracketRoundClose: {
          tokens.push({
            type: TokenType.BRACKET_ROUND_CLOSE,
            value: ")",
            line,
            column: getColumn(),
          });
          state = State.Start;
          break;
        }

        case State.BracketRoundOpen: {
          tokens.push({
            type: TokenType.BRACKET_ROUND_OPEN,
            value: "(",
            line,
            column: getColumn(),
          });
          state = State.Start;
          i--;
          column--;
          break;
        }

        case State.BracketSquareClose: {
          tokens.push({
            type: TokenType.BRACKET_SQUARE_CLOSE,
            value: "]",
            line,
            column: getColumn(),
          });
          state = State.Start;
          break;
        }

        case State.BracketSquareOpen: {
          tokens.push({
            type: TokenType.BRACKET_SQUARE_OPEN,
            value: "[",
            line,
            column: getColumn(),
          });
          state = State.Start;
          i--;
          column--;
          break;
        }

        case State.Colon: {
          tokens.push({ type: TokenType.COLON, value: ":", line, column: getColumn() });
          state = State.Start;
          i--;
          column--;
          break;
        }

        case State.Comma: {
          tokens.push({ type: TokenType.COMMA, value: ",", line, column: getColumn() });
          state = State.Start;
          break;
        }

        case State.Constant: {
          if (isSpace(ch) || isBracketRoundClose(ch) || isNewLine(ch) || isComma(ch)) {
            tokens.push({ type: TokenType.CONSTANT, value: buffer, line, column: getColumn() });
            buffer = "";
            state = State.Start;
            i--;
            column--;
          } else buffer += ch;
          break;
        }

        case State.Declaration: {
          if (isSpace(ch)) {
            tokens.push({ type: TokenType.DECLARATION, value: buffer, line, column: getColumn() });
            buffer = "";
            state = State.Start;
          } else buffer += ch;
          break;
        }

        case State.DecoratorComponent: {
          if (isForwardSlash(ch)) {
            tokens.push({ type: TokenType.DECORATOR, value: buffer, line, column: getColumn() });
            buffer = "";
            state = State.Start;
          } else buffer += ch;
          break;
        }

        case State.Dot: {
          tokens.push({ type: TokenType.DOT, value: ".", line, column: getColumn() });
          state = State.Start;
          i--;
          column--;
          break;
        }

        case State.End: {
          buffer = "";
          state = State.End;
          break;
        }

        case State.Error: {
          throw new Error(`Error happened during lexical analysis`);
        }

        case State.Identifier: {
          if (isSpace(ch) || isColon(ch) || isBracketSquareOpen(ch) || isBracketRoundClose(ch)) {
            tokens.push({ type: TokenType.IDENTIFIER, value: buffer, line, column: getColumn() });
            buffer = "";
            state = State.Start;
            i--;
            column--;
          } else buffer += ch;
          break;
        }

        case State.Integer: {
          buffer += ch;
          if (isSpace(ch)) {
            tokens.push({ type: TokenType.INTEGER, value: buffer, line, column: getColumn() });
            buffer = "";
            state = State.Start;
          }
          break;
        }

        case State.Keyword: {
          if (isSpace(ch) || isColon(ch) || isDot(ch) || isNewLine(ch) || isBracketSquareOpen(ch)) {
            tokens.push({ type: TokenType.KEYWORD, value: buffer, line, column: getColumn() });
            buffer = "";
            state = State.Start;
            i--;
            column--;
          } else buffer += ch;
          break;
        }

        case State.String: {
          if (isQuote(ch)) {
            tokens.push({ type: TokenType.STRING, value: buffer, line, column: getColumn() });
            buffer = "";
            state = State.Start;
          } else buffer += ch;
          break;
        }
      }
    }

    if (tokens.length && !locCount) ++locCount;

    this.metrics.end();

    return { tokens, locCount };
  }
}

enum State {
  Start,
  BracketRoundClose,
  BracketRoundOpen,
  BracketSquareClose,
  BracketSquareOpen,
  Colon,
  Comma,
  Identifier,
  Keyword,
  Constant,
  Declaration,
  DecoratorComponent,
  Dot,
  Integer,
  String,
  End,
  Error,
}

function isDigit(ch: string) {
  return /^[0-9]$/.test(ch);
}

function isUpperCase(ch: string) {
  return /^[A-Z]$/.test(ch);
}

function isLowerCase(ch: string) {
  return /^[a-z]$/.test(ch);
}

function isSpace(ch: string) {
  return /^ $/.test(ch);
}

function isTab(ch: string) {
  return /^\t$/.test(ch);
}

function isBracketRoundOpen(ch: string) {
  return /^\($/.test(ch);
}

function isBracketRoundClose(ch: string) {
  return /^\)$/.test(ch);
}

function isBracketSquareOpen(ch: string) {
  return /^\[$/.test(ch);
}

function isBracketSquareClose(ch: string) {
  return /^\]$/.test(ch);
}

function isColon(ch: string) {
  return /^\:$/.test(ch);
}

function isComma(ch: string) {
  return /^\,$/.test(ch);
}

function isDollar(ch: string) {
  return /^\$$/.test(ch);
}

function isAtrate(ch: string) {
  return /^\@$/.test(ch);
}

function isForwardSlash(ch: string) {
  return /^\/$/.test(ch);
}

function isDot(ch: string) {
  return /^\.$/.test(ch);
}

function isQuote(ch: string) {
  return /^\"$/.test(ch);
}

function isEmpty(ch: string) {
  return /^$/.test(ch);
}

function isNewLine(ch: string) {
  return /^\n$/.test(ch);
}

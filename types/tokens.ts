export enum TokenType {
	// KEYWORDS
	Function,
	While,
	If,
	Else,
	Do,
	For,
	Return,
	Break,

  // LITERALS
  Identifier,
  String,
  Boolean,
  Number,
  Nil,

	// Grouping * Operators
	Plus, // +
	Minus, // -
	Multiply, // *
	Divide, // /
	Equals, // ==
	NotEqual, // ~=
	OpenBracket, // [
  CloseBracket, // ]
	LessThan, // <
	GreaterThan, // >
	LessThanOrEqual, // <=
	GreaterThanOrEqual, // >=
  Or,
  And,
  Not,

	Semicolon, // ;

	EOF, // End of File

	OpenParen, // (
	CloseParen, // )
}

/**
 * Constant lookup for keywords and known identifiers + symbols.
 */
export const KEYWORDS: Record<string, TokenType> = {
  function: TokenType.Function,
  while: TokenType.While,
	if: TokenType.If,
	else: TokenType.Else,
	do: TokenType.Do,
	for: TokenType.For,
	return: TokenType.Return,
}

// Reoresents a single token from the source-code.
export interface Token {
	value: string; // contains the raw value as seen inside the source code.
	type: TokenType; // tagged structure.
}

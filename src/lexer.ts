import { Token, TokenType, KEYWORDS } from "../types/tokens";
import { token, isalpha, isskippable, isNumber } from "../utils/tokens";

export function tokenize(sourceCode: string): Token[] {
	const tokens = new Array<Token>();
	const src = sourceCode.split("");


	while (src.length > 0) {

		if (src[0] === "(") {
			tokens.push(token(src.shift(), TokenType.OpenParen));
		} else if (src[0] === ")") {
			tokens.push(token(src.shift(), TokenType.CloseParen));
		} else if (src[0] === "[") {
			tokens.push(token(src.shift(), TokenType.OpenBracket));
		} else if (src[0] === "]") {
			tokens.push(token(src.shift(), TokenType.CloseBracket));
		} else if (src[0] === "+") {
			tokens.push(token(src.shift(), TokenType.Plus));
		} else if (src[0] === "-") {
			tokens.push(token(src.shift(), TokenType.Minus));
		} else if (src[0] === "*") {
			tokens.push(token(src.shift(), TokenType.Multiply));
		} else if (src[0] === "/") {
			tokens.push(token(src.shift(), TokenType.Divide));
		} else if (src[0] === ";") {
			tokens.push(token(src.shift(), TokenType.Semicolon));
		}

		else if (src[0] === "=" && src[1] === "=") {
			tokens.push(token("==", TokenType.Equals));
			src.shift();
			src.shift();
		} else if (src[0] === "~" && src[1] === "=") {
			tokens.push(token("~=", TokenType.NotEqual));
			src.shift();
			src.shift();
		} else if (src[0] === "<" && src[1] === "=") {
			tokens.push(token("<=", TokenType.LessThanOrEqual));
			src.shift();
			src.shift();
		} else if (src[0] === ">" && src[1] === "=") {
			tokens.push(token(">=", TokenType.GreaterThanOrEqual));
			src.shift();
			src.shift();
		} else if (src[0] === "<") {
			tokens.push(token(src.shift(), TokenType.LessThan));
		} else if (src[0] === ">") {
			tokens.push(token(src.shift(), TokenType.GreaterThan));
		}

		else if (isskippable(src[0])) {
			src.shift();
		}

		else if (/[0-9]/.test(src[0])) {
			let num = "";
			while (src.length > 0 && (/[0-9]/.test(src[0]) || src[0] === ".")) {
				num += src.shift();
			}
			tokens.push(token(num, TokenType.Number));
		}

		else if (isalpha(src[0])) {
			let ident = "";
			while (src.length > 0 && (isalpha(src[0]) || /[0-9]/.test(src[0]))) {
				ident += src.shift();
			}

			const reserved = KEYWORDS[ident];
			if (reserved) {
				tokens.push(token(ident, reserved));
			} else {
				tokens.push(token(ident, TokenType.Identifier));
			}
		}

		else if (src[0] === '"') {
			src.shift();
			let str = "";
			while (src.length > 0 && src[0] !== '"') {
				str += src.shift();
			}
			if (src.length > 0) {
				src.shift();
				tokens.push(token(str, TokenType.String));
			} else {
				throw new Error("Unterminated string literal");
			}
		}
		else {
			throw new Error(`Unrecognized character found in source: ${src[0]}`);
		}
	}

	tokens.push(token("EndOfFile", TokenType.EOF));
	return tokens;
}

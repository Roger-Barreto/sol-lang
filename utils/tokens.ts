import { Token, TokenType } from "../types/tokens";

/**
 * Returns whether the character passed in alphabetic -> [a-zA-Z]
 */
export function isalpha(src: string) {
	return src.toUpperCase() != src.toLowerCase();
}

/**
 * Returns true if the character is whitespace like -> [\s, \t, \n]
 */
export function isskippable(str: string) {
	return str == " " || str == "\n" || str == "\t";
}

/**
 Return whether the character is a valid integer -> [0-9]
 */
export function isNumber(str: string) {
	// Check if string is a valid number (integer or float)
	const num = str.trim();

	// Handle negative numbers
	if (num.startsWith('-')) {
		return isNumber(num.slice(1));
	}

	// Check for float with decimal point
	if (num.includes('.')) {
		const parts = num.split('.');
		if (parts.length !== 2) return false;
		return parts[0].split('').every(c => /[0-9]/.test(c)) &&
			   parts[1].split('').every(c => /[0-9]/.test(c));
	}

	// Check for integer
	return num.split('').every(c => /[0-9]/.test(c));
}

// Returns a token of a given type and value
export function token(value = "", type: TokenType): Token {
	return { value, type };
}

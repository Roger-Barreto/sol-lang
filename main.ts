import fs from "fs";
import { tokenize } from "./src/lexer";

if (process.argv.length < 3) {
	console.error("Please provide a file path");
	process.exit(1);
}

const filePath = process.argv[2];

if (!filePath) {
	console.error("Please provide a file path");
	process.exit(1);
}

const sourceCode = fs.readFileSync(filePath, "utf-8");

const tokens = tokenize(sourceCode);
console.log("Tokens:", tokens);

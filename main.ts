import fs from "fs";
import { tokenize } from "./src/lexer";
import Parser from "./src/parser";

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

console.log("Source Code:", sourceCode);


const parser = new Parser();
const ast = parser.produceAST(sourceCode);
console.log("AST:", ast);

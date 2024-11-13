// deno-lint-ignore-file no-explicit-any
import {
  BinaryExpr,
  Expr,
  Identifier,
  NilLiteral,
  NumericLiteral,
  StringLiteral,
  BooleanLiteral,
  Program,
  Stmt,
  LogicalExpr,
  CallExpr,
  FunctionDeclaration,
  WhileStmt,
  IfStmt,
  ReturnStmt,
  BreakStmt,
  AssignmentExpr,
} from "../types/ats";
import { TokenType } from "../types/tokens";
import { Token } from "../types/tokens";

import { tokenize } from "./lexer";
import { NATIVE_FUNCTIONS } from "./native";

/**
 * Frontend for producing a valid AST from sourcode
 */
export default class Parser {
  private tokens: Token[] = [];

  /*
   * Determines if the parsing is complete and the END OF FILE Is reached.
   */
  private not_eof(): boolean {
    return this.tokens[0].type != TokenType.EOF;
  }

  /**
   * Returns the currently available token
   */
  private at() {
    return this.tokens[0] as Token;
  }

  /**
   * Returns the previous token and then advances the tokens array to the next value.
   */
  private eat() {
    const prev = this.tokens.shift() as Token;
    return prev;
  }

  /**
   * Returns the previous token and then advances the tokens array to the next value.
   *  Also checks the type of expected token and throws if the values dnot match.
   */
  private expect(type: TokenType, err: any) {
    const prev = this.tokens.shift() as Token;
    if (!prev || prev.type != type) {
      console.error("Parser Error:\n", err, prev, " - Expecting: ", type);
      process.exit(1);
    }

    return prev;
  }

  public produceAST(sourceCode: string): Program {
    this.tokens = tokenize(sourceCode);
    const program: Program = {
      kind: "Program",
      body: [],
    };

    // Parse until end of file
    while (this.not_eof()) {
      program.body.push(this.parse_stmt());
    }

    return program;
  }

  // Handle complex statement types
  private parse_stmt(): Stmt {
    // Handle function declarations
    if (this.at().type === TokenType.Function) {
      return this.parse_function_declaration();
    }

    // Handle while loops
    if (this.at().type === TokenType.While) {
      return this.parse_while_statement();
    }

    // Handle if statements
    if (this.at().type === TokenType.If) {
      return this.parse_if_statement();
    }

    // Handle return statements
    if (this.at().type === TokenType.Return) {
      return this.parse_return_statement();
    }

    // Handle break statements
    if (this.at().type === TokenType.Break) {
      return this.parse_break_statement();
    }

    // Default to expression statement
    return this.parse_expr();
  }

  // Handle expressions
  private parse_expr(): Expr {
    return this.parse_assignment();
  }

  private parse_assignment(): Expr {
    const left = this.parse_logical_or();

    if (this.at().type === TokenType.Assign) {
      this.eat(); // eat the equals
      const value = this.parse_assignment();

      // Verify the left side is an identifier
      if (left.kind !== "Identifier") {
        console.error("Invalid assignment target", left);
        process.exit(1);
      }

      return {
        kind: "AssignmentExpr",
        assigne: left,
        value,
      } as AssignmentExpr;
    }

    return left;
  }

  // Handle Addition & Subtraction Operations
  private parse_additive_expr(): Expr {
    let left = this.parse_multiplicitave_expr();

    while (this.at().value == "+" || this.at().value == "-") {
      const operator = this.eat().value;
      const right = this.parse_multiplicitave_expr();
      left = {
        kind: "BinaryExpr",
        left,
        right,
        operator,
      } as BinaryExpr;
    }

    return left;
  }

  // Handle Multiplication, Division & Modulo Operations
  private parse_multiplicitave_expr(): Expr {
    let left = this.parse_primary_expr();

    while (
      this.at().value == "/" || this.at().value == "*" || this.at().value == "%"
    ) {
      const operator = this.eat().value;
      const right = this.parse_primary_expr();
      left = {
        kind: "BinaryExpr",
        left,
        right,
        operator,
      } as BinaryExpr;
    }

    return left;
  }

  // Orders Of Prescidence
  // AdditiveExpr
  // MultiplicitaveExpr
  // PrimaryExpr

  // Parse Literal Values & Grouping Expressions
  private parse_primary_expr(): Expr {
    const tk = this.at().type;

    switch (tk) {
      case TokenType.Identifier: {
        const identifier = this.eat();

        // Check if this is a native function
        if (NATIVE_FUNCTIONS[identifier.value]) {
          // If it's followed by parentheses, it's a call
          if (this.at().type === TokenType.OpenParen) {
            return this.parse_call_expr(identifier);
          }
          // Otherwise return the native function itself
          return NATIVE_FUNCTIONS[identifier.value];
        }

        // Check if this is a function call
        if (this.at().type === TokenType.OpenParen) {
          return this.parse_call_expr(identifier);
        }

        return { kind: "Identifier", symbol: identifier.value } as Identifier;
      }

      case TokenType.Number:
        return {
          kind: "NumericLiteral",
          value: parseFloat(this.eat().value),
        } as NumericLiteral;

      case TokenType.String:
        return {
          kind: "StringLiteral",
          value: this.eat().value,
        } as StringLiteral;

      case TokenType.Boolean:
        return {
          kind: "BooleanLiteral",
          value: this.eat().value === "true",
        } as BooleanLiteral;

      case TokenType.Nil:
        this.eat();
        return { kind: "NilLiteral", value: "null" } as NilLiteral;

      case TokenType.OpenParen: {
        this.eat();
        const value = this.parse_expr();
        this.expect(
          TokenType.CloseParen,
          "Expected closing parenthesis"
        );
        return value;
      }

      default:
        console.error("Unexpected token found during parsing!", this.at());
        process.exit(1);
    }
  }

  private parse_function_declaration(): FunctionDeclaration {
    this.eat(); // eat 'function' keyword
    const name = this.expect(TokenType.Identifier, "Expected function name").value;

    this.expect(TokenType.OpenParen, "Expected '(' after function name");
    const parameters: string[] = [];

    if (this.at().type !== TokenType.CloseParen) {
      do {
        parameters.push(this.expect(TokenType.Identifier, "Expected parameter name").value);
      } while (this.at().type === TokenType.Comma && this.eat());
    }

    this.expect(TokenType.CloseParen, "Expected ')' after parameters");
    const body = this.parse_block();

    return {
      kind: "FunctionDeclaration",
      name,
      parameters,
      body,
    };
  }

  private parse_block(): Stmt[] {
    this.expect(TokenType.OpenBracket, "Expected '[' to start block");
    const statements: Stmt[] = [];

    while (this.at().type !== TokenType.CloseBracket && this.not_eof()) {
      statements.push(this.parse_stmt());
    }

    this.expect(TokenType.CloseBracket, "Expected ']' to end block");
    return statements;
  }

  private parse_while_statement(): WhileStmt {
    this.eat(); // eat 'while' keyword
    const condition = this.parse_expr();
    const body = this.parse_block();

    return {
      kind: "WhileStmt",
      condition,
      body,
    };
  }

  private parse_if_statement(): IfStmt {
    this.eat(); // eat 'if' keyword
    const condition = this.parse_expr();
    const thenBranch = this.parse_block();

    let elseBranch: Stmt[] | undefined;
    if (this.at().type === TokenType.Else) {
      this.eat(); // eat 'else' keyword
      elseBranch = this.parse_block();
    }

    return {
      kind: "IfStmt",
      condition,
      thenBranch,
      elseBranch,
    };
  }

  private parse_return_statement(): ReturnStmt {
    this.eat(); // eat 'return' keyword

    let value: Expr | undefined;
    if (this.at().type !== TokenType.Semicolon) {
      value = this.parse_expr();
    }

    this.expect(TokenType.Semicolon, "Expected ';' after return statement");
    return {
      kind: "ReturnStmt",
      value,
    };
  }

  private parse_break_statement(): BreakStmt {
    this.eat(); // eat 'break' keyword
    this.expect(TokenType.Semicolon, "Expected ';' after break statement");
    return {
      kind: "BreakStmt",
    };
  }

  private parse_logical_or(): Expr {
    let left = this.parse_logical_and();

    while (this.at().type === TokenType.Or) {
      const operator = this.eat().value;
      const right = this.parse_logical_and();
      left = {
        kind: "LogicalExpr",
        left,
        right,
        operator,
      } as LogicalExpr;
    }

    return left;
  }

  private parse_logical_and(): Expr {
    let left = this.parse_equality();

    while (this.at().type === TokenType.And) {
      const operator = this.eat().value;
      const right = this.parse_equality();
      left = {
        kind: "LogicalExpr",
        left,
        right,
        operator,
      } as LogicalExpr;
    }

    return left;
  }

  private parse_equality(): Expr {
    let left = this.parse_comparison();

    while (
      this.at().type === TokenType.Equals ||
      this.at().type === TokenType.NotEqual
    ) {
      const operator = this.eat().value;
      const right = this.parse_comparison();
      left = {
        kind: "BinaryExpr",
        left,
        right,
        operator,
      } as BinaryExpr;
    }

    return left;
  }

  private parse_comparison(): Expr {
    let left = this.parse_additive_expr();

    while (
      this.at().type === TokenType.LessThan ||
      this.at().type === TokenType.GreaterThan ||
      this.at().type === TokenType.LessThanOrEqual ||
      this.at().type === TokenType.GreaterThanOrEqual
    ) {
      const operator = this.eat().value;
      const right = this.parse_additive_expr();
      left = {
        kind: "BinaryExpr",
        left,
        right,
        operator,
      } as BinaryExpr;
    }

    return left;
  }

  private parse_call_expr(caller: Token): CallExpr {
    this.eat(); // eat open paren
    const args: Expr[] = [];

    if (this.at().type !== TokenType.CloseParen) {
      do {
        args.push(this.parse_expr());
      } while (this.at().type === TokenType.Comma && this.eat());
    }

    this.expect(TokenType.CloseParen, "Expected ')' after function arguments");

    // If it's a native function, return it wrapped in a CallExpr
    if (NATIVE_FUNCTIONS[caller.value]) {
      return {
        kind: "CallExpr",
        caller: NATIVE_FUNCTIONS[caller.value],
        args,
      };
    }

    return {
      kind: "CallExpr",
      caller: { kind: "Identifier", symbol: caller.value } as Identifier,
      args,
    };
  }
}

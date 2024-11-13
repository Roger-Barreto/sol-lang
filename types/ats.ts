// deno-lint-ignore-file no-empty-interface
// https://github.com/tlaceby/guide-to-interpreters-series
// -----------------------------------------------------------
// --------------          AST TYPES        ------------------
// ---     Defines the structure of our languages AST      ---
// -----------------------------------------------------------

export type NodeType =
  | "Program"
  | "NumericLiteral"
  | "StringLiteral"
  | "BooleanLiteral"
  | "NilLiteral"
  | "Identifier"
  | "BinaryExpr"
  | "LogicalExpr"
  | "CallExpr"
  | "FunctionDeclaration"
  | "WhileStmt"
  | "IfStmt"
  | "ReturnStmt"
  | "BreakStmt"
  | "NativeFunctionExpr"
  | "AssignmentExpr";

/**
 * Statements do not result in a value at runtime.
 They contain one or more expressions internally */
export interface Stmt {
  kind: NodeType;
}

/**
 * Defines a block which contains many statements.
 * -  Only one program will be contained in a file.
 */
export interface Program extends Stmt {
  kind: "Program";
  body: Stmt[];
}

/**  Expressions will result in a value at runtime unlike Statements */
export interface Expr extends Stmt {}

/**
 * A operation with two sides seperated by a operator.
 * Both sides can be ANY Complex Expression.
 * - Supported Operators -> + | - | / | * | %
 */
export interface BinaryExpr extends Expr {
  kind: "BinaryExpr";
  left: Expr;
  right: Expr;
  operator: string; // needs to be of type BinaryOperator
}

// LITERAL / PRIMARY EXPRESSION TYPES
/**
 * Represents a user-defined variable or symbol in source.
 */
export interface Identifier extends Expr {
  kind: "Identifier";
  symbol: string;
}

/**
 * Represents a numeric constant inside the soure code.
 */
export interface NumericLiteral extends Expr {
  kind: "NumericLiteral";
  value: number;
}

/**
 * Like Javascript defines a value of no meaning or undefined behavior.
 */
export interface NilLiteral extends Expr {
  kind: "NilLiteral";
  value: "null";
}

export interface StringLiteral extends Expr {
  kind: "StringLiteral";
  value: string;
}

export interface BooleanLiteral extends Expr {
  kind: "BooleanLiteral";
  value: boolean;
}

export interface CallExpr extends Expr {
  kind: "CallExpr";
  caller: Expr;
  args: Expr[];
}

export interface LogicalExpr extends Expr {
  kind: "LogicalExpr";
  left: Expr;
  right: Expr;
  operator: string; // "and" | "or"
}

export interface FunctionDeclaration extends Stmt {
  kind: "FunctionDeclaration";
  name: string;
  parameters: string[];
  body: Stmt[];
}

export interface WhileStmt extends Stmt {
  kind: "WhileStmt";
  condition: Expr;
  body: Stmt[];
}

export interface IfStmt extends Stmt {
  kind: "IfStmt";
  condition: Expr;
  thenBranch: Stmt[];
  elseBranch?: Stmt[];
}

export interface ReturnStmt extends Stmt {
  kind: "ReturnStmt";
  value?: Expr;
}

export interface BreakStmt extends Stmt {
  kind: "BreakStmt";
}

export interface NativeFunctionExpr extends Expr {
  kind: "NativeFunctionExpr";
  name: string;
  call: (...args: any[]) => any;
}

export interface AssignmentExpr extends Expr {
  kind: "AssignmentExpr";
  assigne: Expr;
  value: Expr;
}

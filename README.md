# Grammar Definition

## Program Structure
```text
<program> ::= <statement>*

<statement> ::= <function_declaration>
              | <while_statement>
              | <if_statement>
              | <expression>
              | <return_statement>
              | <break_statement>

<block> ::= "{" <statement>* "}"
```

## Functions
```text
<function_declaration> ::= "function" <identifier> "(" <parameter_list>? ")" <block>

<parameter_list> ::= <identifier> ("," <identifier>)*

<return_statement> ::= "return" <expression>? ";"
```

## Control Flow
```text
<while_statement> ::= "while" <expression> <block>

<if_statement> ::= "if" <expression> <block> ("else" <block>)?

<break_statement> ::= "break" ";"
```

## Expressions
```text
<expression> ::= <logical_or>

<logical_or> ::= <logical_and> ("or" <logical_and>)*

<logical_and> ::= <equality> ("and" <equality>)*

<equality> ::= <comparison> (("==" | "~=") <comparison>)*

<comparison> ::= <term> (("<" | ">" | "<=" | ">=") <term>)*

<primary> ::= <number>
            | <string>
            | <boolean>
            | "nil"
            | <identifier>
            | "(" <expression> ")"
            | <function_call>

<function_call> ::= <identifier> "(" <argument_list>? ")"

<argument_list> ::= <expression> ("," <expression>)*
```

## Literals
```text
<number> ::= [0-9]+ ("." [0-9]+)?

<string> ::= '"' [^"]* '"'

<boolean> ::= "true" | "false"

<identifier> ::= [a-zA-Z_][a-zA-Z0-9_]*
```


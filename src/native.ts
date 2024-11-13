import { NativeFunctionExpr } from "../types/ats";

export const NATIVE_FUNCTIONS: Record<string, NativeFunctionExpr> = {
  print: {
    kind: "NativeFunctionExpr",
    name: "print",
    call: (...args: any[]) => {
      console.log(...args);
      return null;
    }
  }
};

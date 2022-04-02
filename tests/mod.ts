import Good from "../good.ts";
import blockTest from "./block-test.ts";
import mathTest from "./math-test.ts";
import variablesTest from "./variables-test.ts";
import selfEvalTest from "./self-eval-test.ts";
import ifTest from "./if-test.ts";
import whileTest from "./while-test.ts";

const tests = [
  blockTest,
  mathTest,
  variablesTest,
  selfEvalTest,
  ifTest,
  whileTest,
];

const g = new Good();

tests.forEach((test) => test(g));

console.log("All tests passed");

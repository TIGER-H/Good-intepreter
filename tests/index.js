const Good = require("../good");

const tests = [
  require("./self-eval-test"),
  require("./math-test"),
  require("./variables-test"),
  require("./block-test"),
  require("./if-test"),
  require("./while-test"),
  require("./built-in-function-test"),
];

const g = new Good();

tests.forEach((test) => test(g));

g.eval(["print", '"arg1"', '"arg2"']);

console.log("All tests passed");

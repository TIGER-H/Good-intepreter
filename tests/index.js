const Good = require("../Good");

const tests = [
  require("./self-eval-test"),
  require("./math-test"),
  require("./variables-test"),
  require("./block-test"),
  require("./if-test"),
  require("./while-for-test"),
  require("./built-in-function-test"),
  require("./user-defined-function-test"),
  require("./lambda-function-test"),
  require("./switch-test"),
  require("./class-test"),
  require("./module-test"),
];

const g = new Good();

tests.forEach((test) => test(g));

g.eval(["print", '"arg1"', '"arg2"']);

console.log("All tests passed");

const Good = require("../good");

const tests = [
  require("./self-eval-test"),
  require("./math-test"),
  require("./variables-test"),
  require("./block-test"),
  require("./if-test"),
  require("./while-test"),
];

const g = new Good();

tests.forEach((test) => test(g));

console.log("All tests passed");

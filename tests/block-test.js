const assert = require("assert");
const testUtil = require("./test-util.js");

module.exports = (g) => {
  //block
  assert.strictEqual(
    g.eval([
      "begin",
      ["var", "x", 1],
      ["var", "y", 2],
      ["+", ["*", "x", "y"], 98],
    ]),
    100
  );

  // outer x should not be affected
  assert.strictEqual(
    g.eval(["begin", ["var", "x", 1], ["begin", ["var", "x", 2], "x"], "x"]),
    1
  );

  assert.strictEqual(
    g.eval([
      "begin",
      ["var", "value", 1],
      ["var", "result", ["begin", ["var", "x", ["+", "value", 1]], "x"]],
      "result",
    ]),
    2
  );

  // assignment
  assert.strictEqual(
    g.eval([
      "begin",
      ["var", "value", 1],
      ["begin", ["set", "value", 2], "value"],
    ]),
    2
  );
  
  // better test
  testUtil.test(
    g,
    `
    (begin
      (var x 1)
      (var y 2)
      (+ (* x y) 98)  
    )
  `,
    100
  );
};

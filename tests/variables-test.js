const assert = require("assert");
const { test } = require("./test-util");

module.exports = (g) => {
  // variable

  assert.strictEqual(g.eval(["var", "x", 1]), 1);
  assert.strictEqual(g.eval("x"), 1);
  assert.strictEqual(g.eval(["var", "y", 100]), 100);
  assert.strictEqual(g.eval("y"), 100);
  assert.strictEqual(g.eval(["var", "z", ["+", "x", "y"]]), 101);
  assert.strictEqual(g.eval("z"), 101);

  // ++ / -- / += / -=
  test(
    g,
    `
    (
      begin

      (var x 0)
      (++ x)
      (++ x)
      (-- x)
      (+= x 2)
      (-= x 2)
      x
    )
  `,
    1
  );

  // default value
  assert.strictEqual(g.eval("true"), true);
  assert.strictEqual(g.eval("null"), null);
  assert.strictEqual(g.eval("false"), false);
  assert.strictEqual(g.eval("VERSION"), "0.0.1");
};

const assert = require("assert");

module.exports = (g) => {
  // number and string
  assert.strictEqual(g.eval(1), 1);
  assert.strictEqual(g.eval('"hello"'), "hello");

  // var isTrue = true
  assert.strictEqual(g.eval(["var", "isTrue", "true"]), true);
};

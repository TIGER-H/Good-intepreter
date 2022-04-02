const assert = require("assert");
module.exports = (g) => {
  // math
  assert.strictEqual(g.eval(["+", 1, 2]), 3);
  assert.strictEqual(g.eval(["+", ["+", 1, 2], 1]), 4);
  assert.strictEqual(g.eval(["+", ["*", 1, 2], 1]), 3);
};

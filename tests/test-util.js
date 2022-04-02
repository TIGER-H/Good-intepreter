const assert = require("assert");
const goodParser = require("../parser/goodParser");

function test(g, code, expected) {
  const exp = goodParser.parse(code);
  assert.strictEqual(g.eval(exp), expected);
}

module.exports = {
  test,
};

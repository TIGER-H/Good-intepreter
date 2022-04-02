const assert = require("assert");
const goodParser = require("../parser/goodParser");

function test(g, code, expected) {
  const exp = goodParser.parse(`(begin ${code})`);
  assert.strictEqual(g.evalGlobal(exp), expected);
}

module.exports = {
  test,
};

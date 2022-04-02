const assert = require("assert");

module.exports = (g) => {
  assert.strictEqual(
    g.eval([
      "begin",
      ["var", "cnt", 0],

      ["while", ["<", "cnt", 10], ["begin", ["set", "cnt", ["+", "cnt", 1]]]],

      "cnt",
    ]),

    10
  );
};

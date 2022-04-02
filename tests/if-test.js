const assert = require("assert");

/* 
  (if <condition> <then> <else>)
*/
module.exports = (g) => {
  assert.strictEqual(
    g.eval([
      "begin",
      ["var", "x", 1],
      ["var", "y", 2],
      ["if", [">", "x", 1], ["set", "y", 20], ["set", "y", 30]],
    ]),
    30
  );
};

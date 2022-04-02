const assert = require("assert");
const { test } = require("./test-util");

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

  // rewrite in test
  test(
    g,
    `
    (
      begin
      (var cnt 0)
      (while (< cnt 10) 
        (
          begin
          (set cnt (+ cnt 1))
        )
      )
    )
  `,
    10
  );

  /* https://github.com/DmitrySoshnikov/eva-source/blob/master/__tests__/for-test.js */
  test(
    g,
    `
      (begin
        (var result 0)
        (for (var i 0) (< i 5) (set i (+ i 1))
          (set result (+ result i)))
        result
      )
    `,
    15
  );
};

/* https://github.com/DmitrySoshnikov/eva-source/blob/master/__tests__/module-test.js */
const { test } = require("./test-util");

module.exports = (g) => {
  test(
    g,
    `
    (module Math
      (begin
        (def abs (value)
          (if (< value 0)
              (- value)
              value))
        (def square (x)
          (* x x))
        (var MAX_VALUE 1000)
      )
    )
    ((prop Math abs) (- 10))
  `,
    10
  );

  test(
    g,
    `
    (var abs (prop Math abs))
    (abs (- 10))
  `,
    10
  );

  test(
    g,
    `
    (prop Math MAX_VALUE)
  `,
    1000
  );
};

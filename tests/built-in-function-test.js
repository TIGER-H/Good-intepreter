const { test } = require("./test-util");

module.exports = (good) => {
  // Math functions:

  test(good, `(+ 1 5)`, 6);
  test(good, `(+ (+ 2 3) 5)`, 10);
  test(good, `(+ (* 2 3) 5)`, 11);

  // Comparison:

  test(good, `(> 1 5)`, false);
  test(good, `(< 1 5)`, true);

  test(good, `(>= 5 5)`, true);
  test(good, `(<= 5 5)`, true);
  test(good, `(=  5 5)`, true);
};

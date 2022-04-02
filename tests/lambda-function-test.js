const { test } = require("./test-util");

module.exports = (g) => {
  test(
    g,
    `
    (
      begin
        (def onClick (cb)
          (
            begin 
              (var x 10)
              (var y 20)
              (cb (+ x y))
          )
        )

        (onClick (lambda (x) (* x 10)))
    )
  `,
    300
  );

  // IILE: imediately-invoked lambda expression
  test(
    g,
    `
    ((lambda (x) (* x 10)) 2)
    `,
    20
  );

  // save to variable
  test(
    g,
    `(
    begin
      (var sum (lambda (a b) (+ a b)))
      (sum 1 2)
  )`,
    3
  );
};

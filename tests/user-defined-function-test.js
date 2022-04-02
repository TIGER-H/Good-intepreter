const { test } = require("./test-util");

module.exports = (g) => {
  test(
    g,
    `
    (begin
      (def square (x)
       (* x x))

      (square 2)  
    )
  `,
    4
  );

  // params
  test(
    g,
    `
    (begin
      (def calc (x y)
       (begin
        (var z 10)
        (+ (* x y) z)
       ))

      (calc 2 3)  
    )
  `,
    16
  );

  // closure test
  test(
    g,
    `
    (begin
      (var val 100)

      (def calc (x y)
        (begin
          (var z (+ x y))

          (def inner (foo)
            (+ (+ foo z) val)
          )
          inner
        ))

      (var fn (calc 1 2))
      
      (fn 30)
    )
  `,
    133
  );
};

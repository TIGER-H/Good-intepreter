const { test } = require("./test-util");

module.exports = (g) => {
  test(
    g,
    `
    (
      begin
        (var x 3)

        (switch ((= x 10) 100)
                ((= x 30) 200)
                ((= x 40) 200)
                (else     300))
    )
  `,
    300
  );
};

import { assertStrictEquals } from "https://deno.land/std/testing/asserts.ts";

export default (g: any) => {
  //block
  assertStrictEquals(
    g.eval([
      "begin",
      ["var", "x", 1],
      ["var", "y", 2],
      ["+", ["*", "x", "y"], 98],
    ]),
    100
  );

  // outer x should not be affected
  assertStrictEquals(
    g.eval(["begin", ["var", "x", 1], ["begin", ["var", "x", 2], "x"], "x"]),
    1
  );

  assertStrictEquals(
    g.eval([
      "begin",
      ["var", "value", 1],
      ["var", "result", ["begin", ["var", "x", ["+", "value", 1]], "x"]],
      "result",
    ]),
    2
  );

  // assignment
  assertStrictEquals(
    g.eval([
      "begin",
      ["var", "value", 1],
      ["begin", ["set", "value", 2], "value"],
    ]),
    2
  );
};

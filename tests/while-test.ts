import { assertStrictEquals } from "https://deno.land/std/testing/asserts.ts";

export default (g: any) => {
  assertStrictEquals(
    g.eval([
      "begin",
      ["var", "cnt", 0],

      ["while", ["<", "cnt", 10], ["begin", ["set", "cnt", ["+", "cnt", 1]]]],

      "cnt",
    ]),

    10
  );
};

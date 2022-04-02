import { assertStrictEquals } from "https://deno.land/std/testing/asserts.ts";

/* 
  (if <condition> <then> <else>)
*/
export default (g: any) => {
  assertStrictEquals(
    g.eval([
      "begin",
      ["var", "x", 1],
      ["var", "y", 2],
      ["if", [">", "x", 1], ["set", "y", 20], ["set", "y", 30]],
    ]),
    30
  );
};

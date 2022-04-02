import { assertStrictEquals } from "https://deno.land/std/testing/asserts.ts";

export default (g: any) => {
  // var isTrue = true
  assertStrictEquals(g.eval(["var", "isTrue", "true"]), true);

  assertStrictEquals(g.eval(["var", "z", ["+", "x", "y"]]), 101);
  assertStrictEquals(g.eval("z"), 101);
};

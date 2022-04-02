import { assertStrictEquals } from "https://deno.land/std/testing/asserts.ts";

export default (g: any) => {
  // variable

  assertStrictEquals(g.eval(["var", "x", 1]), 1);
  assertStrictEquals(g.eval("x"), 1);
  assertStrictEquals(g.eval(["var", "y", 100]), 100);
  assertStrictEquals(g.eval("y"), 100);

  // default value
  assertStrictEquals(g.eval("true"), true);
  assertStrictEquals(g.eval("null"), null);
  assertStrictEquals(g.eval("false"), false);
  assertStrictEquals(g.eval("VERSION"), "0.0.1");
};

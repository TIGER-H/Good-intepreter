import { assertStrictEquals } from "https://deno.land/std/testing/asserts.ts";

export default (g: any) => {
  // number and string
  assertStrictEquals(g.eval(1), 1);
  assertStrictEquals(g.eval('"hello"'), "hello");

  // math
  assertStrictEquals(g.eval(["+", 1, 2]), 3);
  assertStrictEquals(g.eval(["+", ["+", 1, 2], 1]), 4);
  assertStrictEquals(g.eval(["+", ["*", 1, 2], 1]), 3);
};

import { assertStrictEquals } from "https://deno.land/std/testing/asserts.ts";
import Environment from "./Environment.ts";

class Good {
  global: any;
  constructor(
    global = new Environment({
      null: null,

      true: true,
      false: false,

      VERSION: "0.0.1",
    })
  ) {
    this.global = global;
  }

  eval(exp: any, env = this.global): any {
    if (isNumber(exp)) {
      return exp;
    }
    if (isString(exp)) {
      return exp.slice(1, -1);
    }
    if (exp[0] === "+") {
      return this.eval(exp[1], env) + this.eval(exp[2], env);
    }
    if (exp[0] === "*") {
      return this.eval(exp[1], env) * this.eval(exp[2], env);
    }

    // Block:
    if (exp[0] === "begin") {
      const blockEnv = new Environment({}, env);
      return this._evalBlock(exp, blockEnv);
    }

    // Variable declaration: (var foo 1)
    if (exp[0] === "var") {
      const [_, name, value] = exp;
      return env.define(name, this.eval(value, env));
    }

    // Variable update: (set foo 10)
    if(exp[0] === "set") {
      const [_, name, value] = exp;
      return env.assign(name, this.eval(value, env));
    }

    // Variable access: foo
    if (isVariableName(exp)) {
      return env.lookup(exp);
    }

    throw `unimplemented ${JSON.stringify(exp)}`;
  }

  _evalBlock(exp: any, env: any) {
    const [_, ...exps] = exp; // ["begin", ...exps]
    return exps.reduce((_: never, exp: any) => this.eval(exp, env), null);
  }
}

function isNumber(exp: any) {
  return typeof exp === "number";
}

function isString(exp: any) {
  return typeof exp === "string" && exp[0] === '"' && exp.slice(-1) === '"';
}

function isVariableName(exp: any) {
  return typeof exp === "string" && /^[a-zA-Z][a-zA-Z0-9_]*$/.test(exp);
}

// tests

const g = new Good();

// number and string
assertStrictEquals(g.eval(1), 1);
assertStrictEquals(g.eval('"hello"'), "hello");

// math
assertStrictEquals(g.eval(["+", 1, 2]), 3);
assertStrictEquals(g.eval(["+", ["+", 1, 2], 1]), 4);
assertStrictEquals(g.eval(["+", ["*", 1, 2], 1]), 3);

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

// var isTrue = true
assertStrictEquals(g.eval(["var", "isTrue", "true"]), true);

assertStrictEquals(g.eval(["var", "z", ["+", "x", "y"]]), 101);
assertStrictEquals(g.eval("z"), 101);

// block
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

console.log("All tests passed");

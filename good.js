const { strictEqual } = require("assert");
const Environment = require("./Environment");

class Good {
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
  eval(exp, env = this.global) {
    if (isNumber(exp)) {
      return exp;
    }
    if (isString(exp)) {
      return exp.slice(1, -1);
    }
    if (exp[0] === "+") {
      return this.eval(exp[1]) + this.eval(exp[2]);
    }
    if (exp[0] === "*") {
      return this.eval(exp[1]) * this.eval(exp[2]);
    }

    // Variable declaration: var foo 1
    if (exp[0] === "var") {
      const [_, name, value] = exp;
      return env.define(name, this.eval(value));
    }

    // Variable access: foo
    if (isVariableName(exp)) {
      return env.lookup(exp);
    }

    throw `unimplemented ${JSON.stringify(exp)}`;
  }
}

function isNumber(exp) {
  return typeof exp === "number";
}

function isString(exp) {
  return typeof exp === "string" && exp[0] === '"' && exp.slice(-1) === '"';
}

function isVariableName(exp) {
  return typeof exp === "string" && /^[a-zA-Z][a-zA-Z0-9_]*$/.test(exp);
}


// tests

const g = new Good();

// number and string
strictEqual(g.eval(1), 1);
strictEqual(g.eval('"hello"'), "hello");

// math
strictEqual(g.eval(["+", 1, 2]), 3);
strictEqual(g.eval(["+", ["+", 1, 2], 1]), 4);
strictEqual(g.eval(["+", ["*", 1, 2], 1]), 3);

// variable

strictEqual(g.eval(["var", "x", 1]), 1);
strictEqual(g.eval("x"), 1);
strictEqual(g.eval(["var", "y", 100]), 100);
strictEqual(g.eval("y"), 100);

// default value
strictEqual(g.eval("true"), true);
strictEqual(g.eval("null"), null);
strictEqual(g.eval("false"), false);
strictEqual(g.eval("VERSION"), "0.0.1");

// var isTrue = true
strictEqual(g.eval(["var", "isTrue", "true"]), true);

strictEqual(g.eval(["var", "z", ["+", "x", "y"]]), 101);
strictEqual(g.eval("z"), 101);

console.log("All tests passed");

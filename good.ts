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

    // comparison
    if (exp[0] === ">") {
      return this.eval(exp[1], env) > this.eval(exp[2], env);
    }
    if (exp[0] === "<") {
      return this.eval(exp[1], env) < this.eval(exp[2], env);
    }
    if (exp[0] === ">=") {
      return this.eval(exp[1], env) >= this.eval(exp[2], env);
    }
    if (exp[0] === "<=") {
      return this.eval(exp[1], env) <= this.eval(exp[2], env);
    }
    if (exp[0] === "==") {
      return this.eval(exp[1], env) === this.eval(exp[2], env);
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
    if (exp[0] === "set") {
      const [_, name, value] = exp;
      return env.assign(name, this.eval(value, env));
    }

    // if-expr
    if (exp[0] === "if") {
      const [_, condition, then, else_] = exp;
      if (this.eval(condition, env)) {
        return this.eval(then, env);
      }
      return this.eval(else_, env);
    }

    // while-expr
    if (exp[0] === "while") {
      const [_, condition, body] = exp;
      let res;
      while (this.eval(condition, env)) {
        res = this.eval(body, env);
      }
      return res;  
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

export default Good;

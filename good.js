const Environment = require("./Environment");
class Good {
  constructor(global = GlobalEnvironment) {
    this.global = global;
  }

  eval(exp, env = this.global) {
    if (this._isNumber(exp)) {
      return exp;
    }
    if (this._isString(exp)) {
      return exp.slice(1, -1);
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
    if (this._isVariableName(exp)) {
      return env.lookup(exp);
    }

    /* 
      function declaration: (def foo (x) (* x x))

      syntactic sugar: (var square (lambda (x) (* x x)))
    */
    if (exp[0] === "def") {
      const [_, name, params, body] = exp;

      // JIT-transpile to a variable declaration
      const varExp = ["var", name, ["lambda", params, body]];

      return this.eval(varExp, env);
      // const fn = {
      //   params,
      //   body,
      //   env, // closure
      // };

      // return env.define(name, fn);
    }

    /* lambda function: (lambda (x) (expr)) */
    if (exp[0] === "lambda") {
      const [_, params, body] = exp;
      return {
        params,
        body,
        env,
      };
    }

    /*
      Function call: (print "hello")
      (print "word")
      (+ x 5)
      (> foo bar)
    */
    if (Array.isArray(exp)) {
      const fn = this.eval(exp[0], env);
      const args = exp.slice(1).map((arg) => this.eval(arg, env));

      // native js function
      if (typeof fn === "function") {
        return fn(...args);
      }

      /*  user defined function
        - new activation environment
        - parent link to captured environment
      */
      const acitvationRecord = {};

      fn.params.forEach((param, index) => {
        acitvationRecord[param] = args[index];
      });

      const activationEnv = new Environment(
        acitvationRecord,
        fn.env // static scope; env -> dynamic scope
      );

      return this._evalBody(fn.body, activationEnv);
    }

    throw `unimplemented ${JSON.stringify(exp)}`;
  }

  _evalBody(body, env) {
    if (body[0] === "begin") {
      return this._evalBlock(body, env);
    }
    return this.eval(body, env);
  }

  _evalBlock(exp, env) {
    const [_, ...exps] = exp; // ["begin", ...exps]
    return exps.reduce((_, exp) => this.eval(exp, env), null);
  }
  _isNumber(exp) {
    return typeof exp === "number";
  }

  _isString(exp) {
    return typeof exp === "string" && exp[0] === '"' && exp.slice(-1) === '"';
  }

  _isVariableName(exp) {
    return typeof exp === "string" && /^[=+\-*/><a-zA-Z0-9_]*$/.test(exp);
  }
}

const GlobalEnvironment = new Environment({
  null: null,

  true: true,
  false: false,

  "+"(a, b) {
    return a + b;
  },

  "*"(a, b) {
    return a * b;
  },

  "-"(a, b = null) {
    if (b == null) {
      return -a;
    }
    return a - b;
  },

  "/"(a, b) {
    return a / b;
  },

  "<"(a, b) {
    return a < b;
  },

  ">"(a, b) {
    return a > b;
  },

  "<="(a, b) {
    return a <= b;
  },

  ">="(a, b) {
    return a >= b;
  },

  "="(a, b) {
    return a === b;
  },

  print(...args) {
    console.log(...args);
  },

  VERSION: "0.0.1",
});

module.exports = Good;

const Environment = require("./Environment");
const Trasnformer = require("./transform/Transformer");

class Good {
  constructor(global = GlobalEnvironment) {
    this.global = global;
    this._transformer = new Trasnformer();
  }

  evalGlobal(exp) {
    return this._evalBlock(["block", exp], this.global);
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
    /* OR property access(write): (set (prop <instance> <name>)) */
    if (exp[0] === "set") {
      const [_, ref, value] = exp;

      if (ref[0] === "prop") {
        // property access
        const [_, instance, propName] = ref;
        const instanceEnv = this.eval(instance, env);

        return instanceEnv.define(propName, this.eval(value, env));
      }

      // variable update
      // assignment may affect variables from the outer environment,
      // will lookup environment chain.
      return env.assign(ref, this.eval(value, env));
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

    // for-loop
    if (exp[0] === "for") {
      const whileExp = this._transformer.transformForToWhile(exp);

      return this.eval(whileExp, env);
    }

    // (++/--/+=/-= foo)
    // syntactic sugar for (set foo (+ foo 1))
    if (exp[0] === "++") {
      const setExp = this._transformer.transformIncrementToSet(exp);

      return this.eval(setExp, env);
    }
    if (exp[0] === "--") {
      const setExp = this._transformer.transformDecrementToSet(exp);

      return this.eval(setExp, env);
    }

    // += foo inc
    // syntactic sugar for (set foo (+ foo inc))
    if (exp[0] === "+=") {
      const [_, varName, inc] = exp;
      const setExp = ["set", varName, ["+", varName, this.eval(inc, env)]];

      return this.eval(setExp, env);
    }

    // -= foo dec
    // syntactic sugar for (set foo (- foo dec))
    if (exp[0] === "-=") {
      const [_, varName, dec] = exp;
      const setExp = ["set", varName, ["-", varName, this.eval(dec, env)]];

      return this.eval(setExp, env);
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
      const varExp = this._transformer.transformDefToVarLambda(exp);

      return this.eval(varExp, env);
      // const fn = {
      //   params,
      //   body,
      //   env, // closure
      // };

      // return env.define(name, fn);
    }

    if (exp[0] === "switch") {
      const ifExp = this._transformer.transformSwitchToIf(exp);

      return this.eval(ifExp, env);
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

    /* class declaration: (class <Name> <Parent> <Body>) */
    if (exp[0] === "class") {
      const [_, name, parent, body] = exp;
      const parentEnv = this.eval(parent, env) || env;

      const classEnv = new Environment({}, parentEnv);

      this._evalBody(body, classEnv);

      return env.define(name, classEnv);
    }

    /* super exp: (super <clasName>) */
    if (exp[0] === "super") {
      const [_, className] = exp;
      return this.eval(className, env).parent;
    }

    /* class instantiation: (new <class> <args>...) */
    /* a class is an environment! */
    if (exp[0] === "new") {
      const classEnv = this.eval(exp[1], env);
      const instanceEnv = new Environment({}, classEnv);
      const args = exp.slice(2).map((arg) => this.eval(arg, env));

      this._callUserDefinedFunction(classEnv.lookup("constructor"), [
        instanceEnv, // as self/this
        ...args,
      ]);

      return instanceEnv;
    }

    /* property access(read): (prop <instance> <name>) */
    /* property access(write): (set (prop <instance> <name>)) */
    if (exp[0] === "prop") {
      const [_, instance, name] = exp;
      const instanceEnv = this.eval(instance, env);

      return instanceEnv.lookup(name);
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
      return this._callUserDefinedFunction(fn, args);
    }

    throw `unimplemented ${JSON.stringify(exp)}`;
  }

  _callUserDefinedFunction(fn, args) {
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

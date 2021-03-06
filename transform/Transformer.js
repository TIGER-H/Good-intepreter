class Trasnformer {
  transformDefToVarLambda(defExp) {
    const [_, name, params, body] = defExp;

    // JIT-transpile to a variable declaration
    return ["var", name, ["lambda", params, body]];
  }

  // transform to nested if-expressions
  transformSwitchToIf(switchExp) {
    const [_, ...cases] = switchExp;
    const ifExp = ["if", null, null, null];

    let current = ifExp;
    for (let i = 0; i < cases.length - 1; i++) {
      const [currentCondition, currentBlock] = cases[i];

      current[1] = currentCondition;
      current[2] = currentBlock;

      const next = cases[i + 1];
      const [nextCondition, nextBlock] = next;

      current[3] = nextCondition === "else" ? nextBlock : ["if"];
      current = current[3];
    }

    return ifExp;
  }

  transformForToWhile(forExp) {
    const [_, init, condition, modifier, block] = forExp;

    return ["begin", init, ["while", condition, ["begin", modifier, block]]];
  }

  transformIncrementToSet(incrementExp) {
    const [_, varName] = incrementExp;
    return ["set", varName, ["+", varName, 1]];
  }

  transformDecrementToSet(decrementExp) {
    const [_, varName] = decrementExp;
    return ["set", varName, ["-", varName, 1]];
  }
}

module.exports = Trasnformer;

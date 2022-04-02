class Trasnformer {
  transformDefToVarLambda(defExp) {
    const [_, name, params, body] = defExp;

    // JIT-transpile to a variable declaration
    return ["var", name, ["lambda", params, body]];
  }

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
      console.log(JSON.stringify(ifExp));
    }

    return ifExp;
  }
}

module.exports = Trasnformer;

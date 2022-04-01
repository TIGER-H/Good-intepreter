class Environment {
  record: Record<any, any>;
  parent: any;
  constructor(record = {}, parent = null) {
    this.record = record;
    this.parent = parent;
  }

  define(name: any, value: any) {
    this.record[name] = value;
    return value;
  }

  lookup(name: any) {
    return this.resolve(name).record[name];
  }

  assign(name: any, value: any) {
    this.resolve(name).record[name] = value;
    return value;
  }

  resolve(name: any) {
    if (this.record.hasOwnProperty(name)) {
      return this;
    }
    if (this.parent == null) {
      console.log(this);

      throw new ReferenceError(`Variable "${name}" is not defined`);
    }
    return this.parent.resolve(name);
  }
}

export default Environment;

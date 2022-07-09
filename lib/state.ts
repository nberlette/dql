export class State<T = any> {
  private static $ = new Map<string, any>();
  private readonly $: Map<string, T>;
  private $deleted: Set<T>;

  /**
   * Creates a new State instance with optional initial value.
   * @param {StateInit} [initial] Initial state
   * @returns {State<T>} a new State instance with optional initial value.
   */
  constructor(initial: StateInit<T> = State.$) {
    if (initial && State.isObject(initial)) {
      initial = Object.entries(initial);
    }
    initial ??= [];
    this.$ = new Map(initial as Iterable<[string, T]>);
    this.$deleted = new Set();
    return this;
  }

  /**
   * Converts the state into an object that can be understood by `JSON.stringify()`.
   * @returns {Record<string,T>} an object literal representing the state.
   * @example const state = new State([['a', 1], ['b', 2]]);
   * state.toJSON(); // { a: 1, b: 2 }
   * JSON.stringify(state); // { "a": 1, "b": 2 }
   */
  toJSON(): Record<string, T> {
    return Object.fromEntries(this.$.entries());
  }

  /**
   * When calling `Object.prototype.toString` on a State instance, it returns
   * `[object State]` rather than the generic default `[object Object]`.
   * @returns {'State'}
   */
  public get [Symbol.toStringTag](): "State" {
    return "State";
  }

  /**
   * Test if a given value is a plain object, and not a function, array, etc.
   * @param obj The object to test.
   * @returns {boolean} `true` if `obj` is an object literal, `false` otherwise.
   */
  public static isObject<O extends Record<string, any>>(
    obj: unknown,
  ): obj is O {
    if (Array.isArray(obj) || typeof obj === "function") return false;

    return (Object.prototype.toString.call(obj) === "[object Object]");
  }

  /**
   * Add or update a value in a State instance by its associated key.
   * @param key - the key (`string`) to set a value for
   * @param value - can be any valid JavaScript value.
   * @returns the `State` instance, for optional chaining
   * @example const state = new State();
   * state.set('a', 1); // { a: 1 }
   * // `.set` returns the State instance for chaining:
   * state.set('b', 2).set('c', 3); // { a: 1, b: 2, c: 3 }
   */
  public set<V extends T>(key: string | string[], value: V): State<T> {
    [key].flat().forEach((k) => this.$.set(k, value));
    return this;
  }

  /**
   * Returns the value associated with a key in a State instance.
   * @param key - the key to lookup
   * @returns the value associated with the key, or `undefined` if it does not exist.
   */
  public get<V extends T>(key: string): V {
    return this.$.get(key) as V;
  }

  /**
   * Returns `true` if the State instance contains a value for the given key.
   * @param key - the key to lookup
   * @returns `true` if the State contains a value for the given key, `false` otherwise.
   * @example const state = new State([['a', 1], ['b', 2]]);
   * state.has('a'); // true
   * state.has('c'); // false
   */
  public has(key: string): boolean {
    return this.$.has(key);
  }

  /**
   * Delete a value from a State instance by its associated key.
   * @param key - the key to delete
   * @returns the `State` instance, for optional chaining
   * @example const state = new State([['a', 1], ['b', 2], ['c', 3]]);
   * state.delete('a'); // { b: 2, c: 3 }
   * state.delete('b').delete('c'); // {}
   */
  public delete(key: string | string[]): State<T> {
    if (Array.isArray(key)) {
      key.forEach((k) => this.delete(k));
    } else {
      if (this.has(key)) {
        this.$deleted.add(this.get(key));
        this.$.delete(key);
      }
    }
    return this;
  }

  /**
   * Clears all values from the State instance.
   * @returns the `State` instance, for optional chaining.
   * @example const state = new State([['a', 1], ['b', 2], ['c', 3]]);
   * state.clear(); // {}
   */
  public clear(): State<T> {
    this.$deleted = new Set([...this.$deleted, ...this.$.values()]);
    this.$.clear();
    return this;
  }

  /**
   * Similar to `Array.prototype.map`, this accepts a callback function and
   * applies it to each value, returning an array of the collated results.
   * @param callbackfn - called for each value,
   * with any returned value then added to the final array.
   * @param [thisArg] - optional value to use as `this` when calling
   * `callbackfn`, defaults to the State instance.
   * @returns an array of the returned `callbackfn` values.
   * @example const state = new State([['a', 1], ['b', 2]]);
   * state.map((value, key) => value + key); // ['a1', 'b2']
   */
  public map<V>(
    callbackfn: (value: T, key: string, map: State<T>) => V,
    thisArg?: any,
  ): V[] {
    return [...this.entries].map<V>(([key, value]) =>
      callbackfn.apply(thisArg, [value, key, this])
    );
  }

  /**
   * Executes a given function for each value in the State instance.
   * @param callbackfn
   * @param [thisArg]
   * @returns the state instance for optional chaining.
   */
  public forEach(
    callbackfn: (value: T, key: string, map: State<T>) => void,
    thisArg?: any,
  ): State<T> {
    this.$.forEach(
      (v, k) => callbackfn.apply(thisArg, [v, k, this]),
      thisArg ?? this.$,
    );
    return this;
  }

  /**
   * @returns An `IterableIterator` of the keys of a State instance.
   */
  public get keys(): IterableIterator<string> {
    return this.$.keys();
  }

  /**
   * @returns An `IterableIterator` of the values of a State instance.
   */
  public get values(): IterableIterator<T> {
    return this.$.values();
  }

  /**
   * @returns An `IterableIterator` of the entries (key-value pairs) of a State instance.
   */
  public get entries(): IterableIterator<[string, T]> {
    return this.$.entries();
  }

  /**
   * @returns An `IterableIterator` of the deleted values of a State instance.
   */
  public get deleted(): IterableIterator<T> {
    return this.$deleted.values();
  }

  /**
   * @returns The number of values currently in the State instance.
   */
  public get length(): number {
    return +this.$.size;
  }
}

export default State;

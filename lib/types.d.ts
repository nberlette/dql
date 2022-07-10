/// <reference lib="es2022" />
/// <reference lib="dom" />
/// <reference lib="deno.window" />
/// <reference lib="deno.ns" />
/// <reference no-default-lib="true" />

type StateInit<T extends any> =
  | Iterable<[string, T]>
  | Map<string, T>
  | [string, T][]
  | Record<string, T>;

interface ElementParams {
  selector?: string;
}

interface PageParams {
  url?: string;
  source?: string;
}

interface TextParams extends ElementParams {
  trim?: boolean;
}

interface AttrParams {
  name?: string;
}

interface IndexParams {
  parent?: string;
}

interface AllParams
  extends PageParams, IndexParams, ElementParams, TextParams, AttrParams {
  attr?: string;
}

type TParams = Partial<AllParams>;

interface TContext<T = any> {
  state: import("./state.ts").State<T>;
}

type Variables = { [key: string]: any };

interface QueryOptions {
  concurrency?: number;
  fetch_options?: RequestInit;
  variables?: Variables;
}

interface IOptional {
  endpoint?: string;
}

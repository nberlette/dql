import { State } from "./lib/state.ts";

export { createServer } from "./lib/server.ts";
export { useQuery } from "./lib/query.ts";

export { State };

export declare type StateInit<T extends any> =
  | Iterable<[string, T]>
  | Map<string, T>
  | [string, T][]
  | Record<string, T>;

export declare interface TContext<T = any> {
  state: State<T>;
}

export declare interface ElementParams {
  selector?: string;
}

export declare interface PageParams {
  url?: string;
  source?: string;
}

export declare interface TextParams extends ElementParams {
  trim?: boolean;
}

export declare interface AttrParams {
  name?: string;
  trim?: boolean;
}

export declare interface IndexParams {
  parent?: string;
}

export declare interface AllParams
  extends PageParams, IndexParams, ElementParams, TextParams, AttrParams {
  attr?: string;
}

export declare type TParams = Partial<AllParams>;

export declare type Variables = { [key: string]: any };

export declare interface QueryOptions {
  concurrency?: number;
  fetch_options?: RequestInit;
  variables?: Variables;
  operationName?: string;
}

export declare interface IOptional {
  endpoint?: string;
}

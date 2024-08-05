/// <reference lib="es2022" />
/// <reference lib="dom" />
/// <reference lib="deno.window" />
/// <reference lib="deno.ns" />
/// <reference no-default-lib="true" />

export {
  type Element,
  GraphQLBoolean,
  type GraphQLFieldConfigMap,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
} from "../../deps.ts";

export { selector } from "../selector.ts";
export { getAttributeOfElement } from "../helpers.ts";
export { TElement } from "../element.ts";
export { TDocument } from "../document.ts";
export { TNode } from "../node.ts";
export { State } from "../state.ts";

export declare type StateInit<T extends any> =
  | Iterable<[string, T]>
  | Map<string, T>
  | [string, T][]
  | Record<string, T>;

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
}

export declare interface IndexParams {
  parent?: string;
}

export declare interface AllParams
  extends PageParams, IndexParams, ElementParams, TextParams, AttrParams {
  attr?: string;
}

export declare type TParams = Partial<AllParams>;

export declare interface TContext<T = any> {
  state: import("../state.ts").State<T>;
}

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

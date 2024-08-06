import { Element, type GraphQLFieldConfigMap } from "../deps.ts";
import * as $shared from "./fields/_shared.ts";

export const shared: GraphQLFieldConfigMap<Element, any> = {
  ...($shared as unknown as GraphQLFieldConfigMap<Element, any>),
};

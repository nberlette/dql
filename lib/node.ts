import {
  Element,
  GraphQLInterfaceType,
  type GraphQLInterfaceTypeConfig,
} from "~/deps.ts";
import { shared } from "./shared.ts";

export const TNode = new GraphQLInterfaceType({
  name: "Node",
  description: "DOM Node implemented as either an Element or a Document.",
  fields: () => ({ ...shared }),
} as GraphQLInterfaceTypeConfig<Element, any>);

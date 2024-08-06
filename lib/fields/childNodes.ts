import { type Element, GraphQLList, TElement } from "./deps.ts";

export const childNodes = {
  type: new GraphQLList(TElement),
  description:
    "Child nodes (not elements) of a selected node, including any text nodes.",
  resolve(element: Element) {
    return Array.from(element.childNodes);
  },
};

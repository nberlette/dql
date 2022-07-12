import {
  GraphQLList,
  TElement,
  type Element,
} from "./deps.ts";

export const children = {
  type: new GraphQLList(TElement),
  description: "Children elements (not nodes) of the selected node.",
  resolve(element: Element) {
    return Array.from(element.children);
  },
};
import {
  type Element,
  type ElementParams,
  GraphQLString,
  selector,
} from "./deps.ts";

export const tag = {
  type: GraphQLString,
  description: "The HTML tag name of the selected DOM node",
  args: { selector },
  resolve(element: Element, { selector }: ElementParams) {
    element = selector ? element.querySelector(selector)! : element;
    return element?.tagName ?? null;
  },
};

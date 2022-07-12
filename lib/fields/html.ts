import { GraphQLString, selector } from "./deps.ts";

export const html = {
  type: GraphQLString,
  description: "The outerHTML content of the selected DOM node",
  args: { selector },
  resolve(element: Element, { selector }: ElementParams) {
    element = selector ? element.querySelector(selector)! : element;
    return element && element.outerHTML;
  },
};

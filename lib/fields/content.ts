import { ElementParams, GraphQLString, selector } from "./deps.ts";

export const content = {
  type: GraphQLString,
  description: "The innerHTML content of the selected DOM node",
  args: { selector },
  resolve(element: Element, { selector }: ElementParams) {
    element = selector ? element.querySelector(selector)! : element;
    return element && element.innerHTML;
  },
}

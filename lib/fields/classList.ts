import {
  type Element,
  type ElementParams,
  GraphQLList,
  GraphQLString,
  selector,
} from "./deps.ts";

export const classList = {
  type: new GraphQLList(GraphQLString),
  description: "An array of CSS classes extracted from the selected node.",
  args: {
    selector,
  },
  resolve(element: Element, { selector }: ElementParams) {
    element = selector ? element.querySelector(selector)! : element;
    if (element == null) return null;
    return [...(element?.classList.values() ?? [])];
  },
};

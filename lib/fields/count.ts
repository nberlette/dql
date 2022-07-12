import {
  type Element,
  type ElementParams,
  GraphQLInt,
  selector,
} from "./deps.ts";

export const count = {
  type: GraphQLInt,
  description:
    "Returns the number of DOM nodes that match the given selector, or 0 if no nodes match.",
  args: { selector },
  resolve(element: Element, { selector }: ElementParams) {
    if (!selector) return 0;

    return Array.from(element.querySelectorAll(selector)).length ?? 0;
  },
};

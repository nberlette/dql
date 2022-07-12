import { GraphQLBoolean, selector, type Element, type ElementParams } from "./deps.ts";
export const has = {
  type: GraphQLBoolean,
  description:
    "Returns true if an element with the given selector exists, otherwise false.",
  args: { selector },
  resolve(element: Element, { selector }: ElementParams) {
    return !!element.querySelector(selector!);
  },
};

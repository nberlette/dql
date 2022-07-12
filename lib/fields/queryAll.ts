import {
  GraphQLList,
  TElement,
  selector,
  type Element,
  type ElementParams,
} from "./deps.ts";

export const queryAll = {
  type: new GraphQLList(TElement),
  description:
    "Equivalent to `Element.querySelectorAll`. The selectors of any nested queries will be scoped to the resulting elements.",
  args: { selector },
  resolve(element: Element, { selector }: ElementParams) {
    return Array.from(element.querySelectorAll(selector!));
  },
};
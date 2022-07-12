import {
  GraphQLList,
  TElement,
  type Element,
} from "./deps.ts";

export const siblings = {
  type: new GraphQLList(TElement),
  description:
    "All elements at the same level in the tree as the current element, as well as the element itself. Equivalent to `Element.parentElement.children`.",
  resolve(element: Element) {
    const parent = element.parentElement;
    if (parent == null) return [element];

    return Array.from(parent.children);
  },
};

import { type Element, TElement } from "./deps.ts";

export const previous = {
  type: TElement,
  description:
    "Current Element's previous sibling, including any text nodes. Equivalent to `Node.previousSibling`.",
  resolve(element: Element) {
    return element.previousSibling;
  },
};

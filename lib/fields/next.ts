import { type Element, TElement } from "./deps.ts";

export const next = {
  type: TElement,
  description:
    "Current element's next sibling, including any text nodes. Equivalent to `Node.nextSibling`.",
  resolve(element: Element) {
    return element.nextSibling;
  },
};

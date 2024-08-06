import { type Element, TElement } from "./deps.ts";

export const parent = {
  type: TElement,
  description: "Parent Element of the selected node.",
  resolve(element: Element) {
    return element.parentElement;
  },
};

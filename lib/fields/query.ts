import {
  type Element,
  type ElementParams,
  selector,
  TElement,
} from "./deps.ts";

export const query = {
  type: TElement,
  description:
    "Equivalent to `Element.querySelector`. The selectors of any nested queries will be scoped to the resulting element.",
  args: { selector },
  resolve(element: Element, { selector }: ElementParams) {
    return element.querySelector(selector!);
  },
};

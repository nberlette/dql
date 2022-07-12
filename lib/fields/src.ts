import {
  type Element,
  getAttributeOfElement,
  GraphQLBoolean,
  GraphQLString,
  selector,
  type TextParams,
} from "./deps.ts";

export const src = {
  type: GraphQLString,
  description: "Shorthand for `attr(name: 'src')`",
  args: {
    selector,
    trim: {
      type: GraphQLBoolean,
      description:
        "Trim any leading and trailing whitespace from the value (optional, default: false)",
      defaultValue: false,
    },
  },
  resolve(element: Element, { selector, trim }: TextParams) {
    element = selector ? element.querySelector(selector)! : element;
    if (element == null) return null;

    return getAttributeOfElement(element, "src", trim);
  },
};

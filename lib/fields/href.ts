import {
  type Element,
  getAttributeOfElement,
  GraphQLBoolean,
  GraphQLString,
  selector,
  type TextParams,
} from "./deps.ts";

export const href = {
  type: GraphQLString,
  description: "Shorthand for `attr(name: 'href')`",
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
    return getAttributeOfElement(element, "href", trim);
  },
};

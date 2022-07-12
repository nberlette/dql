import {
  GraphQLString,
  GraphQLBoolean,
  getAttributeOfElement,
  selector,
  type Element,
  type TextParams,
} from "./deps.ts";

export const className = {
  type: GraphQLString,
  description:
    "The class attribute of the selected node, if any exists. Formatted as a space-separated list of CSS class names.",
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

    return getAttributeOfElement(element, "class", trim);
  },
};

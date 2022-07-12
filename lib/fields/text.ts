import {
  type Element,
  GraphQLBoolean,
  GraphQLString,
  selector,
  type TextParams,
} from "./deps.ts";

export const text = {
  type: GraphQLString,
  description: "The text content of the selected DOM node",
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
    const result = element && element.textContent;
    return (trim) ? (result ?? "").trim() : result;
  },
};

import {
  Element,
  getAttributeOfElement,
  GraphQLBoolean,
  GraphQLNonNull,
  GraphQLString,
  selector,
} from "./deps.ts";

export const attr = {
  type: GraphQLString,
  description:
    "The value of a given attribute from the selected node (`href`, `src`, etc.), if it exists.",
  args: {
    selector,
    name: {
      type: new GraphQLNonNull(GraphQLString),
      description: "The name of the attribute",
    },
    trim: {
      type: GraphQLBoolean,
      description:
        "Trim any leading and trailing whitespace from the value (optional, default: false)",
      defaultValue: false,
    },
  },
  resolve(element: Element, { selector, name, trim }: TParams) {
    element = selector ? element.querySelector(selector)! : element;
    return getAttributeOfElement(element, name as string, trim);
  },
};

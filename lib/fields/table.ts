import {
  type Element,
  GraphQLBoolean,
  GraphQLList,
  GraphQLString,
  selector,
  type TextParams,
} from "./deps.ts";

export const table = {
  type: new GraphQLList(new GraphQLList(GraphQLString)),
  description:
    "Returns a two-dimensional array representing an HTML table element's contents. The first level is a list of rows (`<tr>`), and each row is an array of cell (`<td>`) contents.",
  args: {
    selector,
    trim: {
      type: GraphQLBoolean,
      description:
        "Trim any leading and trailing whitespace from the values (optional, default: false)",
      defaultValue: false,
    },
  },
  resolve(element: Element, { selector, trim }: TextParams) {
    element = selector ? element.querySelector(selector)! : element;

    const result = element && Array.from(
      element.querySelectorAll("tr"),
      (row) =>
        Array.from(
          (row as Element).querySelectorAll("td"),
          (td) => (trim ? td.textContent.trim() : td.textContent),
        ),
    );

    return result.filter(Boolean).filter((row) => row.length > 0);
  },
};

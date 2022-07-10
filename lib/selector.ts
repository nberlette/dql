import { GraphQLString } from "../deps.ts";

export const selector = {
  type: GraphQLString,
  description:
    "Valid CSS selector to query one or more nodes from the DOM. ([docs](https://developer.mozilla.org/en-US/docs/Learn/CSS/Introduction_to_CSS/Selectors))",
};

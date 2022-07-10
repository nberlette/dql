import { GraphQLString } from "../deps.ts";

export const selector = {
  type: GraphQLString,
  description: "A valid CSS selector to query elements from the document DOM.",
};

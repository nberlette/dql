import {
  Element,
  GraphQLObjectType,
  type GraphQLObjectTypeConfig,
  GraphQLString,
} from "../deps.ts";
import { shared } from "./fields.ts";
import { TNode } from "./node.ts";
import { getAttributeOfElement } from "./helpers.ts";

export const TDocument = new GraphQLObjectType({
  name: "Document",
  description: "Document, the root of the DOM tree.",
  interfaces: [TNode],
  fields: () => ({
    ...shared,
    title: {
      type: GraphQLString,
      description: "Retrieves the document title.",
      resolve(element: Element) {
        return element?.ownerDocument?.title;
      },
    },
    meta: {
      type: GraphQLString,
      description:
        "Retrieves metadata from a named meta tag (if it exists), contained in the document head.",
      args: {
        name: {
          type: GraphQLString,
          description:
            "The name or property value of the meta tag. (e.g. 'og:image')",
        },
      },
      resolve(element: Element, { name }) {
        let meta = element?.querySelector(`meta[name='${name}']`);

        if (!meta) {
          meta = element?.querySelector(`meta[property='${name}']`);
        }
        try {
          return getAttributeOfElement(meta!, "content");
        } catch {
          return null;
        }
      },
    },
  }),
} as GraphQLObjectTypeConfig<Element, any>);

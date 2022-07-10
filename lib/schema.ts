import {
  DOMParser,
  GraphQLObjectType,
  type GraphQLObjectTypeConfig,
  GraphQLSchema,
  GraphQLString,
} from "../deps.ts";
import { TDocument } from "./document.ts";

export const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "Query",
    fields: () => ({
      page: {
        type: TDocument,
        args: {
          url: {
            type: GraphQLString,
            description: "A URL to fetch the HTML source from.",
          },
          source: {
            type: GraphQLString,
            description:
              "A string containing HTML to be used as the source document.",
          },
        },
        async resolve(_, { url, source }: PageParams, context) {
          if (!url && !source) {
            throw new Error(
              "You need to provide either a URL or a HTML source string.",
            );
          }

          if (url) {
            const options: RequestInit = context.state.get("fetch_options");
            source = await (await fetch(url, options)).text();
            context.state.set(["base", "url"], url);
          } else {
            context.state.set("base", "");
          }
          const dom = new DOMParser().parseFromString(source!, "text/html")!;
          context.state.set("document", dom.documentElement);
          return dom.documentElement;
        },
      },
    }),
  } as GraphQLObjectTypeConfig<Record<any, any>, TContext>),
});

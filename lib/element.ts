import {
  DOMParser,
  Element,
  GraphQLObjectType,
  type GraphQLObjectTypeConfig,
  GraphQLString,
  PQueue,
} from "../deps.ts";
import { getAttributeOfElement, resolveURL } from "./helpers.ts";
import { TNode } from "./node.ts";
import { TDocument } from "./document.ts";
import { selector } from "./selector.ts";
import { shared } from "./shared.ts";

export const TElement = new GraphQLObjectType({
  name: "Element",
  description: "A DOM element.",
  interfaces: [TNode],
  fields: () => ({
    ...shared,
    visit: {
      type: TDocument,
      description:
        "If the element is a link, visit the page linked to in the href attribute.",
      async resolve(element: Element, _, context) {
        const href = element.getAttribute("href");
        const base_url: string = context.state.get("base");

        if (href == null) {
          return null;
        }

        let url = href;

        if (base_url) {
          url = resolveURL(base_url, href);
          context.state.set("url", url);
        }

        const options: RequestInit = context.state.get("fetch_options");
        const html = await (context.state.get("queue") as PQueue).add(() =>
          fetch(url, options).then((res) => res.text())
        );
        const dom = new DOMParser().parseFromString(html, "text/html");

        return dom?.documentElement;
      },
    },
    visit_custom: {
      type: TDocument,
      description:
        "If the element is a link, visit the page linked to in the href attribute.",
      args: {
        selector,
        attr: {
          type: GraphQLString,
          description: "attribute name",
        },
      },
      async resolve(element: Element, { selector, attr }: TParams, context) {
        const base_url: string = context.state.get("base");

        element = selector ? element.querySelector(selector)! : element;

        if (element == null) return null;
        if (attr == null) {
          attr = "href";
        }

        const href = getAttributeOfElement(element, attr);

        if (href == null) return null;
        let url = href;

        if (base_url) {
          url = resolveURL(base_url, href);
          context.state.set("url", url);
        }

        const html = await (context.state.get("queue") as PQueue).add(() =>
          fetch(url).then((res) => res.text())
        );
        const dom = new DOMParser().parseFromString(html, "text/html");
        context.state.set("document", dom?.documentElement);
        return dom?.documentElement;
      },
    },
  }),
} as GraphQLObjectTypeConfig<Element, TContext>);

import {
  Element,
  GraphQLBoolean,
  type GraphQLFieldConfigMap,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
} from "~/deps.ts";
import { selector } from "./selector.ts";
import { getAttributeOfElement } from "./helpers.ts";
import { TElement } from "./element.ts";

export const shared: GraphQLFieldConfigMap<Element, any> = {
  index: {
    type: GraphQLInt,
    description: "Node index from parent element",
    args: { parent: selector },
    resolve(element: Element, { parent }: IndexParams, context: TContext) {
      if (parent) {
        const document = context.state.get<Element>("document");
        const nodes = Array.from(document.querySelectorAll(parent) ?? []);
        let index = -1;

        for (const node of nodes) {
          let elementParent = element.parentNode;
          while (
            elementParent && node.compareDocumentPosition(elementParent) != 0
          ) {
            if (!elementParent) break;
            elementParent = elementParent.parentNode!;
          }
          if (!elementParent) continue;
          if (index != -1) return index;
          index = nodes.indexOf(elementParent);
        }
        return index;
      }

      const nodes = Array.from(element.parentElement?.childNodes ?? []);
      return nodes.indexOf(element) ?? -1;
    },
  },
  content: {
    type: GraphQLString,
    description: "The HTML content of the subnodes",
    args: { selector },
    resolve(element, { selector }: ElementParams) {
      element = selector ? element.querySelector(selector)! : element;
      return element && element.innerHTML;
    },
  },
  html: {
    type: GraphQLString,
    description: "The HTML content of the selected DOM node",
    args: { selector },
    resolve(element: Element, { selector }: ElementParams) {
      element = selector ? element.querySelector(selector)! : element;

      return element && element.outerHTML;
    },
  },
  text: {
    type: GraphQLString,
    description: "The text content of the selected DOM node",
    args: {
      selector,
      trim: {
        type: GraphQLBoolean,
        description: "Optional text trim. default: false",
        defaultValue: false,
      },
    },
    resolve(element: Element, { selector, trim }: TextParams) {
      element = selector ? element.querySelector(selector)! : element;
      const result = element && element.textContent;
      return (trim) ? (result ?? "").trim() : result;
    },
  },
  table: {
    type: new GraphQLList(new GraphQLList(GraphQLString)),
    description: "Get value from table rows",
    args: {
      selector,
    },
    resolve(element: Element, { selector }: ElementParams) {
      element = selector ? element.querySelector(selector)! : element;

      const result = element && Array.from(
        element.querySelectorAll("tr"),
      ).map((row) =>
        Array.from((row as Element).querySelectorAll("td")).map((td) =>
          td.textContent.trim()
        )
      );

      return result.filter((row) => row.length > 0);
    },
  },
  tag: {
    type: GraphQLString,
    description: "The tag name of the selected DOM node",
    args: { selector },
    resolve(element: Element, { selector }: ElementParams) {
      element = selector ? element.querySelector(selector)! : element;

      return element && element.tagName;
    },
  },
  attr: {
    type: GraphQLString,
    description: "An attribute of the selected node (eg. `href`, `src`, etc.).",
    args: {
      selector,
      name: {
        type: new GraphQLNonNull(GraphQLString),
        description: "The name of the attribute",
      },
    },
    resolve(element: Element, { selector, name }: TParams) {
      element = selector ? element.querySelector(selector)! : element;
      if (element == null || name == null) {
        return null;
      }

      const attribute = element.getAttribute(name);
      if (attribute == null) {
        return null;
      }

      return attribute;
    },
  },
  href: {
    type: GraphQLString,
    description: "An href attribute of the selected node.",
    args: {
      selector,
    },
    resolve(element: Element, { selector }: ElementParams) {
      element = selector ? element.querySelector(selector)! : element;
      if (element == null) return null;

      return getAttributeOfElement(element, "href");
    },
  },
  src: {
    type: GraphQLString,
    description: "An src attribute of the selected node.",
    args: {
      selector,
    },
    resolve(element: Element, { selector }: ElementParams) {
      element = selector ? element.querySelector(selector)! : element;
      if (element == null) return null;

      return getAttributeOfElement(element, "src");
    },
  },
  class: {
    type: GraphQLString,
    description: "An class attribute of the selected node.",
    args: {
      selector,
    },
    resolve(element: Element, { selector }: TParams) {
      element = selector ? element.querySelector(selector)! : element;
      if (element == null) return null;

      return getAttributeOfElement(element, "class");
    },
  },
  classList: {
    type: new GraphQLList(GraphQLString),
    description: "An array of class from the selected node class attribute.",
    args: {
      selector,
    },
    resolve(element: Element, { selector }: ElementParams) {
      element = selector ? element.querySelector(selector)! : element;
      if (element == null) return null;

      const attribute = getAttributeOfElement(element, "class");
      if (attribute == null) return null;

      return attribute.split(" ");
    },
  },
  has: {
    type: GraphQLBoolean,
    description: "Returns true if an element with the given selector exists.",
    args: { selector },
    resolve(element: Element, { selector }: ElementParams) {
      return !!element.querySelector(selector!);
    },
  },
  count: {
    type: GraphQLInt,
    description: "The count of the selected DOM node",
    args: { selector },
    resolve(element: Element, { selector }: ElementParams) {
      if (!selector) return 0;

      return Array.from(element.querySelectorAll(selector)).length ?? 0;
    },
  },
  query: {
    type: TElement,
    description:
      "Equivalent to [Element.querySelector](https://developer.mozilla.org/en-US/docs/Web/API/Element/querySelector). The selectors of any nested queries will be scoped to the resulting element.",
    args: { selector },
    resolve(element: Element, { selector }: ElementParams) {
      return element.querySelector(selector!);
    },
  },
  queryAll: {
    type: new GraphQLList(TElement),
    description:
      "Equivalent to [Element.querySelectorAll](https://developer.mozilla.org/en-US/docs/Web/API/Element/querySelectorAll). The selectors of any nested queries will be scoped to the resulting elements.",
    args: { selector },
    resolve(element: Element, { selector }: ElementParams) {
      return Array.from(element.querySelectorAll(selector!));
    },
  },
  children: {
    type: new GraphQLList(TElement),
    description: "An element's child elements.",
    resolve(element: Element) {
      return Array.from(element.children);
    },
  },
  childNodes: {
    type: new GraphQLList(TElement),
    description: "An element's child nodes. Includes text nodes.",
    resolve(element: Element) {
      return Array.from(element.childNodes);
    },
  },
  parent: {
    type: TElement,
    description: "An element's parent element.",
    resolve(element: Element) {
      return element.parentElement;
    },
  },
  siblings: {
    type: new GraphQLList(TElement),
    description:
      "All elements which are at the same level in the tree as the current element, ie. the children of the current element's parent. Includes the current element.",
    resolve(element: Element) {
      const parent = element.parentElement;
      if (parent == null) return [element];

      return Array.from(parent.children);
    },
  },
  next: {
    type: TElement,
    description:
      "The current element's next sibling. Includes text nodes. Equivalent to [Node.nextSibling](https://developer.mozilla.org/en-US/docs/Web/API/Node/nextSibling).",
    resolve(element: Element) {
      return element.nextSibling;
    },
  },
  nextAll: {
    type: new GraphQLList(TElement),
    description: "All of the current element's next siblings",
    resolve(element: Element) {
      const siblings = [];
      for (
        let next = element.nextSibling;
        next != null;
        next = next.nextSibling
      ) {
        siblings.push(next);
      }
      return siblings;
    },
  },
  previous: {
    type: TElement,
    description:
      "The current element's previous sibling. Includes text nodes. Equivalent to [Node.previousSibling](https://developer.mozilla.org/en-US/docs/Web/API/Node/nextSibling).",
    resolve(element: Element) {
      return element.previousSibling;
    },
  },
  previousAll: {
    type: new GraphQLList(TElement),
    description: "All of the current element's previous siblings",
    resolve(element: Element) {
      const siblings = [];
      for (
        let previous = element.previousSibling;
        previous != null;
        previous = previous.previousSibling
      ) {
        siblings.push(previous);
      }
      siblings.reverse();
      return siblings;
    },
  },
};

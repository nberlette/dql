import {
  Element,
  GraphQLBoolean,
  type GraphQLFieldConfigMap,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
} from "../deps.ts";
import { selector } from "./selector.ts";
import { getAttributeOfElement } from "./helpers.ts";
import { TElement } from "./element.ts";

export const shared: GraphQLFieldConfigMap<Element, any> = {
  index: {
    type: GraphQLInt,
    description: "The node index number of the element (starting from 0).",
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
    description: "The innerHTML content of the selected DOM node",
    args: { selector },
    resolve(element, { selector }: ElementParams) {
      element = selector ? element.querySelector(selector)! : element;
      return element && element.innerHTML;
    },
  },
  html: {
    type: GraphQLString,
    description: "The outerHTML content of the selected DOM node",
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
  },
  table: {
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
  },
  tag: {
    type: GraphQLString,
    description: "The HTML tag name of the selected DOM node",
    args: { selector },
    resolve(element: Element, { selector }: ElementParams) {
      element = selector ? element.querySelector(selector)! : element;
      return element?.tagName ?? null;
    },
  },
  attr: {
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
  },
  href: {
    type: GraphQLString,
    description: "Shorthand for `attr(name: 'href')`",
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
      return getAttributeOfElement(element, "href", trim);
    },
  },
  src: {
    type: GraphQLString,
    description: "Shorthand for `attr(name: 'src')`",
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

      return getAttributeOfElement(element, "src", trim);
    },
  },
  class: {
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
  },
  classList: {
    type: new GraphQLList(GraphQLString),
    description: "An array of CSS classes extracted from the selected node.",
    args: {
      selector,
    },
    resolve(element: Element, { selector }: ElementParams) {
      element = selector ? element.querySelector(selector)! : element;
      if (element == null) return null;
      return [...(element?.classList.values() ?? [])];
    },
  },
  has: {
    type: GraphQLBoolean,
    description:
      "Returns true if an element with the given selector exists, otherwise false.",
    args: { selector },
    resolve(element: Element, { selector }: ElementParams) {
      return !!element.querySelector(selector!);
    },
  },
  count: {
    type: GraphQLInt,
    description:
      "Returns the number of DOM nodes that match the given selector, or 0 if no nodes match.",
    args: { selector },
    resolve(element: Element, { selector }: ElementParams) {
      if (!selector) return 0;

      return Array.from(element.querySelectorAll(selector)).length ?? 0;
    },
  },
  query: {
    type: TElement,
    description:
      "Equivalent to `Element.querySelector`. The selectors of any nested queries will be scoped to the resulting element.",
    args: { selector },
    resolve(element: Element, { selector }: ElementParams) {
      return element.querySelector(selector!);
    },
  },
  queryAll: {
    type: new GraphQLList(TElement),
    description:
      "Equivalent to `Element.querySelectorAll`. The selectors of any nested queries will be scoped to the resulting elements.",
    args: { selector },
    resolve(element: Element, { selector }: ElementParams) {
      return Array.from(element.querySelectorAll(selector!));
    },
  },
  children: {
    type: new GraphQLList(TElement),
    description: "Children elements (not nodes) of the selected node.",
    resolve(element: Element) {
      return Array.from(element.children);
    },
  },
  childNodes: {
    type: new GraphQLList(TElement),
    description:
      "Child nodes (not elements) of a selected node, including any text nodes.",
    resolve(element: Element) {
      return Array.from(element.childNodes);
    },
  },
  parent: {
    type: TElement,
    description: "Parent Element of the selected node.",
    resolve(element: Element) {
      return element.parentElement;
    },
  },
  siblings: {
    type: new GraphQLList(TElement),
    description:
      "All elements at the same level in the tree as the current element, as well as the element itself. Equivalent to `Element.parentElement.children`.",
    resolve(element: Element) {
      const parent = element.parentElement;
      if (parent == null) return [element];

      return Array.from(parent.children);
    },
  },
  next: {
    type: TElement,
    description:
      "Current element's next sibling, including any text nodes. Equivalent to `Node.nextSibling`.",
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
      "Current Element's previous sibling, including any text nodes. Equivalent to `Node.previousSibling`.",
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

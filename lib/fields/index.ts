import { Element, GraphQLInt, selector } from "./deps.ts";

export const index = {
  type: GraphQLInt,
  description: "The node index number of the element (starting from 0).",
  args: { parent: selector },
  resolve(element: Element, { parent }: IndexParams, context: TContext) {
    if (parent) {
      const document = context.state.get<Element>("document");
      const nodes = Array.from((document.querySelectorAll(parent) ?? []));
      let index = -1;

      for (const node of nodes) {
        let elementParent = element.parentNode;
        while (elementParent && (
          node.compareDocumentPosition(elementParent) != 0
        )) {
          if (!elementParent) break;
          elementParent = elementParent.parentNode!;
        }
        if (!elementParent) continue;
        if (index > -1) return index;
        index = nodes.indexOf(elementParent);
      }
      return index;
    }

    const nodes = Array.from(element.parentElement?.childNodes ?? []);
    return nodes.indexOf(element) ?? -1;
  },
};

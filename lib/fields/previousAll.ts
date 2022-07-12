import { GraphQLList, TElement, type Element } from "./deps.ts";

export const previousAll = {
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
};

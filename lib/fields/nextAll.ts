import { GraphQLList, TElement, type Element } from "./deps.ts";

export const nextAll = {
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
};

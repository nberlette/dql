import { Element } from "../deps.ts";

export function getAttributeOfElement(element: Element, name: string) {
  const attribute = element.getAttribute(name);
  if (attribute == null) return null;

  return attribute;
}

export function resolveURL(base: string, url: string) {
  const uri = new URL(url, base);

  return uri.toString();
}

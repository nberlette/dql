import { Element } from "../deps.ts";

export function getAttributeOfElement(
  element: Element,
  name?: string,
  trim = false,
): string | null {
  if (element == null || name == null) {
    return null;
  }
  const attribute = element.getAttribute(name);
  if (attribute == null) {
    return null;
  }
  return trim ? attribute.trim() : attribute;
}

export function getAttributesOfElement(element: Element, trim = false) {
  if (element == null) {
    return null;
  }
  const names = element.getAttributeNames();
  if (names == null || names.length === 0) {
    return {};
  }
  return Object.fromEntries(names.map(
    (attr) => [attr, getAttributeOfElement(element, attr, trim)],
  ));
}

export function resolveURL(base: string, url: string) {
  const uri = new URL(url, base);
  return uri.toString();
}

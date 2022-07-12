import { assertEquals, resolveURL, State } from "./deps.ts";

Deno.test("#1:  resolveURL", () => {
  const base = "https://berlette.com";

  const url = resolveURL(base, "favicon.svg");

  assertEquals(url, "https://berlette.com/favicon.svg");
});

Deno.test("#2:  resolveURL with domain", () => {
  const base = "https://berlette.com";

  const url = resolveURL(base, "https://berlette.com/favicon.svg");

  assertEquals(url, "https://berlette.com/favicon.svg");
});

Deno.test("#3:  resolveURL with different domain", () => {
  const base = "https://berlette.com";

  const url = resolveURL(base, "https://cdn.berlette.com/brand/logo.svg");

  assertEquals(url, "https://cdn.berlette.com/brand/logo.svg");
});

Deno.test("#4:  state - booleans", () => {
  const state = new State<boolean>();

  state.set("test-state", true);
  state.set("test-state", false);
  state.set("test-state", true);

  assertEquals(state.get("test-state"), true);
});

Deno.test("#5:  state - strings", () => {
  const state = new State<string>();

  state.set("test-state", "test");
  state.set("test-state-2", "test2");
});

Deno.test("#6:  state - length", () => {
  const state = new State([
    ["test-state", "test-value"],
    ["test-state-2", "test-value-2"],
  ]);
  assertEquals(state.length, 2);
  // Some methods and accessors are chainable:
  assertEquals(state.delete("test-state").length, 1);
});

Deno.test("#7:  state - set/delete multiple values", () => {
  const state = new State();
  state.set(["test-1", "test-2", "test-3"], "test-value");
  assertEquals(state.length, 3);
  assertEquals(state.delete(["test-1", "test-3"]).length, 1);
});

Deno.test("#8:  state - set values with an object", () => {
  const state = new State();
  state.set({ "test-2": "test-value-2", "test-3": "test-value-3" });
  assertEquals(state.get("test-2"), "test-value-2");
  assertEquals(state.get("test-3"), "test-value-3");
});

Deno.test("#9:  state - get multiple values", () => {
  const state = new State({
    "test-1": "test-value-1",
    "test-2": "test-value-2",
    "test-3": "test-value-3",
  });
  assertEquals(state.get(["test-1", "test-2", "test-3"]), [
    "test-value-1",
    "test-value-2",
    "test-value-3",
  ]);
  assertEquals(state.length, 3);
});

Deno.test("#10: state - get multiple values with a default", () => {
  const state = new State({
    "test-1": "test-value-1",
    "test-2": "test-value-2",
  });
  assertEquals(state.get(["test-1", "test-2", "test-3"], "test-default"), [
    "test-value-1",
    "test-value-2",
    "test-default",
  ]);
});

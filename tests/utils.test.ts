import { assertEquals, resolveURL, State } from "./deps.ts";

Deno.test("resolve url #1", () => {
  const base = "https://nyan.web.id";

  const url = resolveURL(base, "screenshot.png");

  assertEquals(url, "https://nyan.web.id/screenshot.png");
});

Deno.test("resolve url with domain #2", () => {
  const base = "https://nyan.web.id";

  const url = resolveURL(base, "https://nyan.web.id/screenshot.png");

  assertEquals(url, "https://nyan.web.id/screenshot.png");
});

Deno.test("resolve different url domain #3", () => {
  const base = "https://nyan.web.id";

  const url = resolveURL(base, "https://cdn.nyan.web.id/screenshot.png");

  assertEquals(url, "https://cdn.nyan.web.id/screenshot.png");
});

Deno.test("state #4", () => {
  const state = new State<boolean>();

  state.set("test-state", true);
  state.set("test-state", false);
  state.set("test-state", true);

  assertEquals(state.get("test-state"), true);
});

Deno.test("state null and undefined #5", () => {
  const state = new State<null>();

  state.set("test-state-1", null);
  state.set("test-state-2", undefined);

  assertEquals(state.get("test-state-1"), null);
  assertEquals(state.get("test-state-2"), undefined);
});

Deno.test("state length #1", () => {
  const state = new State([
    ["test-state", "test-value"],
    ["test-state-2", "test-value-2"],
  ]);
  assertEquals(state.length, 2);
  // Some methods and accessors are chainable:
  assertEquals(state.delete("test-state").length, 1);
});

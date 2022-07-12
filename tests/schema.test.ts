import { assertEquals, assertNotEquals, useQuery } from "./deps.ts";

const DEFAULT_TEST_OPTIONS = {
  sanitizeOps: false,
  sanitizeResources: false,
};

Deno.test({
  name: "#1:  no args throws errors",
  fn: async () => {
    const query = `{ page { title } }`;

    const response = await useQuery(query);

    assertEquals(
      response && response.errors && response.errors[0].message,
      "You need to provide either a URL or a HTML source string.",
    );
  },
});

Deno.test({
  name: "#2:  title",
  fn: async () => {
    const html =
      `<html><head><title>some title</title></head><body></body></html>`;
    const query = `{ page(source: "${html}") { title } }`;
    const response = await useQuery(query);

    assertEquals("error" in response, false);
    assertEquals(response.data && response.data.page.title, "some title");
  },
  ...DEFAULT_TEST_OPTIONS,
});

Deno.test({
  name: "#3:  fetch from URL",
  fn: async () => {
    const query = `{
      page(url: "https://nyancodeid.github.io/tests/test-3-via-url.html") {
        title
      }
    }`;
    const response = await useQuery(query);

    assertEquals("error" in response, false);
    // assertEquals(response.data && response.data.page.title, "some title");
  },
  ...DEFAULT_TEST_OPTIONS,
});

Deno.test({
  name: "#4:  content",
  fn: async () => {
    const html =
      `<html><head><title>some title</title></head><body>some body</body></html>`;
    const query = `{ page(source: "${html}") { content } }`;

    const response = await useQuery(query);

    assertEquals("error" in response, false);
    assertEquals(
      response.data && response.data.page.content,
      "<head><title>some title</title></head><body>some body</body>",
    );
  },
  ...DEFAULT_TEST_OPTIONS,
});

Deno.test({
  name: "#5:  content with selector",
  fn: async () => {
    const html =
      `<html><head><title>some title</title></head><body><div class=\\"selectme\\"><strong>bad</strong></div></body></html>`;
    const query = `{
      page(source: "${html}") {
        content(selector: ".selectme")
      }
    }`;

    const response = await useQuery(query);

    assertEquals("error" in response, false);
    assertEquals(
      response.data && response.data.page.content,
      "<strong>bad</strong>",
    );
  },
  ...DEFAULT_TEST_OPTIONS,
});

Deno.test({
  name: "#6:  HTML content",
  fn: async () => {
    const html =
      `<html><head><title>some title</title></head><body>some body</body></html>`;
    const query = `{ page(source: "${html}") { html } }`;

    const response = await useQuery(query);

    assertEquals("error" in response, false);
    assertEquals(
      response.data && response.data.page.html,
      html,
    );
  },
  ...DEFAULT_TEST_OPTIONS,
});

Deno.test({
  name: "#7:  HTML content with selector",
  fn: async () => {
    const html =
      `<html><head><title>some title</title></head><body><div class=\\"selectme\\"><strong>bad</strong></div></body></html>`;
    const query = `{
      page(source: "${html}") {
        html(selector: ".selectme")
      }
    }`;

    const response = await useQuery(query);

    assertEquals("error" in response, false);
    assertEquals(
      response.data && response.data.page.html,
      '<div class="selectme"><strong>bad</strong></div>',
    );
  },
  ...DEFAULT_TEST_OPTIONS,
});

Deno.test({
  name: "#8:  text",
  fn: async () => {
    const html =
      `<html><head><title>some title</title></head><body><div class=\\"selectme\\"><strong>bad</strong></div></body></html>`;
    const query = `{
      page(source: "${html}") {
        text
      }
    }`;

    const response = await useQuery(query);

    assertEquals("error" in response, false);
    assertEquals(
      response.data && response.data.page.text,
      "some titlebad",
    );
  },
  ...DEFAULT_TEST_OPTIONS,
});

Deno.test({
  name: "#9:  text with selector",
  fn: async () => {
    const html =
      `<html><head><title>some title</title></head><body><div class=\\"selectme\\"><strong>bad</strong></div></body></html>`;
    const query = `{
      page(source: "${html}") {
        text(selector: ".selectme")
      }
    }`;

    const response = await useQuery(query);

    assertEquals("error" in response, false);
    assertEquals(
      response.data && response.data.page.text,
      "bad",
    );
  },
  ...DEFAULT_TEST_OPTIONS,
});

Deno.test({
  name: "#10: tag",
  fn: async () => {
    const html =
      `<html><head><title>some title</title></head><body><div class=\\"selectme\\"><strong>bad</strong></div></body></html>`;
    const query = `{
      page(source: "${html}") {
        tag
      }
    }`;

    const response = await useQuery(query);

    assertEquals("error" in response, false);
    assertEquals(
      response.data && response.data.page.tag,
      "HTML",
    );
  },
  ...DEFAULT_TEST_OPTIONS,
});

Deno.test({
  name: "#11: tag with selector",
  fn: async () => {
    const html =
      `<html><head><title>some title</title></head><body><div class=\\"selectme\\"><strong>bad</strong></div></body></html>`;
    const query = `{
      page(source: "${html}") {
        tag(selector: ".selectme")
      }
    }`;

    const response = await useQuery(query);

    assertEquals("error" in response, false);
    assertEquals(
      response.data && response.data.page.tag,
      "DIV",
    );
  },
  ...DEFAULT_TEST_OPTIONS,
});

Deno.test({
  name: "#12: attr",
  fn: async () => {
    const html =
      `<html style=\\"background: red;\\"><head><title>some title</title></head><body><div class=\\"selectme\\"><strong>bad</strong></div></body></html>`;
    const query = `{
      page(source: "${html}") {
        attr(name: "style")
      }
    }`;

    const response = await useQuery(query);

    assertEquals("error" in response, false);
    assertEquals(
      response.data && response.data.page.attr,
      "background: red;",
    );
  },
  ...DEFAULT_TEST_OPTIONS,
});

Deno.test({
  name: "#13: non existing attribute",
  fn: async () => {
    const html =
      `<html style=\\"background: red;\\"><head><title>some title</title></head><body><div class=\\"selectme\\"><strong>bad</strong></div></body></html>`;
    const query = `{
      page(source: "${html}") {
        attr(name: "asdf")
      }
    }`;

    const response = await useQuery(query);

    assertEquals("error" in response, false);
    assertEquals(
      response.data && response.data.page.attr,
      null,
    );
  },
  ...DEFAULT_TEST_OPTIONS,
});

Deno.test({
  name: "#14: attribute with selector",
  fn: async () => {
    const html =
      `<html><head><title>some title</title></head><body><div class=\\"selectme\\"><strong>bad</strong></div></body></html>`;
    const query = `{
      page(source: "${html}") {
        attr(selector: ".selectme", name: "class")
      }
    }`;

    const response = await useQuery(query);

    assertEquals("error" in response, false);
    assertEquals(
      response.data && response.data.page.attr,
      "selectme",
    );
  },
  ...DEFAULT_TEST_OPTIONS,
});

Deno.test({
  name: "#15: has",
  fn: async () => {
    const html =
      `<html><head><title>some title</title></head><body><div class=\\"one\\"><strong>one</strong></div><div class=\\"two\\"><strong>two</strong></div></body></html>`;
    const query = `{
      page(source: "${html}") {
        firstDiv: query(selector: "div") {
          isStrong: has(selector: "strong")
        }
      }
    }`;

    const response = await useQuery(query);

    assertEquals("error" in response, false);
    assertEquals(
      response.data && response.data.page.firstDiv.isStrong,
      true,
    );
  },
  ...DEFAULT_TEST_OPTIONS,
});

Deno.test({
  name: "#16: has not",
  fn: async () => {
    const html =
      `<html><head><title>some title</title></head><body><div class=\\"one\\"><strong>one</strong></div><div class=\\"two\\"><strong>two</strong></div></body></html>`;
    const query = `{
      page(source: "${html}") {
        firstDiv: query(selector: "div") {
          isWeak: has(selector: "weak")
        }
      }
    }`;

    const response = await useQuery(query);

    assertEquals("error" in response, false);
    assertEquals(
      response.data && !response.data.page.firstDiv.isWeak,
      true,
    );
  },
  ...DEFAULT_TEST_OPTIONS,
});

Deno.test({
  name: "#17: query",
  fn: async () => {
    const html =
      `<html><head><title>some title</title></head><body><div class=\\"one\\"><strong>one</strong></div><div class=\\"two\\"><strong>two</strong></div></body></html>`;
    const query = `{
      page(source: "${html}") {
        firstDiv: query(selector: "div") {
          text
        }
      }
    }`;

    const response = await useQuery(query);

    assertEquals("error" in response, false);
    assertEquals(
      response.data && response.data.page.firstDiv,
      { text: "one" },
    );
  },
  ...DEFAULT_TEST_OPTIONS,
});

Deno.test({
  name: "#18: queryAll",
  fn: async () => {
    const html =
      `<html><head><title>some title</title></head><body><div class=\\"one\\"><strong>one</strong></div><div class=\\"two\\"><strong>two</strong></div></body></html>`;
    const query = `{
      page(source: "${html}") {
        divs: queryAll(selector: "div") {
          text
        }
      }
    }`;

    const response = await useQuery(query);

    assertEquals("error" in response, false);
    assertEquals(
      response.data && response.data.page.divs,
      [
        { text: "one" },
        { text: "two" },
      ],
    );
  },
  ...DEFAULT_TEST_OPTIONS,
});

Deno.test({
  name: "#19: children",
  fn: async () => {
    const html =
      `<html><head><title>some title</title></head><body><div class=\\"one\\"><strong>one</strong><strong>two</strong></div><div class=\\"two\\"><strong>two</strong><strong>three</strong></div></body></html>`;
    const query = `{
      page(source: "${html}") {
        kids: queryAll(selector: "div") {
          children {
            text
          }
        }
      }
    }`;

    const response = await useQuery(query);

    assertEquals("error" in response, false);
    assertEquals(
      response.data && response.data.page.kids,
      [
        {
          children: [{ text: "one" }, { text: "two" }],
        },
        {
          children: [{ text: "two" }, { text: "three" }],
        },
      ],
    );
  },
  ...DEFAULT_TEST_OPTIONS,
});

Deno.test({
  name: "#20: childNodes",
  fn: async () => {
    const html =
      `<html><head><title>some title</title></head><body><div class=\\"one\\">one<strong>two</strong></div><div class=\\"two\\"><strong>two</strong>amazing<strong>three</strong></div></body></html>`;
    const query = `{
      page(source: "${html}") {
        kids: queryAll(selector: "div") {
          childNodes {
            text
          }
        }
      }
    }`;

    const response = await useQuery(query);

    assertEquals("error" in response, false);
    assertEquals(
      response.data && response.data.page.kids,
      [
        {
          childNodes: [{ text: "one" }, { text: "two" }],
        },
        {
          childNodes: [{ text: "two" }, { text: "amazing" }, { text: "three" }],
        },
      ],
    );
  },
  ...DEFAULT_TEST_OPTIONS,
});

Deno.test({
  name: "#21: parent",
  fn: async () => {
    const html =
      `<html><head><title>some title</title></head><body><div class=\\"selectme\\"><strong>bad</strong></div></body></html>`;
    const query = `{
      page(source: "${html}") {
        query(selector: "strong") {
          parent {
            attr(name: "class")
          }
        }
      }
    }`;

    const response = await useQuery(query);

    assertEquals("error" in response, false);
    assertEquals(
      response.data && response.data.page.query.parent.attr,
      "selectme",
    );
  },
  ...DEFAULT_TEST_OPTIONS,
});

Deno.test({
  name: "#22: siblings",
  fn: async () => {
    const html =
      `<html><head><title>some title</title></head><body><div class=\\"selectme\\"><strong>bad</strong><p>boom</p><span>bap</span></div></body></html>`;
    const query = `{
      page(source: "${html}") {
        query(selector: "strong") {
          siblings {
            text
          }
        }
      }
    }`;

    const response = await useQuery(query);

    assertEquals("error" in response, false);
    assertEquals(
      response.data && response.data.page.query.siblings,
      [
        { text: "bad" },
        { text: "boom" },
        { text: "bap" },
      ],
    );
  },
  ...DEFAULT_TEST_OPTIONS,
});

Deno.test({
  name: "#23: siblings of root is only html",
  fn: async () => {
    const html =
      `<!doctype html><html><head></head><body>nothing to see here</body></html>`;
    const query = `{
      page(source: "${html}") {
        siblings {
          tag
        }
      }
    }`;

    const response = await useQuery(query);

    assertEquals("error" in response, false);
    assertEquals(
      response.data && response.data.page.siblings,
      [{ tag: "HTML" }],
    );
  },
  ...DEFAULT_TEST_OPTIONS,
});

Deno.test({
  name: "#24: next",
  fn: async () => {
    const html =
      `<html><head><title>some title</title></head><body><div class=\\"selectme\\"><strong>bad</strong><p>boom</p><span>bap</span></div></body></html>`;
    const query = `{
      page(source: "${html}") {
        query(selector: "strong") {
          next {
            text
          }
        }
      }
    }`;

    const response = await useQuery(query);

    assertEquals("error" in response, false);
    assertEquals(
      response.data && response.data.page.query.next.text,
      "boom",
    );
  },
  ...DEFAULT_TEST_OPTIONS,
});

Deno.test({
  name: "#25: next - bare text",
  fn: async () => {
    const html =
      `<html><head><title>some title</title></head><body><div class=\\"selectme\\"><strong>bad</strong>bare text<span>bap</span></div></body></html>`;
    const query = `{
      page(source: "${html}") {
        query(selector: "strong") {
          next {
            tag
            text
          }
        }
      }
    }`;

    const response = await useQuery(query);

    assertEquals("error" in response, false);
    assertEquals(
      response.data && response.data.page.query.next.tag,
      null,
    );
    assertEquals(
      response.data && response.data.page.query.next.text,
      "bare text",
    );
  },
  ...DEFAULT_TEST_OPTIONS,
});

Deno.test({
  name: "#26: nextAll",
  fn: async () => {
    const html =
      `<html><head><title>some title</title></head><body><div class=\\"selectme\\"><strong>bad</strong>bare text<span>bap</span></div></body></html>`;
    const query = `{
      page(source: "${html}") {
        query(selector: "strong") {
          nextAll {
            tag
            text
          }
        }
      }
    }`;

    const response = await useQuery(query);

    assertEquals("error" in response, false);
    assertEquals(
      response.data && response.data.page.query.nextAll,
      [
        { tag: null, text: "bare text" },
        { tag: "SPAN", text: "bap" },
      ],
    );
  },
  ...DEFAULT_TEST_OPTIONS,
});

Deno.test({
  name: "#27: previous",
  fn: async () => {
    const html =
      `<html><head><title>some title</title></head><body><div class=\\"selectme\\"><strong>bad</strong><p>boom</p><span>bap</span></div></body></html>`;
    const query = `{
      page(source: "${html}") {
        query(selector: "span") {
          previous {
            text
          }
        }
      }
    }`;

    const response = await useQuery(query);

    assertEquals("error" in response, false);
    assertEquals(
      response.data && response.data.page.query.previous.text,
      "boom",
    );
  },
  ...DEFAULT_TEST_OPTIONS,
});

Deno.test({
  name: "#28: previousAll",
  fn: async () => {
    const html =
      `<html><head><title>some title</title></head><body><div class=\\"selectme\\"><strong>bad</strong>bare text<span>bap</span></div></body></html>`;
    const query = `{
      page(source: "${html}") {
        query(selector: "span") {
          previousAll {
            tag
            text
          }
        }
      }
    }`;

    const response = await useQuery(query);

    assertEquals("error" in response, false);
    assertEquals(
      response.data && response.data.page.query.previousAll,
      [
        { tag: "STRONG", text: "bad" },
        { tag: null, text: "bare text" },
      ],
    );
  },
  ...DEFAULT_TEST_OPTIONS,
});

Deno.test({
  name: "#29: previousAll",
  fn: async () => {
    const html =
      `<html><head><title>some title</title></head><body><div class=\\"selectme\\"><strong>bad</strong>bare text<span>bap</span></div></body></html>`;
    const query = `{
      page(source: "${html}") {
        query(selector: "span") {
          previousAll {
            tag
            text
          }
        }
      }
    }`;

    const response = await useQuery(query);

    assertEquals("error" in response, false);
    assertEquals(
      response.data && response.data.page.query.previousAll,
      [
        { tag: "STRONG", text: "bad" },
        { tag: null, text: "bare text" },
      ],
    );
  },
  ...DEFAULT_TEST_OPTIONS,
});

Deno.test({
  name: "#30: not existing selector",
  fn: async () => {
    const html =
      `<html><head><title>some title</title></head><body><div class=\\"selectme\\"><strong>bad</strong></div></body></html>`;
    const query = `{
      page(source: "${html}") {
        content(selector: ".selectmenot")
      }
    }`;

    const response = await useQuery(query);

    assertEquals("error" in response, false);
    assertEquals(
      response.data && response.data.page.content,
      null,
    );
  },
  ...DEFAULT_TEST_OPTIONS,
});

// Deno.test({
//   name: "#30: visit",
//   fn: async () => {
//     const query = `{
//       page(url: "https://nyancodeid.github.io/tests/test-3-via-url.html") {
//         link: query(selector: "a") {
//           visit {
//             text(selector: "strong")
//           }
//         }
//       }
//     }`;

//     const response = await useQuery(query);

//     assertEquals("error" in response, false);
//     assertEquals(
//       response.data && response.data.page.link.visit.text,
//       "we managed to visit the link!",
//     );
//   },
//   ...DEFAULT_TEST_OPTIONS,
// });

Deno.test({
  name: "#31: count",
  fn: async () => {
    const html =
      `<html><head><title>some title</title></head><body><ul><li>Item 1</li><li>Item 2</li></ul></body></html>`;
    const query = `{
      page(source: "${html}") {
        query(selector: "ul") {
          count(selector: "li")
        }
      }
    }`;

    const response = await useQuery(query);

    assertEquals("error" in response, false);
    assertEquals(
      response.data && response.data.page.query.count,
      2,
    );
  },
  ...DEFAULT_TEST_OPTIONS,
});

Deno.test({
  name: "#32: href",
  fn: async () => {
    const html =
      `<html><head><title>some title</title></head><body><a href=\\"https://nyan.web.id\\">Item 1</a></body></html>`;
    const query = `{
      page(source: "${html}") {
        query(selector: "a") {
          href
        }
        link: href(selector: "a")
      }
    }`;

    const response = await useQuery(query);

    assertEquals("error" in response, false);
    assertEquals(
      response.data && response.data.page.query.href,
      "https://nyan.web.id",
    );
    assertEquals(
      response.data && response.data.page.link,
      "https://nyan.web.id",
    );
  },
  ...DEFAULT_TEST_OPTIONS,
});

Deno.test({
  name: "#33: src",
  fn: async () => {
    const html =
      `<html><head><title>some title</title></head><body><img src=\\"https://nyan.web.id/screenshot.png\\" /></body></html>`;
    const query = `{
      page(source: "${html}") {
        query(selector: "img") {
          src
        }
        image: src(selector: "img")
      }
    }`;

    const response = await useQuery(query);

    assertEquals("error" in response, false);
    assertEquals(
      response.data && response.data.page.query.src,
      "https://nyan.web.id/screenshot.png",
    );
    assertEquals(
      response.data && response.data.page.image,
      "https://nyan.web.id/screenshot.png",
    );
  },
  ...DEFAULT_TEST_OPTIONS,
});

Deno.test({
  name: "#34: class",
  fn: async () => {
    const html =
      `<html><head><title>some title</title></head><body><div class=\\"mx-2 my-4 bg-gray-100\\"></div></body></html>`;
    const query = `{
      page(source: "${html}") {
        query(selector: "div") {
          class
        }
        box: class(selector: "div")
      }
    }`;

    const response = await useQuery(query);

    assertEquals("error" in response, false);
    assertEquals(
      response.data && response.data.page.query.class,
      "mx-2 my-4 bg-gray-100",
    );
    assertEquals(
      response.data && response.data.page.box,
      "mx-2 my-4 bg-gray-100",
    );
  },
  ...DEFAULT_TEST_OPTIONS,
});

Deno.test({
  name: "#34: classList",
  fn: async () => {
    const html =
      `<html><head><title>some title</title></head><body><div class=\\"mx-2 my-4 bg-gray-100\\"></div></body></html>`;
    const query = `{
      page(source: "${html}") {
        query(selector: "div") {
          classList
        }
        classes: classList(selector: "div")
      }
    }`;

    const response = await useQuery(query);

    assertEquals("error" in response, false);
    assertEquals(
      response.data && response.data.page.query.classList,
      ["mx-2", "my-4", "bg-gray-100"],
    );
    assertEquals(
      response.data && response.data.page.classes,
      ["mx-2", "my-4", "bg-gray-100"],
    );
  },
  ...DEFAULT_TEST_OPTIONS,
});

Deno.test({
  name: "#35: meta",
  fn: async () => {
    const html =
      `<html><head><title>some title</title><meta name=\\"description\\" content=\\"some description\\"><meta property=\\"og:description\\" content=\\"some description\\"></head><body></body></html>`;
    const query = `{
      page(source: "${html}") {
        description: meta(name: "description")
        og_description: meta(name: "og:description")
      }
    }`;

    const response = await useQuery(query);

    assertEquals("error" in response, false);
    assertEquals(response.data?.page.description, "some description");
    assertEquals(response.data?.page.og_description, "some description");
  },
  ...DEFAULT_TEST_OPTIONS,
});

Deno.test({
  name: "#36: meta not found",
  fn: async () => {
    const html =
      `<html><head><title>some title</title><meta name=\\"description\\" content=\\"some description\\"><meta property=\\"og:description\\" content=\\"some description\\"></head><body></body></html>`;
    const query = `{
      page(source: "${html}") {
        keywords: meta(name: "keywords")
      }
    }`;

    const response = await useQuery(query);

    assertEquals("error" in response, false);
    assertEquals(response.data?.page.keywords, null);
  },
  ...DEFAULT_TEST_OPTIONS,
});

// Deno.test({
//   name: "#37: visit_custom",
//   fn: async () => {
//     const query = `{
//       page(url: "https://nyancodeid.github.io/tests/test-custom-visit.html") {
//         link: query(selector: "div.link") {
//           visit_custom(attr: "data-link") {
//             text(selector: "strong")
//           }
//         }
//       }
//     }`;

//     const response = await useQuery(query);

//     assertEquals("error" in response, false);
//     assertEquals(
//       response.data && response.data.page.link.visit_custom.text,
//       "we managed to visit the link!",
//     );
//   },
//   ...DEFAULT_TEST_OPTIONS,
// });

Deno.test({
  name: "#38: table",
  fn: async () => {
    const query = `{
      page(url: "https://nyancodeid.github.io/tests/kurs.html") {
        table: query(selector: "#scrolling-table") {
          values: table(attr: "table.m-table-kurs")
        }
      }
    }`;

    const response = await useQuery(query);

    assertEquals("error" in response, false);
    assertNotEquals(
      response.data && response.data.bca_kurs.table.length,
      0,
    );
  },
  ...DEFAULT_TEST_OPTIONS,
});

Deno.test({
  name: "#39: index",
  fn: async () => {
    const query = `{
      page(source: "<html><head><title>some title</title></head><body><ul class=\\"items\\"><li>one</li><li>two</li><li>three</li><li>four</li></ul></body></html>") {
        items: queryAll(selector: ".items li") {
          index
          text
        }
      }
    }`;

    const response = await useQuery(query);

    assertEquals("error" in response, false);
    assertNotEquals(
      response.data && response.data.page.items.length,
      0,
    );
    assertEquals(response.data?.page.items.length, 4);
    assertEquals(response.data?.page.items[0].index, 0);
    assertEquals(response.data?.page.items[2].text, "three");
  },
  ...DEFAULT_TEST_OPTIONS,
});

Deno.test({
  name: "#40: index with selector",
  fn: async () => {
    const query = `{
      page(source: "<html><head><title>some title</title></head><body><ul class=\\"items\\"><li><i>one</i></li><li><i>two</i></li><li><i>three</i></li><li><i>four</i></li></ul></body></html>") {
        items: queryAll(selector: ".items li i") {
          index(parent: ".items li")
          text
        }
      }
    }`;

    const response = await useQuery(query);

    assertEquals("error" in response, false);
    assertNotEquals(
      response.data && response.data.page.items.length,
      0,
    );
    assertEquals(response.data?.page.items.length, 4);
    assertEquals(response.data?.page.items[0].index, 0);
    assertEquals(response.data?.page.items[2].text, "three");
  },
  ...DEFAULT_TEST_OPTIONS,
});

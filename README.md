<div align="center">

# [🦕 DQL](https://deno.land/x/dql)

### _**Web Scraping with Deno  –  DOM + GraphQL**_

</div>

---

**`DQL`** is a web scraping module for Deno and Deno Deploy that integrates the power of [**GraphQL Queries**](https://graphql.org/learn/queries) with the DOM tree of a remote webpage or HTML document fragment. This is a fork of [**DenoQL**](https://deno.land/x/denoql) with some heavy refactoring and some additional features:

- [x] Compatibility with the [**Deno Deploy**](https://deno.com/deploy) architecture
- [x] Ability to pass variables alongside all queries
- [x] New state-management class with additional methods
- [x] Modular project structure (as opposed to a mostly single-file design)
- [x] Improved types and schema structure

> **Note**: _This is a work-in-progress and there is still a lot to be done._

### 🛝  [**`GraphQL Playground`**](https://dql.deno.dev)

### 📝  [**`HackerNews Scraper`**](https://dash.deno.com/playground/dql-hn)

### 🚛  [**`Junkyard Scraper`**](https://dash.deno.com/playground/dirty-sparrow-69)

---

## `useQuery`

The primary function exported by the module is the workhorse named `useQuery`:

```ts
import { useQuery } from "https://deno.land/x/dql/mod.ts";

const data = await useQuery(`query { ... }`);
```

### `QueryOptions`

You can also provide a `QueryOptions` object as the second argument of `useQuery`, to further control the behavior of your query requests. All properties are optional.

```ts
const data = await useQuery(`query { ... }`, {
  concurrency: 8, // passed directly to PQueue initializer
  fetch_options: { // passed directly to Fetch API requests
    headers: {
      "Authorization": "Bearer ghp_a5025a80a24defd0a7d06b4fc215bb5635a167c6",
    },
  },
  variables: {}, // variables defined in your queries
  operationName: "", // when using multiple queries
});
```

## `createServer`

With [**Deno Deploy**](https://dash.deno.com/new), you can deploy **`DQL`** with a GraphQL Playground in **only 2 lines of code**:

```ts
import { createServer } from "https://deno.land/x/dql/mod.ts";

createServer(80, { endpoint: "https://dql.deno.dev" });
```

`🛝` [Try the **GraphQL Playground** at **`dql.deno.dev`**](https://dql.deno.dev)\
`🦕` [View the source code in the **`Deno Playground`**](https://dash.deno.com/playground/dql)

## Command Line Usage (CLI)

```bash
deno run -A --unstable https://deno.land/x/dql/serve.ts
```

#### Custom port (default is `8080`)

```bash
deno run -A https://deno.land/x/dql/serve.ts --port 3000
```

> **Warning**: you need to have the [**Deno CLI**](https://deno.land) installed first.

---

## 💻 Examples

### `🚛` Junkyard Scraper · [**`Deno Playground 🦕`**](https://dash.deno.com/playground/dirty-sparrow-69)

```ts
import { useQuery } from "https://deno.land/x/dql/mod.ts";
import { serve } from "https://deno.land/std@0.147.0/http/server.ts";

serve(async (res: Request) =>
  await useQuery(
    `
  query Junkyard (
    $url: String
    $itemSelector: String = "table > tbody > tr"
  ) {
    vehicles: page(url: $url) {
      totalCount: count(selector: $itemSelector)
      nodes: queryAll(selector: $itemSelector) {
        id: index
        vin:   text(selector: "td:nth-child(7)", trim: true)
        sku:   text(selector: "td:nth-child(6)", trim: true)
        year:  text(selector: "td:nth-child(1)", trim: true)
        model: text(selector: "td:nth-child(2) > .notranslate", trim: true)
        aisle: text(selector: "td:nth-child(3)", trim: true)
        store: text(selector: "td:nth-child(4)", trim: true)
        color: text(selector: "td:nth-child(5)", trim: true)
        date:  attr(selector: "td:nth-child(8)", name: "data-value")
        image: src(selector: "td > a > img")
      }
    }
  }`,
    {
      variables: {
        "url": "http://nvpap.deno.dev/action=getVehicles&makes=BMW",
      },
    },
  )
    .then((data) => JSON.stringify(data, null, 2))
    .then((json) =>
      new Response(json, {
        headers: { "content-type": "application/json;charset=utf-8" },
      })
    )
);
```

### 📝 HackerNews Scraper · [**`Deno Playground 🦕`**](https://dash.deno.com/playground/dql-hn)

```ts
import { useQuery } from "https://deno.land/x/dql/mod.ts";
import { serve } from "https://deno.land/std@0.147.0/http/server.ts";

serve(async (res: Request) =>
  await useQuery(`
  query HackerNews (
    $url: String = "http://news.ycombinator.com"
    $rowSelector: String = "tr.athing"
  ) {
    page(url: $url) {
      title
      totalCount: count(selector: $rowSelector)
      nodes: queryAll(selector: $rowSelector) {
        rank: text(selector: "td span.rank", trim: true)
        title: text(selector: "td.title a", trim: true)
        site: text(selector: "span.sitestr", trim: true)
        url: href(selector: "td.title a")
        attrs: next {
          score: text(selector: "span.score", trim: true)
          user: text(selector: "a.hnuser", trim: true)
          date: attr(selector: "span.age", name: "title")
        }
      }
    }
  }`)
    .then((data) => JSON.stringify(data, null, 2))
    .then((json) =>
      new Response(json, {
        headers: { "content-type": "application/json;charset=utf-8" },
      })
    )
);
```

## License

MIT © [**Nicholas Berlette**](https://github.com/nberlette), based on [DenoQL](https://deno.land/x/denoql).

<div align="center">

# [DQL](https://deno.land/x/dql)  

### _**Web Scraping with Deno  –  DOM + GraphQL**_

</div>

---  

**`DQL`** lets you use GraphQL queries to extract data from the DOM of a web page or HTML fragment (for sandboxing or use cases without network access). It accepts [**GraphQL Queries**](https://graphql.org/learn/queries) as input, and returns formatted JSON data as output.  

> - [**Try out a real-world example of `useQuery` in the `Deno Playground`**](https://dash.deno.com/playground/dql)
> - [**View the example's JSON endpoint at `dql.deno.dev`**](https://dql.deno.dev)

## Summary

This is a fork of [**DenoQL**](https://deno.land/x/denoql) with some heavy refactoring and some additional features:

- [x] Compatibility with the [**Deno Deploy**](https://deno.com/deploy) architecture
- [x] Ability to pass variables alongside all queries
- [x] New state-management class with additional methods
- [x] Modular project structure (as opposed to a mostly single-file design)
- [x] Improved types and schema structure
- [ ] **This is a work-in-progress and there is still much to be done.** *

## Usage

The primary function exported by the module is the workhorse named `useQuery`:

```ts
import { useQuery } from "https://deno.land/x/dql/mod.ts";

const data = await useQuery(`query { ... }`);
```

### Query Options

You can also provide an options object for the second argument of `useQuery`:

```ts
const data = await useQuery(`query { ... }`, {
  concurrency: 8,
  fetch_options: {
    // passed as the second param to fetch()
  },
  variables: {
    // any variables used in your queries go here
  },
});
```

### Authenticated Requests

To authenticate your requests, you can add an `Authorization` header like so:

```ts
const data = await useQuery(`query { ... }`, {
  fetch_options: {
    headers: {
      "Authorization": "Bearer ghp_a5025a80a24defd0a7d06b4fc215bb5635a167c6",
    },
  },
});
```


## GraphQL Playground

### Deno Deploy

With [**Deno Deploy**](https://dash.deno.com/new), you can deploy **`DQL`** with a GraphQL Playground in **only 2 LOC**:

```ts
import { createServer } from "https://deno.land/x/dql/mod.ts";

// change the endpoint to your unique URL ([...].deno.dev)
createServer(80, { endpoint: "https://dirty-sparrow-69.deno.dev" });
```

> - [**Try it out at `dirty-sparrow-69.deno.dev`**](https://dirty-sparrow-69.deno.dev)
> - [**View the public code in the `Deno Playground`**](https://dash.deno.com/playground/dirty-sparrow-69)


### Command Line Usage (CLI)

```bash
# spin up a playground on port 8080
deno run -A --unstable https://deno.land/x/dql/serve.ts
```

```bash
# ... or using a custom port
deno run -A --unstable https://deno.land/x/dql/serve.ts --port 3000
```

> **Note**: you need to have the [**Deno CLI**](https://deno.land) installed for CLI usage.

### Programmatic Usage

```ts
import { createServer } from "https://deno.land/x/dql/mod.ts";

// start a playground on port 8080
createServer();

// or using a custom port
createServer(3000);
```

## Examples

### Junkyard Inventory Scraper

> - [**Try it for yourself in the `Deno Playground`**](https://dash.deno.com/playground/dql)  
> - [**View the JSON endpoint at `dql.deno.dev`**](https://dql.deno.dev)  

```ts
import { useQuery } from "https://deno.land/x/dql/mod.ts";

const query = `query Junkyard ($url: String, $itemSelector: String) {
  vehicles: page(url: $url) {
    totalCount: count(selector: $itemSelector)
    items: queryAll(selector: $itemSelector) {
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
}`;

// pass any variables using the 'variables' key
const response = await useQuery(query, {
  variables: {
    "url": "http://nvpap.deno.dev/action=getVehicles&makes=BMW",
    "itemSelector": "table > tbody > tr",
  },
});

// do something with response (Object)
console.log(response);
```

---

<div align="center">

MIT © [Nicholas Berlette](https://github.com/nberlette) • based on [DenoQL](https://deno.land/x/denoql) by [nyancodeid](https://github.com/nyancodeid)

</div>

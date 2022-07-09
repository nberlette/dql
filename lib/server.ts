import { serve } from "~/deps.ts";
import { useQuery } from "./query.ts";

export const prismqlPlayground = (_port: string | number, endpoint: string) => {
  return `
  <!DOCTYPE html>
<html>

<head>
  <meta charset=utf-8/>
  <meta name="viewport" content="user-scalable=no, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, minimal-ui">
  <title>GraphQL Playground</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/graphql-playground-react/build/static/css/index.css" />
  <link rel="shortcut icon" href="https://cdn.jsdelivr.net/npm/graphql-playground-react/build/favicon.png" />
  <script src="https://cdn.jsdelivr.net/npm/graphql-playground-react/build/static/js/middleware.js"></script>
</head>
<body>
  <div id="root">
    <style>
      body {
        background-color: rgb(23, 42, 58);
        font-family: Open Sans, sans-serif;
        height: 90vh;
      }
      #root {
        height: 100%;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .loading {
        font-size: 32px;
        font-weight: 200;
        color: rgba(255, 255, 255, .6);
        margin-left: 20px;
      }
      img {
        width: 78px;
        height: 78px;
      }
      .title {
        font-weight: 400;
      }
    </style>
    <img src="https://cdn.jsdelivr.net/npm/graphql-playground-react/build/logo.png" alt="" />
    <div class="loading">
      Loading <span class="title">GraphQL Playground</span>
    </div>
  </div>
  <script>
    window.addEventListener('load', event => {
      GraphQLPlayground.init(document.getElementById('root'), {
        endpoint: '${endpoint}'
      })
    })
  </script>
</body>

</html>
  `;
};

export function createServer(port: string | number = 8080, option?: IOptional) {
  const endpoint = (option?.endpoint)
    ? option.endpoint
    : `http://localhost:${port}`;

  async function handler(req: Request): Promise<Response> {
    switch (req.method) {
      case "GET": {
        return new Response(prismqlPlayground(port, endpoint), {
          headers: { "content-type": "text/html" },
        });
      }
      case "POST": {
        const { query, variables = {} } = await req.json();
        const response = await useQuery(query, { variables });

        return new Response(JSON.stringify(response, null, 2), {
          headers: { "content-type": "application/json; charset=utf-8" },
        });
      }
      default:
        return new Response("Invalid Method", {
          headers: { "content-type": "text/html" },
        });
    }
  }

  console.log(`GraphQL Server running on ${endpoint}`);

  serve(handler, { port: +port });
}

import { serve } from "../deps.ts";
import { useQuery } from "./query.ts";

const graphqlPlayground = (endpoint = "http://localhost:8080") =>
  `<!DOCTYPE html><html><head><meta charset="utf-8"/><meta name="viewport" content="user-scalable=no, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, minimal-ui"><link rel="rel" href="https://cdn.jsdelivr.net/npm/graphql-playground-react/build/static/css/index.css" as="style" /><link rel="prefetch" href="https://cdn.jsdelivr.net/npm/graphql-playground-react/build/static/js/middleware.js" as="script" /><title>GraphQL Playground + DQL</title><link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/graphql-playground-react/build/static/css/index.css" /><link rel="shortcut icon" href="https://cdn.jsdelivr.net/npm/graphql-playground-react/build/favicon.png" /><script src="https://cdn.jsdelivr.net/npm/graphql-playground-react/build/static/js/middleware.js"></script></head><body><div id="root"><style>body{background-color:rgb(23,42,58);font-family:Open Sans,sans-serif;height:90vh}#root{height:100%;width:100%;display:flex;align-items:center;justify-content:center}.loading{font-size:32px;font-weight:200;color:rgba(255,255,255,.6);margin-left:20px}img{width:78px;height:78px}.title{font-weight:400}</style><img src="https://cdn.jsdelivr.net/npm/graphql-playground-react/build/logo.png" alt="" /><div class="loading">Loading <span class="title">GraphQL Playground</span></div></div><script>window.addEventListener('load', event => { GraphQLPlayground.init(document.getElementById('root'), { endpoint: '${endpoint}' }) })</script></body></html>
  `;

export function createServer(port: string | number = 8080, option?: IOptional) {
  const endpoint = (option?.endpoint)
    ? option.endpoint
    : `http://localhost:${port}`;

  const htmlResponseInit = {
    headers: { "content-type": "text/html;charset=utf-8" },
  };

  const jsonResponseInit = {
    headers: { "content-type": "application/json; charset=utf-8" },
  };

  async function handler(req: Request): Promise<Response> {
    switch (req.method) {
      case "GET": {
        return new Response(graphqlPlayground(endpoint), htmlResponseInit);
      }
      case "POST": {
        const {
          query,
          variables = {},
          operationName = undefined,
        } = await req.json();

        const response = await useQuery(query, {
          variables,
          operationName,
        });

        return new Response(
          JSON.stringify(response, null, 2),
          jsonResponseInit,
        );
      }
      default:
        return new Response("Invalid Method", {
          ...htmlResponseInit,
          status: 405,
        });
    }
  }

  console.log(`🦕 DQL + GraphQL Server running on ${endpoint}`);
  serve(handler, { port: +port });
}

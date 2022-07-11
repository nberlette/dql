import { graphql, PQueue } from "../deps.ts";
import { State } from "./state.ts";
import { schema } from "./schema.ts";

const defaults: QueryOptions = {
  concurrency: 8,
  fetch_options: {
    // ...
  },
  variables: {},
  operationName: undefined,
};

export const useQuery = (query: string, options?: QueryOptions) => {
  const {
    concurrency,
    fetch_options,
    variables = {},
    operationName,
  } = { ...defaults, ...options };

  const state = new State<any>();
  const queue = new PQueue({ concurrency });

  state.set("queue", queue);
  state.set("fetch_options", fetch_options);
  return graphql(schema, query, {}, { state }, variables, operationName);
};

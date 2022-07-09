#!/usr/bin/env deno run --allow-net --unstable
import { createServer } from "~/mod.ts";
import { parse } from "std/flags/mod.ts";

const { port = 8080 } = parse(Deno.args) ?? {};
createServer(port);

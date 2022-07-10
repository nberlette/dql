#!/usr/bin/env deno run --allow-net --unstable
import { createServer } from "./mod.ts";
import { parse } from "https://deno.land/std@0.145.0/flags/mod.ts";

const { port = 8080 } = parse(Deno.args) ?? {};
createServer(port);

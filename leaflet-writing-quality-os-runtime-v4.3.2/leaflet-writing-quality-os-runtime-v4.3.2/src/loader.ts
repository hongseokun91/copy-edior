import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { LoadedConfig } from "./types.js";

async function readJson(p: string): Promise<any> {
  const raw = await fs.readFile(p, "utf-8");
  return JSON.parse(raw);
}

export async function loadConfig(configDir: URL | string): Promise<LoadedConfig> {
  const base = typeof configDir === "string"
    ? configDir
    : fileURLToPath(configDir);

  const rules = await readJson(path.join(base, "rules.v4.3.json"));
  const rewriteMaps = await readJson(path.join(base, "rewrite_maps.v4.3.json"));
  const modulePolicies = await readJson(path.join(base, "module_policies.v4.3.json"));

  return { rules, rewriteMaps, modulePolicies };
}

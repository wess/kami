import { readFileSync, writeFileSync, existsSync } from "fs";
import path from "path";

import { load as parseYaml } from "js-yaml";

export const MANIFEST_PATH = path.resolve(process.cwd(), "manifest.yaml");

export function loadManifest() {
  try {
    const content = readFileSync(MANIFEST_PATH, "utf8");
    return parseYaml(content);
  } catch (err) {
    console.error("Failed to read manifest.yaml:", err);
    process.exit(1);
  }
}

export function manifestExists() {
  return existsSync(MANIFEST_PATH);
}

export function initManifest() {
  if (existsSync(MANIFEST_PATH)) {
    console.error("manifest.yaml already exists in this directory.");
    process.exit(1);
  }
  const defaultManifest = `tasks:
  example:
    description: Example task
    command: echo "Hello, world!"
`;
  writeFileSync(MANIFEST_PATH, defaultManifest, "utf8");
  console.log("Created manifest.yaml in the current directory.");
}

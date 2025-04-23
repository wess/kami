import { plugin } from "bun";

// Export a parseYaml function for use in other modules
export function parseYaml(input: string): any {
  // Dynamically import js-yaml to match Bun's ESM/CJS compatibility
  const { load } = require("js-yaml");
  return load(input);
}

await plugin({
  name: "plugin-yaml",
  async setup(build) {
    const {load} = await import("js-yaml");

    build.onLoad({ filter: /\.(yaml|yml)$/ }, async (args) => {
      const text = await Bun.file(args.path).text();
      const exports = load(text) as Record<string, any>;
      return {
        exports: { default: exports },
        loader: "object",
      };
    });
  }
});

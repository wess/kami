import { manifestExists, initManifest } from "./manifest";
import { runAll, runOne } from "./tasks";
import { showHelp } from "./help";

async function main() {
  const [, , ...args] = process.argv;

  // No arguments: if manifest.yaml exists, default to run; else show help
  if (args.length === 0) {
    if (manifestExists()) {
      await runAll();
      process.exit(0);
    } else {
      showHelp();
      process.exit(0);
    }
  }

  if (args[0] === "help" || args[0] === "--help" || args[0] === "-h") {
    showHelp();
    process.exit(0);
  }

  if (args[0] === "init") {
    initManifest();
    process.exit(0);
  }

  if (args[0] === "run") {
    if (args.length === 1) {
      await runAll();
    } else if (args.length === 2) {
      await runOne(args[1]);
    } else {
      console.error("Invalid usage of 'run'.");
      showHelp();
      process.exit(1);
    }
    process.exit(0);
  }

  // Allow running a task by name directly: e.g. `bun run src/cli/index.ts webtwo`
  // Try to load the manifest and see if the argument matches a task name
  try {
    const { loadManifest } = await import("./manifest");
    const manifest = loadManifest();
    let tasks: Record<string, any>;
    if (manifest && typeof manifest === "object" && manifest.tasks && typeof manifest.tasks === "object") {
      tasks = manifest.tasks;
    } else if (manifest && typeof manifest === "object") {
      tasks = manifest;
    } else {
      tasks = {};
    }
    if (args.length === 1 && tasks[args[0]]) {
      await runOne(args[0]);
      process.exit(0);
    }
  } catch {
    // ignore, will fall through to unknown command
  }

  console.error(`Unknown command: ${args[0]}`);
  showHelp();
  process.exit(1);
}

main();

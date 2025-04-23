import { loadManifest } from "./manifest";

// Run all tasks in the manifest
export async function runAll() {
  const manifest = loadManifest();
  // Support both {tasks: {name: {command: ...}}} and {name: "command ..."}
  let tasks: Record<string, any>;
  if (manifest && typeof manifest === "object" && manifest.tasks && typeof manifest.tasks === "object") {
    tasks = manifest.tasks;
  } else if (manifest && typeof manifest === "object") {
    tasks = manifest;
  } else {
    console.error("No tasks found in manifest.yaml");
    process.exit(1);
  }
  // Run all tasks concurrently
  await Promise.all(
    Object.keys(tasks).map((name) => runTask(name, tasks[name]))
  );
}

// Run a single task by name
export async function runOne(name: string) {
  const manifest = loadManifest();
  let tasks: Record<string, any>;
  if (manifest && typeof manifest === "object" && manifest.tasks && typeof manifest.tasks === "object") {
    tasks = manifest.tasks;
  } else if (manifest && typeof manifest === "object") {
    tasks = manifest;
  } else {
    console.error(`Task "${name}" not found in manifest.yaml`);
    process.exit(1);
  }
  if (!tasks[name]) {
    console.error(`Task "${name}" not found in manifest.yaml`);
    process.exit(1);
  }
  await runTask(name, tasks[name]);
}

// Run a single task (internal)
export async function runTask(name: string, task: any) {
  console.log(`Running task: ${name}`);
  let command: string | undefined;
  if (typeof task === "string") {
    command = task;
  } else if (task && typeof task === "object" && typeof task.command === "string") {
    command = task.command;
  }
  if (!command) {
    console.error(`Task "${name}" does not have a valid command.`);
    return;
  }
  // Split command into executable and args (simple split, not shell parsing)
  const [executable, ...args] = command.split(" ");
  if (!executable || executable === "/") {
    console.error(`Invalid executable for task "${name}": ${executable}`);
    return;
  }
  try {
    const proc = Bun.spawn([executable, ...args], {
      stdout: "inherit",
      stderr: "inherit",
      stdin: "inherit",
    });
    const exitCode = await proc.exited;
    if (exitCode !== 0) {
      console.error(`Task "${name}" failed with exit code ${exitCode}`);
    }
  } catch (err) {
    console.error(`Failed to run task "${name}":`, err);
  }
}

const COLORS = [
  "\x1b[36m", // cyan
  "\x1b[32m", // green
  "\x1b[35m", // magenta
  "\x1b[33m", // yellow
  "\x1b[34m", // blue
  "\x1b[31m", // red
];
const RESET = "\x1b[0m";

 // Helper to split command into executable and args
function parseCommand(cmd: string): [string, string[]] {
  // Remove leading '$' and any leading/trailing whitespace
  const cleaned = cmd.trim().replace(/^\$\s*/, "");
  const parts = cleaned.split(/\s+/);
  return [parts[0], parts.slice(1)];
}

// Prefix each line of output with process name and color
function prefixStream(stream: ReadableStream, prefix: string, color: string) {
  const reader = stream.getReader();
  let buffer = "";
  function readChunk() {
    reader.read().then(({ done, value }) => {
      if (done) {
        if (buffer.length > 0) {
          printLine(buffer);
        }
        return;
      }
      buffer += new TextDecoder().decode(value);
      let lines = buffer.split("\n");
      buffer = lines.pop() || "";
      for (const line of lines) {
        printLine(line);
      }
      readChunk();
    });
  }
  function printLine(line: string) {
    const padded = prefix.padEnd(8);
    console.log(`${color}${padded}${RESET} | ${line}`);
  }
  readChunk();
}

export function runProcesses(manifest: Record<string, string>) {
  const processes = Object.entries(manifest);
  const procs = processes.map(([name, cmd], i) => {
    const color = COLORS[i % COLORS.length];
    const [executable, args] = parseCommand(cmd);
    if (!executable || executable === "/") {
      console.error(`Invalid executable for process "${name}": ${executable}`);
      return null;
    }
    const proc = Bun.spawn([executable, ...args], {
      stdout: "pipe",
      stderr: "pipe",
      onExit(proc, exitCode, signal) {
        const status = exitCode === 0 ? "exited" : `failed (${exitCode})`;
        console.log(`${color}${name.padEnd(8)}${RESET} | ${status}`);
      },
    });
    prefixStream(proc.stdout, name, color);
    prefixStream(proc.stderr, name, color);
    return proc;
  });

  process.on("SIGINT", () => {
    for (const proc of procs) {
      proc.kill("SIGINT");
    }
    process.exit(0);
  });
}

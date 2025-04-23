# kami

A fast, flexible CLI tool for managing and running tasks defined in a `manifest.yaml` file. Built with [Bun](https://bun.sh) for speed and simplicity.

## Features

- Define and manage tasks in a simple YAML manifest
- Run all tasks or specific tasks from the CLI
- Easy project initialization
- Extensible and fast, powered by Bun

## Installation

### 1. Local install with Bun

Install dependencies and build the CLI for your platform:

For macOS:
```bash
bun install
bun run compile:mac
```

For Windows:
```bash
bun install
bun run compile:win
```

The compiled binary will be in the `build/` directory (`kami-mac` for macOS, `kami-win.exe` for Windows).

### 2. Global install (optional)

After publishing to npm or using npm link, you can install globally:

```bash
npm install -g .
```
or
```bash
bun install
bun run compile:mac   # or compile:win
npm link
```

### 3. Install via install.sh (curl)

Alternatively, use the provided install script (requires git and curl):

```bash
curl -fsSL https://raw.githubusercontent.com/wess/kami/main/install.sh | sh
```
Replace the URL with your actual repository if needed.

This will install kami to your system and link the CLI globally (if permissions allow).


## Usage

After installation, you can use the CLI directly:

```bash
kami <command>
```

Or, if running locally with Bun:

```bash
bun run src/cli/index.ts <command>
```

### CLI Commands

```
kami - CLI for managing kami tasks

Usage:
  kami help           Show this help message
  kami init           Create a new manifest.yaml in the current directory
  kami run            Run all items in manifest.yaml
  kami run <name>     Run a specific item in manifest.yaml
```

### Example

**Initialize a new manifest:**

```bash
bun run index.ts init
```

**Run all tasks:**

```bash
bun run index.ts run
```

**Run a specific task:**

```bash
bun run index.ts run build
```

## Example manifest.yaml

```yaml
frontend: "bun run frontend"
api: "bun run api"
```


## Contributing

Contributions are welcome! Please open issues or submit pull requests for bug fixes, features, or documentation improvements.

1. Fork the repository
2. Create a new branch for your feature or fix
3. Commit your changes with clear messages
4. Open a pull request describing your changes

## License

This project is licensed under the [MIT License](./LICENSE).

export function showHelp() {
  console.log(`
kami - CLI for managing kami tasks

Usage:
  kami help           Show this help message
  kami init           Create a new manifest.yaml in the current directory
  kami run            Run all items in manifest.yaml
  kami run <name>     Run a specific item in manifest.yaml
`);
}

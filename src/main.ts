import { runProcesses } from "./processor";
import { loadManifest } from "./cli/manifest";

const manifest = loadManifest();
runProcesses(manifest);

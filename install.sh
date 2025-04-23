#!/bin/bash
set -e

# Install script for kami
# Usage: curl -fsSL https://raw.githubusercontent.com/wess/kami/main/install.sh | sh
# Replace the repo URL above with your actual repository URL.

REPO_URL="https://github.com/wess/kami.git"
INSTALL_DIR="$HOME/.kami"
BIN_NAME="kami"

echo "Installing kami..."

# Check for bun, install if missing
if ! command -v bun &> /dev/null; then
  echo "Bun not found. Installing Bun..."
  curl -fsSL https://bun.sh/install | bash
  export BUN_INSTALL="$HOME/.bun"
  export PATH="$BUN_INSTALL/bin:$PATH"
fi

# Clone the repo
if [ -d "$INSTALL_DIR" ]; then
  echo "Removing previous installation at $INSTALL_DIR"
  rm -rf "$INSTALL_DIR"
fi

git clone "$REPO_URL" "$INSTALL_DIR"
cd "$INSTALL_DIR"

# Install dependencies and build
bun install
bun run compile

# Link the binary globally
if [ -w "/usr/local/bin" ]; then
  ln -sf "$INSTALL_DIR/build/$BIN_NAME" /usr/local/bin/$BIN_NAME
  chmod +x /usr/local/bin/$BIN_NAME
  echo "Linked $BIN_NAME to /usr/local/bin"
else
  echo "Cannot write to /usr/local/bin. Please add $INSTALL_DIR/build to your PATH manually."
fi

echo "kami installed! Run 'kami --help' to get started."

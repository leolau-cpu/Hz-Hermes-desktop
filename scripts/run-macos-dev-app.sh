#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
export CARGO_TARGET_DIR="$ROOT/src-tauri/target"
BUNDLE="$CARGO_TARGET_DIR/debug/bundle/macos/HZ HERMES.app"
APP_BIN="$BUNDLE/Contents/MacOS/app"

cd "$ROOT"

if [[ ! -f "$CARGO_TARGET_DIR/debug/app" ]]; then
  echo "Dev binary missing, building..." >&2
  cargo build --manifest-path "$ROOT/src-tauri/Cargo.toml" >&2
fi

npx tauri bundle --debug -b app --no-sign >&2

if [[ ! -x "$APP_BIN" ]]; then
  echo "Failed to locate macOS app bundle at: $BUNDLE" >&2
  exit 1
fi

# Must launch through Launch Services (PPID=launchd). Direct exec keeps a square Dock icon.
if ! /usr/bin/open -n "$BUNDLE" 2>&1; then
  echo "Failed to launch $BUNDLE with /usr/bin/open" >&2
  exit 1
fi

while pgrep -f "$BUNDLE/Contents/MacOS/app" >/dev/null 2>&1; do
  sleep 0.5
done

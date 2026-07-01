#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
export CARGO_TARGET_DIR="$ROOT/src-tauri/target"
BUNDLE="$CARGO_TARGET_DIR/debug/bundle/macos/HZ HERMES.app"

cd "$ROOT"
npx tauri build --debug -b app --no-sign
/usr/bin/open -n "$BUNDLE"

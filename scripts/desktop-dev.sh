#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
export CARGO_TARGET_DIR="$ROOT/src-tauri/target"
BUNDLE="$CARGO_TARGET_DIR/debug/bundle/macos/HZ HERMES.app"
VITE_HOST="127.0.0.1"
VITE_PORT="1420"

cd "$ROOT"

start_vite() {
  if lsof -i :"$VITE_PORT" >/dev/null 2>&1; then
    return
  fi

  npm run dev -- --host "$VITE_HOST" --port "$VITE_PORT" &
  disown
  echo "Vite: http://${VITE_HOST}:${VITE_PORT}/"
}

if [[ "$(uname)" == "Darwin" ]]; then
  exec npx tauri dev
fi

start_vite
exec npx tauri dev

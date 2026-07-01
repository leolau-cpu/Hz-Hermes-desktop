#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
export CARGO_TARGET_DIR="$ROOT/src-tauri/target"
BUNDLE="$CARGO_TARGET_DIR/debug/bundle/macos/HZ HERMES.app"
VITE_HOST="127.0.0.1"
VITE_PORT="1420"
NODE_BIN="$HOME/.local/node-v22.14.0-darwin-arm64/bin"

if [[ -d "$NODE_BIN" ]]; then
  export PATH="$NODE_BIN:$PATH"
fi

cd "$ROOT"

wait_for_vite() {
  for _ in {1..30}; do
    if curl -fsS "http://${VITE_HOST}:${VITE_PORT}/" >/dev/null 2>&1; then
      return 0
    fi
    sleep 1
  done

  return 1
}

start_vite() {
  if lsof -i :"$VITE_PORT" >/dev/null 2>&1; then
    echo "Vite: http://${VITE_HOST}:${VITE_PORT}/"
    wait_for_vite
    return
  fi

  mkdir -p "$ROOT/.tmp"
  npm run dev -- --host "$VITE_HOST" --port "$VITE_PORT" > "$ROOT/.tmp/vite-dev.log" 2>&1 &
  echo $! > "$ROOT/.tmp/vite-dev.pid"
  disown
  if ! wait_for_vite; then
    tail -n 120 "$ROOT/.tmp/vite-dev.log" || true
    echo "Vite failed to become ready at http://${VITE_HOST}:${VITE_PORT}/" >&2
    exit 1
  fi
  echo "Vite: http://${VITE_HOST}:${VITE_PORT}/"
}

if [[ "$(uname)" == "Darwin" ]]; then
  start_vite
  exec npx tauri dev --no-dev-server-wait --config '{"build":{"beforeDevCommand":""}}'
fi

start_vite
exec npx tauri dev --no-dev-server-wait --config '{"build":{"beforeDevCommand":""}}'

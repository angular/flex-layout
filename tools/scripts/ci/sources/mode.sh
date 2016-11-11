#!/usr/bin/env bash
source ./tools/scripts/ci/sources/tunnel.sh

is_e2e() {
  [[ "$MODE" = e2e ]]
}

is_lint() {
  [[ "$MODE" = lint ]]
}

is_extract_metadata() {
  [[ "$MODE" = extract_metadata ]]
}

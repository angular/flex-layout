#!/usr/bin/env bash
set -ex

echo "=======  Starting build-and-test.sh  ========================================"

# Go to project dir
cd $(dirname $0)/../../..

# Include sources.
source tools/scripts/ci/sources/mode.sh
source tools/scripts/ci/sources/tunnel.sh

start_tunnel
wait_for_tunnel

$(npm bin)/gulp ci:test

teardown_tunnel

#!/bin/bash

# Script that runs in the testing build stage of Travis and is responsible for testing
# the project in different Travis jobs of the current build stage.

# The script should immediately exit if any command in the script fails.
set -e

echo ""
echo "Building sources and running tests. Running mode: ${MODE}"
echo ""

# Go to project dir
cd $(dirname $0)/../..

# Include sources.
source scripts/ci/sources/mode.sh
source scripts/ci/sources/tunnel.sh

# Get the commit diff and skip the build if only .md files have changed.
# Should not apply to master builds.
if [ "$TRAVIS_PULL_REQUEST" = "true" ]; then
  fileDiff=$(git diff --name-only $TRAVIS_BRANCH...HEAD)
  
  if [[ ${fileDiff} =~ ^(.*\.md\s*)*$ ]]; then
    echo "Skipping tests because only markdown files changed."
    exit 0
  fi
fi

start_tunnel
wait_for_tunnel

if is_lint; then
  $(npm bin)/gulp ci:lint
elif is_aot; then
  $(npm bin)/gulp ci:aot
elif is_unit; then
  $(npm bin)/gulp ci:test
elif is_prerender; then
  $(npm bin)/gulp ci:prerender
elif is_closure_compiler; then
  ./scripts/closure-compiler/build-devapp-bundle.sh
elif is_ssr; then
  $(npm bin)/gulp ci:ssr
fi

teardown_tunnel

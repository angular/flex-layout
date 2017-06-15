#!/bin/bash
# Script which always runs when the current Travis mode succeeds.

# Go to the project root directory
cd $(dirname $0)/../../..

# If not running as a PR, wait for all other travis modes to finish.
if [ "$TRAVIS_PULL_REQUEST" = "false" ]; then
  echo "Travis tests passed on 'master'. Publishing the build artifacts..."
  ./tools/scripts/release/publish-build-artifacts.sh
fi

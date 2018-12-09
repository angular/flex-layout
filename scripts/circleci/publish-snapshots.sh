#!/bin/bash

# This script should fail if one of the individual publish scripts fails.
set -e

# Go to project directory.
cd $(dirname ${0})/../..

# Deploy build artifacts to the GitHub build repositories. The release output is already
# fetched from the CircleCI workspace storage.
./scripts/deploy/publish-build-artifacts.sh --no-build

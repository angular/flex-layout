#!/usr/bin/env bash

set -e -o pipefail

buildVersion=$(node -p -e "require('./package.json').version")
commitSha=$(git rev-parse --short HEAD)
BUILD_REPOS="https://github.com/angular/flex-layout-builds"
BUILD_EXISTS=$(git ls-remote --tags "$BUILD_REPOS" "$buildVersion-$commitSha")

if [ "$BUILD_EXISTS" == "" ]; then
  echo "Version '$buildVersion-$commitSha' pushed successfully to $BUILD_REPOS!"
else
   echo "Version '$buildVersion-$commitSha' already exists!"
fi

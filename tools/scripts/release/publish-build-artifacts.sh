#!/bin/bash

# Script to publish the build artifacts to a GitHub repository.
# Builds will be automatically published once new changes are made to the repository.

set -e -o pipefail

# Go to the project root directory
cd $(dirname $0)/../../..

buildDir="dist/@angular/flex-layout"
buildVersion=$(sed -nE 's/^\s*"version": "(.*?)",$/\1/p' package.json)

commitSha=$(git rev-parse --short HEAD)
commitAuthorName=$(git --no-pager show -s --format='%an' HEAD)
commitAuthorEmail=$(git --no-pager show -s --format='%ae' HEAD)
commitMessage=$(git log --oneline -n 1)

LOCAL_BUILDS_DIR="tmp/flex-layout-builds"

# Create a release of the current repository.
$(npm bin)/gulp build:release

# Prepare cloning the builds repository
rm -rf $LOCAL_BUILDS_DIR
mkdir -p $LOCAL_BUILDS_DIR

BUILD_REPOS = "https://github.com/angular/flex-layout-builds"
BUILD_EXISTS = $(git ls-remote --tags "$BUILD_REPOS" "$buildVersion-$commitSha")

if [ "$BUILD_EXISTS" == "" ]; then

  # Clone the repository
  git clone $BUILD_REPOS \
    $LOCAL_BUILDS_DIR --depth=2

  # Copy the build files to the repository
  rm -rf $LOCAL_BUILDS_DIR/*
  cp -r $buildDir/* $LOCAL_BUILDS_DIR
  cp CHANGELOG.md $LOCAL_BUILDS_DIR

  # Create the build commit and push the changes to the repository.
  cd $LOCAL_BUILDS_DIR

  # Prepare Git for pushing the artifacts to the repository.
  git config user.name "${commitAuthorName}"
  git config user.email "${commitAuthorEmail}"
  git config credential.helper "store --file=.git/credentials"
  echo "https://$FLEX_LAYOUT_BUILDS_TOKEN:@github.com" > .git/credentials

  git add -A
  git commit --allow-empty -m "build: $buildVersion-$commitSha"
  git tag "$buildVersion-$commitSha"
  git push -q origin master --tags
  echo "Version '$buildVersion-$commitSha' pushed successfully to $BUILD_REPOS!"

fi


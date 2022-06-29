#!/bin/bash

# In case any command failed, we want to immediately exit the script with the
# proper exit code.
set -e

# Path to the project directory.
projectDir="$(dirname ${0})/../.."

# Go to project directory.
cd ${projectDir}

# Decode access token and make it accessible for child processes.
export BROWSER_STACK_ACCESS_KEY=`echo ${BROWSER_STACK_ACCESS_KEY} | rev`

# Setup the test platform environment variable that will be read
# by the Karma configuration script.
export TEST_PLATFORM="browserstack"

# Run Karma
yarn ng test @angular/flex-layout

echo "Finished ng test"
exit 0

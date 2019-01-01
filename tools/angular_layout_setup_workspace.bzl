# Copyright Google LLC All Rights Reserved.
#
# Use of this source code is governed by an MIT-style license that can be
# found in the LICENSE file at https://angular.io/license
"""Install Angular Layout source dependencies"""

load("@build_bazel_rules_nodejs//:defs.bzl", "yarn_install")

def angular_layout_setup_workspace():
  """
    This repository rule should be called from your WORKSPACE file.
    It creates some additional Bazel external repositories that are used internally
    to build Angular Layout
  """
  # Use Bazel managed node modules. See more below:
  # https://github.com/bazelbuild/rules_nodejs#bazel-managed-vs-self-managed-dependencies
  # Note: The repository_rule name is `@layoutdeps` so it does not conflict with the `@npm` repository
  # name downstream when building Angular Layout from source. In the future when Angular + Bazel
  # users can build using the @angular/flex-layout npm bundles (depends on Ivy) this can be changed
  # to `@npm`.
  yarn_install(
    name = "layoutdeps",
    package_json = "@angular_layout//:package.json",
    # Ensure that the script is available when running `postinstall` in the Bazel sandbox.
    data = ["@angular_layout//:tools/npm/check-npm.js"],
    yarn_lock = "@angular_layout//:yarn.lock",
  )

workspace(name = "angular_flex_layout")

# Add nodejs rules
http_archive(
    name = "build_bazel_rules_nodejs",
    url = "https://github.com/bazelbuild/rules_nodejs/archive/0.7.0.zip",
    strip_prefix = "rules_nodejs-0.7.0",
    sha256 = "d0cecf6b149d431ee8349f683d1db6a2a881ee81d8066a66c1b112a4b02748de",
)

# NOTE: this rule installs nodejs, npm, and yarn, but does NOT install
# your npm dependencies. You must still run the package manager.
load("@build_bazel_rules_nodejs//:defs.bzl", "check_bazel_version", "node_repositories")

check_bazel_version("0.11.0")
node_repositories(package_json = ["//:package.json"])

# Add sass rules
git_repository(
  name = "io_bazel_rules_sass",
  remote = "https://github.com/bazelbuild/rules_sass.git",
  tag = "0.0.3",
)

load("@io_bazel_rules_sass//sass:sass.bzl", "sass_repositories")
sass_repositories()

# Add TypeScript rules
http_archive(
  name = "build_bazel_rules_typescript",
  url = "https://github.com/bazelbuild/rules_typescript/archive/0.12.0.zip",
  strip_prefix = "rules_typescript-0.12.0",
  sha256 = "60c17e558fdcb66783f39418c8dfd4858c8fd748089e42ddf91e75a853471244",
)

# Setup TypeScript Bazel workspace
load("@build_bazel_rules_typescript//:defs.bzl", "ts_setup_workspace")
ts_setup_workspace()

# Add Angular rules
local_repository(
  name = "angular",
  path = "node_modules/@angular/bazel",
)

# Add rxjs
local_repository(
  name = "rxjs",
  path = "node_modules/rxjs/src",
)

# Point to the apps workspace just so that Bazel doesn't descend into it
# when expanding the //... pattern
local_repository(
    name = "demo_app",
    path = "src/apps/demo-app",
)

# Point to the apps workspace just so that Bazel doesn't descend into it
# when expanding the //... pattern
local_repository(
    name = "hello_world_app",
    path = "src/apps/hello-world",
)

# Point to the apps workspace just so that Bazel doesn't descend into it
# when expanding the //... pattern
local_repository(
    name = "universal_app",
    path = "src/apps/universal-app",
)

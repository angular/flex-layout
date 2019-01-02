# Re-export of Bazel rules with repository-wide defaults

load("@angular//:index.bzl", _ng_module = "ng_module", _ng_package = "ng_package")
load("@build_bazel_rules_nodejs//:defs.bzl", _jasmine_node_test = "jasmine_node_test")
load("@build_bazel_rules_typescript//:defs.bzl", _ts_library = "ts_library",
  _ts_web_test_suite = "ts_web_test_suite")
load("//:packages.bzl", "VERSION_PLACEHOLDER_REPLACEMENTS")

_DEFAULT_TSCONFIG_BUILD = "//src:bazel-tsconfig-build.json"
_DEFAULT_TSCONFIG_TEST = "//src:bazel-tsconfig-test.json"
_DEFAULT_TS_TYPINGS = "@layoutdeps//typescript:typescript__typings"

def _getDefaultTsConfig(testonly):
  if testonly:
    return _DEFAULT_TSCONFIG_TEST
  else:
    return _DEFAULT_TSCONFIG_BUILD

def ts_library(tsconfig = None, deps = [], testonly = False, **kwargs):
  # Add tslib because we use import helpers for all public packages.
  local_deps = ["@layoutdeps//tslib"] + deps
  if testonly:
    # Match the types[] in //packages:bazel-test-tsconfig.json
    local_deps.append("@layoutdeps//@types/jasmine")
    local_deps.append("@layoutdeps//@types/node")

  if not tsconfig:
    tsconfig = _getDefaultTsConfig(testonly)

  _ts_library(
    tsconfig = tsconfig,
    testonly = testonly,
    deps = local_deps,
    node_modules = _DEFAULT_TS_TYPINGS,
    **kwargs
  )

def ng_module(deps = [], tsconfig = None, testonly = False, **kwargs):
  if not tsconfig:
    tsconfig = _getDefaultTsConfig(testonly)

  local_deps = [
    # Add tslib because we use import helpers for all public packages.
    "@layoutdeps//tslib",
  ] + deps

  _ng_module(
    deps = local_deps,
    tsconfig = tsconfig,
    testonly = testonly,
    node_modules = _DEFAULT_TS_TYPINGS,
    **kwargs
  )

def ng_package(name, readme_md = None, **kwargs):
  # If no readme file has been specified explicitly, use the default readme for
  # release packages from "src/README.md".
  if not readme_md:
      readme_md = "//src:README.md"

  _ng_package(
    name = name,
    readme_md = readme_md,
    replacements = VERSION_PLACEHOLDER_REPLACEMENTS,
    **kwargs
  )

def jasmine_node_test(deps = [], **kwargs):
  local_deps = [
    # Workaround for: https://github.com/bazelbuild/rules_nodejs/issues/344
    "@layoutdeps//jasmine",
    "@layoutdeps//source-map-support",
  ] + deps

  _jasmine_node_test(
    deps = local_deps,
    **kwargs
  )

def ng_test_library(deps = [], tsconfig = None, **kwargs):
  local_deps = [
    # We declare "@angular/core" and "@angular/core/testing" as default dependencies because
    # all Angular component unit tests use the `TestBed` and `Component` exports.
    "@angular//packages/core",
    "@angular//packages/core/testing",
  ] + deps;

  ts_library(
    testonly = 1,
    deps = local_deps,
    **kwargs
  )

def ts_web_test_suite(srcs = [], bootstrap = [], browsers = [], **kwargs):
  _ts_web_test_suite(
    # Required for running the compiled ng modules that use TypeScript import helpers.
    srcs = ["@layoutdeps//node_modules/tslib:tslib.js"] + srcs,
    # do not sort
    bootstrap = [
        "@layoutdeps//node_modules/zone.js:dist/zone-testing-bundle.js",
        "@layoutdeps//node_modules/reflect-metadata:Reflect.js",
    ] + bootstrap,
    browsers = [
        "@io_bazel_rules_webtesting//browsers:chromium-local",
        # TODO(gregmagolan): re-enable firefox testing once fixed
        # See https://github.com/bazelbuild/rules_typescript/issues/296
        #"@io_bazel_rules_webtesting//browsers:firefox-local",
    ] + browsers,
    **kwargs
  )

def ng_web_test_suite(deps = [], static_css = [], bootstrap = [], **kwargs):
  ts_web_test_suite(
    # Depend on our custom test initialization script. This needs to be the first dependency.
    deps = ["//test:angular_test_init"] + deps,
    bootstrap = [
      "@layoutdeps//node_modules/zone.js:dist/zone-testing-bundle.js",
      "@layoutdeps//node_modules/reflect-metadata:Reflect.js",
    ] + bootstrap,
    **kwargs
  )

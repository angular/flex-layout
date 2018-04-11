workspace(name = "angular_flex_layout")

#
# Download Bazel toolchain dependencies as needed by build actions
#

http_archive(
    name = "build_bazel_rules_nodejs",
    url = "https://github.com/bazelbuild/rules_nodejs/archive/0.9.1.zip",
    strip_prefix = "rules_nodejs-0.9.1",
    sha256 = "6139762b62b37c1fd171d7f22aa39566cb7dc2916f0f801d505a9aaf118c117f",
)

http_archive(
    name = "io_bazel_rules_webtesting",
    url = "https://github.com/alexeagle/rules_webtesting/archive/22d497fad3c45faa2b7b28635dfa15f74c655602.zip",
    strip_prefix = "rules_webtesting-22d497fad3c45faa2b7b28635dfa15f74c655602",
    #sha256 = "28c73cf9d310fa6dba30e66bdb98071341c99c3feb8662f2d3883a632de97d72",
)

http_archive(
    name = "build_bazel_rules_typescript",
    url = "https://github.com/bazelbuild/rules_typescript/archive/0.15.0.zip",
    strip_prefix = "rules_typescript-0.15.0",
    sha256 = "1aa75917330b820cb239b3c10a936a10f0a46fe215063d4492dd76dc6e1616f4",
)

http_archive(
    name = "io_bazel_rules_go",
    url = "https://github.com/bazelbuild/rules_go/releases/download/0.10.3/rules_go-0.10.3.tar.gz",
    sha256 = "feba3278c13cde8d67e341a837f69a029f698d7a27ddbb2a202be7a10b22142a",
)

# This commit matches the version of buildifier in angular/ngcontainer
# If you change this, also check if it matches the version in the angular/ngcontainer
# version in /.circleci/config.yml
BAZEL_BUILDTOOLS_VERSION = "82b21607e00913b16fe1c51bec80232d9d6de31c"


# The Bazel buildtools repo contains tools like the BUILD file formatter, buildifier
http_archive(
    name = "com_github_bazelbuild_buildtools",
    # Note, this commit matches the version of buildifier in angular/ngcontainer
    url = "https://github.com/bazelbuild/buildtools/archive/%s.zip" % BAZEL_BUILDTOOLS_VERSION,
    strip_prefix = "buildtools-%s" % BAZEL_BUILDTOOLS_VERSION,
    sha256 = "edb24c2f9c55b10a820ec74db0564415c0cf553fa55e9fc709a6332fb6685eff",
)

# Fetching the Bazel source code allows us to compile the Skylark linter
http_archive(
    name = "io_bazel",
    url = "https://github.com/bazelbuild/bazel/archive/968f87900dce45a7af749a965b72dbac51b176b3.zip",
    strip_prefix = "bazel-968f87900dce45a7af749a965b72dbac51b176b3",
    sha256 = "e373d2ae24955c1254c495c9c421c009d88966565c35e4e8444c082cb1f0f48f",
)


#
# Load and install our dependencies downloaded above.
#

load("@build_bazel_rules_nodejs//:defs.bzl", "check_bazel_version", "node_repositories")

check_bazel_version("0.14.0")
node_repositories(package_json = ["//:package.json"])

load("@io_bazel_rules_go//go:def.bzl", "go_rules_dependencies", "go_register_toolchains")

go_rules_dependencies()
go_register_toolchains()

load("@io_bazel_rules_webtesting//web:repositories.bzl", "browser_repositories", "web_test_repositories")

web_test_repositories()
browser_repositories(
    chromium = True,
    firefox = True,
)

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

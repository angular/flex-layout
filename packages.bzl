# List of all components / subpackages.

LAYOUT_PACKAGES = [
  "core",
  "extended",
  "flex",
  "grid",
  "server",
]

LAYOUT_TARGETS = ["//src/lib:layout"] + ["//src/lib/%s" % p for p in LAYOUT_PACKAGES]

# Each individual package uses a placeholder for the version of Angular to ensure they're
# all in-sync. This map is passed to each ng_package rule to stamp out the appropriate
# version for the placeholders.
ANGULAR_PACKAGE_VERSION = ">=7.0.0-beta.0 <8.0.0"
VERSION_PLACEHOLDER_REPLACEMENTS = {
  "0.0.0-NG": ANGULAR_PACKAGE_VERSION,
}

# Base rollup globals for everything in the repo.
ROLLUP_GLOBALS = {
  'tslib': 'tslib',
  '@angular/flex-layout': 'ng.flex-layout',
}

# Rollup globals for layout subpackages, e.g., {"@angular/flex-layout/grid": "ng.flex-layout.grid"}
ROLLUP_GLOBALS.update({
  "@angular/flex-layout/%s" % p: "ng.flex-layout.%s" % p for p in LAYOUT_PACKAGES
})

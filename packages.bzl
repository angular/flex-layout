""" List of all @angular/layout components / subpackages.
"""

LAYOUT_PACKAGES = [
  "core",
  "extended",
  "flex",
  "grid",
]

# server is exported separately
LAYOUT_DEPS = LAYOUT_PACKAGES + ["server"]

LAYOUT_TARGETS = ["//src/lib:flex-layout"] + ["//src/lib/%s" % p for p in LAYOUT_DEPS]


# Base rollup globals for dependencies and the root entry-point.
LAYOUT_ROLLUP_GLOBALS = {
  'tslib': 'tslib',
  '@angular/cdk/bidi': 'ng.cdk.bidi',
  '@angular/flex-layout': 'ng.flexLayout',
}

# Rollup globals for subpackages in the form of, e.g., {"@angular/cdk/table": "ng.cdk.table"}
LAYOUT_ROLLUP_GLOBALS.update({
  "@angular/flex-layout/%s" % p: "ng.flexLayout.%s" % p for p in LAYOUT_DEPS
})

ANGULAR_VERSION = "^6.0.0"
RXJS_VERSION = "^6.0.0"
CDK_VERSION = "^6.0.0"

# Each individual package uses a placeholder for the version of Angular to ensure they're
# all in-sync. This map is passed to each ng_package rule to stamp out the appropriate
# version for the placeholders.
PKG_GROUP_REPLACEMENTS = {
    "0.0.0-NG": ANGULAR_VERSION,
    "0.0.0-RXJS": RXJS_VERSION,
    "0.0.0-CDK": CDK_VERSION
}

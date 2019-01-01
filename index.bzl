# Copyright Google LLC All Rights Reserved.
#
# Use of this source code is governed by an MIT-style license that can be
# found in the LICENSE file at https://angular.io/license
"""Public API surface is re-exported here.
This API is exported for users building Angular Layout from source in
downstream projects.
"""

load("//tools:angular_layout_setup_workspace.bzl",
    _angular_layout_setup_workspace = "angular_layout_setup_workspace")

angular_layout_setup_workspace = _angular_layout_setup_workspace

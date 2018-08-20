/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {
  chain,
  noop,
  Rule,
  SchematicContext,
  SchematicsException,
  Tree,
} from '@angular-devkit/schematics';
import {NodePackageInstallTask} from '@angular-devkit/schematics/tasks';
import {getWorkspace} from '@schematics/angular/utility/config';
import {Schema} from './schema';
import {getProjectFromWorkspace} from '../utils/get-project';
import {addModuleImportToRootModule} from '../utils/ast';

/**
 * Scaffolds the basics of a Angular Flex Layout application, this includes:
 *  - Add Packages to package.json
 *  - Adds FlexLayoutModule to app.module
 */
export default function(options: Schema): Rule {

  return chain([
    options && options.skipPackageJson ? noop() : addLayoutToPackageJson(),
    addflexRootConfig(options),
  ]);
}

/** Add flex-layout and cdk to package.json if not already present. */
function addLayoutToPackageJson() {
  return (host: Tree, context: SchematicContext) => {

    const pkgPath = '/package.json';
    const buffer = host.read(pkgPath);
    if (buffer === null) {
      throw new SchematicsException('Could not find package.json');
    }
    const pkg = JSON.parse(buffer.toString());
    pkg.dependencies['@angular/cdk'] = '0.0.0-CDK';
    pkg.dependencies['@angular/flex-layout'] = '0.0.0-PLACEHOLDER';

    context.addTask(new NodePackageInstallTask());

    return host;
  };
}

/** Add main module to the app module file. */
function addflexRootConfig(options: Schema) {
  return (host: Tree) => {
    const workspace = getWorkspace(host);
    const project = getProjectFromWorkspace(workspace, options.project);

    addModuleImportToRootModule(host, 'FlexLayoutModule', '@angular/flex-layout', project);

    return host;
  };
}

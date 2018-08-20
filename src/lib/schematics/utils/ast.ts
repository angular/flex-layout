/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {getAppModulePath} from '@schematics/angular/utility/ng-ast-utils';
import {WorkspaceProject} from '@schematics/angular/utility/config';
import {InsertChange} from '@schematics/angular/utility/change';
import {SchematicsException, Tree} from '@angular-devkit/schematics';
import {addImportToModule} from '@schematics/angular/utility/ast-utils';
import * as ts from 'typescript';

/** Import and add module to root app module. */
export function addModuleImportToRootModule(host: Tree, moduleName: string, src: string,
                                            project: WorkspaceProject) {

  const modulePath = getAppModulePath(host, project.architect.build.options.main);
  addModuleImportToModule(host, modulePath, moduleName, src);
}

/** Reads file given path and returns TypeScript source file. */
function getSourceFile(host: Tree, path: string): ts.SourceFile {
  const buffer = host.read(path);
  if (!buffer) {
    throw new SchematicsException(`Could not find file for path: ${path}`);
  }
  const content = buffer.toString();
  return ts.createSourceFile(path, content, ts.ScriptTarget.Latest, true);
}

/**
 * Import and add module to specific module path.
 * @param host the tree we are updating
 * @param modulePath src location of the module to import
 * @param moduleName name of module to import
 * @param src src location to import
 */
function addModuleImportToModule(
  host: Tree, modulePath: string, moduleName: string, src: string) {
  const moduleSource = getSourceFile(host, modulePath);

  if (!moduleSource) {
    throw new SchematicsException(`Module not found: ${modulePath}`);
  }

  const changes = addImportToModule(moduleSource, modulePath, moduleName, src);
  const recorder = host.beginUpdate(modulePath);

  changes.forEach((change) => {
    if (change instanceof InsertChange) {
      recorder.insertLeft(change.pos, change.toAdd);
    }
  });

  host.commitUpdate(recorder);
}

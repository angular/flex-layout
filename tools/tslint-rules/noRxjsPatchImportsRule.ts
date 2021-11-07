import path from 'path';
import ts from 'typescript';
import {IOptions, Rules, RuleWalker} from 'tslint';
import minimatch from 'minimatch';

const ERROR_MESSAGE = 'Uses of RxJS patch imports are forbidden.';

/**
 * Rule that prevents uses of RxJS patch imports (e.g. `import 'rxjs/add/operator/map').
 * Supports allowing usage in specific files via `"no-patch-imports": [true, "\.spec\.ts$"]`.
 */
export class Rule extends Rules.AbstractRule {
  apply(sourceFile: ts.SourceFile) {
    return this.applyWithWalker(new Walker(sourceFile, this.getOptions()));
  }
}

class Walker extends RuleWalker {

  /** Whether the walker should check the current source file. */
  private _enabled: boolean;

  constructor(sourceFile: ts.SourceFile, options: IOptions) {
    super(sourceFile, options);

    // Globs that are used to determine which files to lint.
    const fileGlobs = options.ruleArguments || [];

    // Relative path for the current TypeScript source file.
    const relativeFilePath = path.relative(process.cwd(), sourceFile.fileName);

    // Whether the file should be checked at all.
    this._enabled = fileGlobs.some(p => minimatch(relativeFilePath, p));
  }

  visitImportDeclaration(node: ts.ImportDeclaration) {
    // Walk through the imports and check if they start with `rxjs/add`.
    if (this._enabled && node.moduleSpecifier.getText().startsWith('rxjs/add', 1)) {
      this.addFailureAtNode(node, ERROR_MESSAGE);
    }

    super.visitImportDeclaration(node);
  }
}

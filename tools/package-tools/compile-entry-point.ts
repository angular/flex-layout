import {join} from 'path';
import {red} from 'chalk';
import {BuildPackage} from './build-package';
import {ngcCompile} from './ngc-compile';

/** Compiles the TypeScript sources of a primary or secondary entry point. */
export async function compileEntryPoint(buildPackage: BuildPackage, tsconfigName: string,
                                          secondaryEntryPoint = '', es2015OutputPath?: string) {
  const entryPointPath = join(buildPackage.sourceDir, secondaryEntryPoint);
  const entryPointTsconfigPath = join(entryPointPath, tsconfigName);
  const ngcFlags = ['-p', entryPointTsconfigPath];

  if (es2015OutputPath) {
    ngcFlags.push('--outDir', es2015OutputPath, '--target', 'ES2015');
  }

  return ngcCompile(ngcFlags).catch(() => {
    const error = red(`Failed to compile ${secondaryEntryPoint} using ${entryPointTsconfigPath}`);
    console.error(error);
    return Promise.reject(error);
  });
}

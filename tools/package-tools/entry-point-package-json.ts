import {join} from 'path';
import {writeFileSync} from 'fs';

/** Creates a package.json for a secondary entry-point with the different bundle locations. */
export function createEntryPointPackageJson(destDir: string, packageName: string,
                                            entryPointName: string) {
  const content = {
    name: `@angular/${packageName}/${entryPointName}`,
    typings: `../${entryPointName}.d.ts`,
    module: `../fesm2015/${entryPointName}.mjs`,
    es2020: `../fesm2020/${entryPointName}.mjs`,
    esm2020: `../esm2020/${entryPointName}/index.mjs`,
    fesm2020: `../fesm2020/${entryPointName}.mjs`,
    fesm2015: `../fesm2015/${entryPointName}.mjs`,
    sideEffects: false,
  };

  writeFileSync(join(destDir, 'package.json'), JSON.stringify(content, null, 2), 'utf-8');
}

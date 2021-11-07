import {join} from 'path';
import {buildConfig} from './build-config';
import {BuildPackage} from './build-package';
import {rollupRemoveLicensesPlugin} from './rollup-remove-licenses';
import {rollupGlobals, dashCaseToCamelCase} from './rollup-globals';
import {remapSourcemap} from './sourcemap-remap';

// There are no type definitions available for these imports.
const rollup = require('rollup');

/** Directory where all bundles will be created in. */
const fesm2015Dir = join(buildConfig.outputDir, 'fesm2015');
const fesm2020Dir = join(buildConfig.outputDir, 'fesm2020');


/** Utility for creating bundles from raw ngc output. */
export class PackageBundler {

  /** Name of the AMD module for the primary entry point of the build package. */
  private readonly primaryAmdModuleName: string;

  constructor(private buildPackage: BuildPackage) {
    this.primaryAmdModuleName = this.getAmdModuleName(buildPackage.name);
  }

  /** Creates all bundles for the package and all associated entry points (UMD, ES5, ES2015). */
  async createBundles() {
    for (const entryPoint of this.buildPackage.secondaryEntryPoints) {
      await this.bundleSecondaryEntryPoint(entryPoint);
    }

    await this.bundlePrimaryEntryPoint();
  }

  /** Bundles the primary entry-point w/ given entry file, e.g. @angular/cdk */
  private async bundlePrimaryEntryPoint() {
    const packageName = this.buildPackage.name;

    return this.bundleEntryPoint({
      entryFile: this.buildPackage.entryFilePath,
      esm2015EntryFile: join(this.buildPackage.esm2015OutputDir, 'index.js'),
      importName: `@angular/${this.buildPackage.name}`,
      moduleName: this.primaryAmdModuleName,
      esm2015Dest: join(fesm2015Dir, `${packageName}.mjs`),
      esm2020Dest: join(fesm2020Dir, `${packageName}.mjs`),
    });
  }

  /** Bundles a single secondary entry-point w/ given entry file, e.g. @angular/cdk/a11y */
  private async bundleSecondaryEntryPoint(entryPointName: string) {
    const packageName = this.buildPackage.name;
    const entryFile = join(this.buildPackage.outputDir, entryPointName, 'index.js');
    const esm2015EntryFile = join(this.buildPackage.esm2015OutputDir, entryPointName, 'index.js');

    return this.bundleEntryPoint({
      entryFile,
      esm2015EntryFile,
      importName: `@angular/${this.buildPackage.name}/${entryPointName}`,
      moduleName: this.getAmdModuleName(packageName, entryPointName),
      esm2015Dest: join(fesm2015Dir, `${packageName}`, `${entryPointName}.mjs`),
      esm2020Dest: join(fesm2020Dir, `${packageName}`, `${entryPointName}.mjs`),
    });
  }

  /**
   * Creates the ES5, ES2015, and UMD bundles for the specified entry-point.
   * @param config Configuration that specifies the entry-point, module name, and output
   *     bundle paths.
   */
  private async bundleEntryPoint(config: BundlesConfig) {
    // Build FESM-2020 bundle file.
    await this.createRollupBundle({
      importName: config.importName,
      moduleName: config.moduleName,
      entry: config.entryFile,
      dest: config.esm2015Dest,
      format: 'es',
    });

    // Build FESM-2015 bundle file.
    await this.createRollupBundle({
      importName: config.importName,
      moduleName: config.moduleName,
      entry: config.esm2015EntryFile,
      dest: config.esm2020Dest,
      format: 'es',
    });

    // Remaps the sourcemaps to be based on top of the original TypeScript source files.
    await remapSourcemap(config.esm2015Dest);
    await remapSourcemap(config.esm2020Dest);
  }

  /** Creates a rollup bundle of a specified JavaScript file.*/
  private async createRollupBundle(config: RollupBundleConfig) {
    const bundleOptions = {
      context: 'this',
      external: Object.keys(rollupGlobals),
      input: config.entry,
      onwarn: (message: string) => {
        // TODO(jelbourn): figure out *why* rollup warns about certain symbols not being found
        // when those symbols don't appear to be in the input file in the first place.
        if (/but never used/.test(message)) {
          return false;
        }

        console.warn(message);
      },
      plugins: [
        rollupRemoveLicensesPlugin,
      ]
    };

    const writeOptions = {
      name: config.moduleName || 'ng.flexLayout',
      amd: {id: config.importName},
      banner: buildConfig.licenseBanner,
      format: config.format,
      file: config.dest,
      globals: rollupGlobals,
      sourcemap: true
    };

    return rollup.rollup(bundleOptions).then((bundle: any) => bundle.write(writeOptions));
  }

  /** Gets the AMD module name for a package and an optional entry point. */
  private getAmdModuleName(packageName: string, entryPointName?: string) {
    let amdModuleName = `ng.${dashCaseToCamelCase(packageName)}`;

    if (entryPointName) {
      amdModuleName += `.${dashCaseToCamelCase(entryPointName)}`;
    }

    return amdModuleName;
  }
}

/** Configuration for creating library bundles. */
interface BundlesConfig {
  entryFile: string;
  esm2015EntryFile: string;
  importName: string;
  moduleName: string;
  esm2015Dest: string;
  esm2020Dest: string;
}

/** Configuration for creating a bundle via rollup. */
interface RollupBundleConfig {
  entry: string;
  dest: string;
  format: string;
  moduleName: string;
  importName: string;
}

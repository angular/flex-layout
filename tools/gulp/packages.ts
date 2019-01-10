import {BuildPackage, buildConfig} from 'lib-build-tools';
import {join} from 'path';

export const flexLayoutPackage = new BuildPackage('flex-layout', []);

// To avoid refactoring of the project the Flex-Layout package will map to the source path `lib/`.
flexLayoutPackage.sourceDir = join(buildConfig.packagesDir, 'lib');

// Re-export secondary entry-points at the root. We don't want to require users to add
// UMD bundles for each secondary entry-points.
flexLayoutPackage.exportsSecondaryEntryPointsAtRoot = true;
flexLayoutPackage.exportsSecondaryEntryPointsAtRootExcludes = ['server'];

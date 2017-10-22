import {BuildPackage, buildConfig} from 'lib-build-tools';
import {join} from 'path';

export const flexLayoutPackage = new BuildPackage('flex-layout', []);

// To avoid refactoring of the project the Flex-Layout package will map to the source path `lib/`.
flexLayoutPackage.sourceDir = join(buildConfig.packagesDir, 'lib');

import {task} from 'gulp';
import {tsBuildTask, copyTask, buildAppTask, serverTask} from '../util/task_helpers';
import {join} from 'path';
import {
  buildConfig, copyFiles, buildScssTask, sequenceTask,  watchFiles
} from 'lib-build-tools';

// These imports don't have any typings provided.
const firebaseTools = require('firebase-tools');

const {outputDir, packagesDir, projectDir} = buildConfig;

/** Path to the directory where all bundles live. */
const bundlesDir = join(outputDir, 'bundles');
const appDir = join(packagesDir, 'demo-app');
const outDir = join(outputDir, 'packages', 'demo-app');

/** Path to the output of the Flex-Layout package. */
const libOutPath = join(outputDir, 'packages', 'flex-layout');

/** Array of vendors that are required to serve the demo-app. */
const appVendors = [
  '@angular', 'systemjs', 'zone.js', 'rxjs', 'hammerjs', 'core-js'
];

/** Glob that matches all required vendors for the demo-app. */
const vendorGlob = `+(${appVendors.join('|')})/**/*.+(html|css|js|map)`;

/** Glob that matches all assets that need to be copied to the output. */
const assetsGlob = join(appDir, `**/*.+(html|css|svg|json)`);

task(':watch:devapp', () => {
   watchFiles(join(appDir, '**/*.ts'), [':build:devapp:ts']);
   watchFiles(join(appDir, '**/*.scss'), [':build:devapp:scss']);
   watchFiles(join(appDir, '**/*.html'), [':build:devapp:assets']);
   watchFiles(join(appDir, '**/*.css'), [':build:devapp:assets']);

   watchFiles(join(libOutPath, '**/*.css'), [':build:devapp:scss']);
});

/** Path to the demo-app tsconfig file. */
const tsconfigPath = join(appDir, 'tsconfig-build.json');

task(':build:devapp:ts', tsBuildTask(tsconfigPath));
task(':build:devapp:scss', buildScssTask(outDir, appDir));
task(':build:devapp:assets', copyTask(assetsGlob, outDir));
task('build:devapp', buildAppTask('devapp'));

task(':serve:devapp', serverTask(outDir, true));

task('serve:devapp', ['build:devapp'], sequenceTask(
  [':serve:devapp', 'flex-layout:watch', ':watch:devapp']
));

/** Task that copies all vendors into the demo-app package. Allows hosting the app on firebase. */
task('stage-deploy:devapp', ['aot:build'], () => {
  copyFiles(join(projectDir, 'node_modules'), vendorGlob, join(outDir, 'node_modules'));
  copyFiles(bundlesDir, '*.+(js|map)', join(outDir, 'dist/bundles'));
  copyFiles(libOutPath, '**/prebuilt/*.+(css|map)', join(outDir, 'dist/packages/flex-layout'));
});

/**
 * Task that deploys the demo-app to Firebase. Firebase project will be the one that is
 * set for project directory using the Firebase CLI.
 */
task('deploy:devapp', ['stage-deploy:devapp'], () => {
  return firebaseTools.deploy({cwd: projectDir, only: 'hosting'})
    // Firebase tools opens a persistent websocket connection and the process will never exit.
    .then(() => { console.log('Successfully deployed the demo-app to firebase'); process.exit(0); })
    .catch((err: any) => { console.log(err); process.exit(1); });
});

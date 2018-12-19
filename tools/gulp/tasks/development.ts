import {task} from 'gulp';
import {execTask} from '../util/task-helpers';
import {join} from 'path';
import {
  buildConfig, copyFiles, sequenceTask,  watchFiles
} from 'lib-build-tools';
import {flexLayoutPackage} from '../packages';

// These imports don't have any typings provided.
const firebaseTools = require('firebase-tools');

const {outputDir, packagesDir, projectDir} = buildConfig;

const appDir = join(packagesDir, 'apps', 'demo-app');
const outDir = join(outputDir, 'packages', 'demo-app');

task(':watch:devapp', () => {
  // Custom watchers for all packages that are used inside of the demo-app. This is necessary
  // because we only want to build the changed package (using the build-no-bundles task).
   watchFiles(join(flexLayoutPackage.sourceDir, '**/!(*.scss)'), ['flex-layout:build-no-bundles']);
});

task(':serve:devapp', ['aot:pre'], execTask(
  'ng', ['serve', '--port', '5000'],
  {cwd: appDir, failOnStderr: true}
));

task('build:devapp', ['aot:pre'], execTask(
  'ng', ['build', '--prod'],
  {cwd: appDir, failOnStderr: true}
));

task('serve:devapp', sequenceTask([':serve:devapp', ':watch:devapp']));

/** Task that copies all vendors into the demo-app package. Allows hosting the app on firebase. */
task('stage-deploy:devapp', ['build:devapp'],
  () => copyFiles(join(appDir, 'dist', 'browser'), '**/*', outDir));

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

import {task} from 'gulp';
import {execTask} from '../util/task_helpers';
import {join} from 'path';
import {buildConfig, copyFiles} from 'lib-build-tools';

// These imports don't have any typings provided.
const firebaseTools = require('firebase-tools');

const {outputDir, packagesDir, projectDir} = buildConfig;

const appDir = join(packagesDir, 'apps', 'demo-app');
const outDir = join(outputDir, 'packages', 'demo-app');

task('serve:devapp', ['aot:pre'], execTask(
  'ng', ['serve', '--port', '5000'],
  {cwd: appDir, failOnStderr: true}
));

task('build:devapp', ['aot:pre'], execTask(
  'ng', ['build', '--prod'],
  {cwd: appDir, failOnStderr: true}
));


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

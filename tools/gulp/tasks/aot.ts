import {task} from 'gulp';
import {join} from 'path';
import {buildConfig, sequenceTask} from 'lib-build-tools';
import {execTask} from '../util/task_helpers';

const {packagesDir} = buildConfig;

/** Path to the demo-app source directory. */
const demoAppSource = join(packagesDir, 'apps', 'demo-app');

/** Build the demo-app and a release to confirm that the library is AOT-compatible. */
task('aot:build', sequenceTask('clean', 'flex-layout:build-release', 'aot:run'));
task('aot:run', sequenceTask('aot:deps', 'aot:cli', 'aot:clean'));

task('aot:deps', [], execTask(
  'npm', ['install'], {cwd: demoAppSource}));

task('aot:cli', execTask(
  'ng', ['build', '--prod'],
  {cwd: demoAppSource, failOnStderr: true}
));

task('aot:clean', sequenceTask('aot:clear:mods', 'aot:clear:lock', 'aot:clear:dist'));

task('aot:clear:mods', [], execTask(
  'rm', ['-rf', 'node_modules'], {
    failOnStderr: true,
    cwd: demoAppSource
  }
));

task('aot:clear:lock', [], execTask(
  'rm', ['package-lock.json'], {
    failOnStderr: false,
    cwd: demoAppSource
  }
));

task('aot:clear:dist', [], execTask(
  'rm', ['-rf', 'dist'], {
    failOnStderr: true,
    cwd: demoAppSource
  }
));

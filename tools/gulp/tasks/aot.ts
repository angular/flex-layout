import {task} from 'gulp';
import {existsSync} from 'fs';
import {join} from 'path';
import {buildConfig, sequenceTask} from 'lib-build-tools';
import {execTask} from '../util/task_helpers';

const {packagesDir} = buildConfig;

/** Path to the demo-app source directory. */
const demoAppSource = join(packagesDir, 'apps', 'demo-app');

/** Build the demo-app and a release to confirm that the library is AOT-compatible. */
task('aot:build', sequenceTask('aot:pre', 'aot:cli'));

task('aot:pre', sequenceTask(
  'aot:build:bazel',
  'aot:clean',
  'aot:deps')
);

task('aot:build:bazel', execTask(
  'bazel', ['build', '...']));

task('aot:deps', [], execTask(
  'yarn', [], {cwd: demoAppSource}));


task('aot:cli', execTask(
  'npm', ['run', 'build'],
  {cwd: demoAppSource, failOnStderr: true}
));

task('aot:clean', sequenceTask('aot:clear:mods', 'aot:clear:lock', 'aot:clear:dist'));

task('aot:clear:mods', [], execTask(
  'rm', ['-rf', 'node_modules'], {
    failOnStderr: true,
    cwd: demoAppSource
  }
));

task('aot:clear:lock', [], existsSync(join(demoAppSource, 'yarn.lock')) ?
  execTask(
  'rm', ['yarn.lock'], {
    failOnStderr: false,
    cwd: demoAppSource
  }) : () => {}
);

task('aot:clear:dist', [], execTask(
  'rm', ['-rf', 'dist'], {
    failOnStderr: true,
    cwd: demoAppSource
  }
));

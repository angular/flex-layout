import {task} from 'gulp';
import {existsSync} from 'fs';
import {join} from 'path';
import {buildConfig, sequenceTask} from 'lib-build-tools';
import {execTask} from '../util/task_helpers';

const {packagesDir} = buildConfig;

/** Path to the demo-app source directory. */
const helloWorldSource = join(packagesDir, 'apps', 'hello-world');

/** Build the hello-world app to check bundle size for regression */
task('hw:build', sequenceTask('hw:pre', 'hw:cli'));

task('hw:pre', sequenceTask(
  'hw:build:bazel',
  'hw:clean',
  'hw:deps')
);

task('hw:build:bazel', execTask(
  'bazel', ['build', '...']));

task('hw:deps', [], execTask(
  'yarn', [], {cwd: helloWorldSource}));


task('hw:cli', execTask(
  'npm', ['run', 'build'],
  {cwd: helloWorldSource, failOnStderr: true}
));

task('hw:clean', sequenceTask('hw:clear:mods', 'hw:clear:lock', 'hw:clear:dist'));

task('hw:clear:mods', [], execTask(
  'rm', ['-rf', 'node_modules'], {
    failOnStderr: true,
    cwd: helloWorldSource
  }
));

task('hw:clear:lock', [], existsSync(join(helloWorldSource, 'yarn.lock')) ?
  execTask(
    'rm', ['yarn.lock'], {
      failOnStderr: false,
      cwd: helloWorldSource
    }) : () => {}
);

task('hw:clear:dist', [], execTask(
  'rm', ['-rf', 'dist'], {
    failOnStderr: true,
    cwd: helloWorldSource
  }
));

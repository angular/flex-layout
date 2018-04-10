import {task} from 'gulp';
import {existsSync} from 'fs';
import {execTask} from '../util/task_helpers';
import {join} from 'path';
import {buildConfig, sequenceTask} from 'lib-build-tools';

const {packagesDir} = buildConfig;
const universalAppSource = join(packagesDir, 'apps', 'universal-app');

task('universal:serve', sequenceTask(
  'prerender',
  'prerender:run:server'
));

task('prerender', sequenceTask(
  'prerender:pre',
  'prerender:build',
  'prerender:webpack')
);
task('prerender:pre', sequenceTask(
  'prerender:build:bazel',
  'prerender:clean',
  'prerender:deps')
);

task('prerender:build:bazel', execTask(
  'bazel', ['build', '...']));

task('prerender:deps', [], execTask(
  'yarn', [], {cwd: universalAppSource}
));

/** Task that builds the universal-app in server mode */
task('prerender:build', execTask(
  'npm', ['run', 'build:ssr:bundle'],
  {cwd: universalAppSource, failOnStderr: true}
));

task('prerender:webpack', execTask(
  'npm', ['run', 'build:server'],
  {cwd: universalAppSource}
));

task('prerender:run:server', execTask(
  'node', ['dist/server.js'],
  {cwd: universalAppSource, failOnStderr: true}
));

task('prerender:clean', sequenceTask(
  'prerender:clear:deps',
  'prerender:clear:dist'
));

task('prerender:clear:deps', [], execTask(
  'rm', ['-rf', 'node_modules'], {
    failOnStderr: true,
    cwd: universalAppSource
  }
));

task('prerender:clear:lock', [], () => existsSync(join(universalAppSource, 'yarn.lock')) ?
  execTask(
    'rm', ['yarn.lock'], {
      failOnStderr: false,
      silent: true,
      cwd: universalAppSource
    }
  ) : () => {}
);

task('prerender:clear:dist', [], execTask(
  'rm', ['-rf', 'dist'], {
    failOnStderr: true,
    cwd: universalAppSource
  }
));

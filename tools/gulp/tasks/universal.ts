import {task} from 'gulp';
import {execTask} from '../util/task_helpers';
import {join} from 'path';
import {buildConfig, sequenceTask} from 'lib-build-tools';

const {outputDir, packagesDir, projectVersion} = buildConfig;
const distDir = join(outputDir, 'releases', 'flex-layout');
const tarBall = join(distDir, `angular-flex-layout-${projectVersion}.tgz`);
const appDir = join(packagesDir, 'apps', 'universal-app');

task('prerender', sequenceTask(
  'prerender:pre',
  'prerender:build',
  'prerender:webpack')
);
task('prerender:pre', sequenceTask(
  'clean',
  'flex-layout:build-release',
  'prerender:bundle',
  'prerender:clean',
  'prerender:deps')
);

task('prerender:bundle', [], execTask(
  'npm', ['pack'], {cwd: distDir}
));

task('prerender:deps', [], execTask(
  'npm', ['install', tarBall], {cwd: appDir}
));

/** Task that builds the universal-app in server mode */
task('prerender:build', execTask(
  'npm', ['run', 'build:ssr:bundle'],
  {cwd: appDir, failOnStderr: true}
));

task('prerender:webpack', execTask(
  'npm', ['run', 'build:server'],
  {cwd: appDir}
));

task('prerender:clean', sequenceTask('prerender:clear:deps', 'prerender:clear:dist'));

task('prerender:clear:deps', [], execTask(
  'rm', ['-rf', 'node_modules'], {
    failOnStderr: true,
    cwd: appDir
  }
));

task('prerender:clear:dist', [], execTask(
  'rm', ['-rf', 'dist'], {
    failOnStderr: true,
    cwd: appDir
  }
));

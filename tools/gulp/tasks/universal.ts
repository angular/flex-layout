import {task} from 'gulp';
import {execTask} from '../util/task_helpers';
import {join} from 'path';
import {buildConfig, sequenceTask} from 'lib-build-tools';

const {outputDir, packagesDir, projectVersion} = buildConfig;
const distDir = join(outputDir, 'releases', 'flex-layout');
const tarName = `angular-flex-layout-${projectVersion}.tgz`;
const genericName = 'angular-flex-layout.tgz';
const genericTar = join(distDir, genericName);
const appDir = join(packagesDir, 'apps', 'universal-app');

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
  'clean',
  'flex-layout:build-release',
  'prerender:bundle',
  'prerender:bundle:rename',
  'prerender:clean',
  'prerender:deps',
  'prerender:add:tar')
);

task('prerender:bundle', [], execTask(
  'npm', ['pack'], {cwd: distDir}
));

task('prerender:bundle:rename', [], execTask(
  'mv', [tarName, genericName], {cwd: distDir}
));

task('prerender:deps', [], execTask(
  'npm', ['install'], {cwd: appDir}
));

task('prerender:add:tar', [], execTask(
  'npm', ['install', genericTar], {cwd: appDir}
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

task('prerender:run:server', execTask(
  'node', ['dist/server.js'],
  {cwd: appDir, failOnStderr: true}
));

task('prerender:clean', sequenceTask(
  'prerender:clear:deps',
  'prerender:clear:dist',
  'prerender:clear:lock'
));

task('prerender:clear:deps', [], execTask(
  'rm', ['-rf', 'node_modules'], {
    failOnStderr: true,
    cwd: appDir
  }
));

task('prerender:clear:lock', [], execTask(
  'rm', ['package-lock.json'], {
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

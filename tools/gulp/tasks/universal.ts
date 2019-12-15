import {task} from 'gulp';
import {execTask} from '../util/task-helpers';
import {join} from 'path';
import {buildConfig, sequenceTask} from 'lib-build-tools';

const genericName = 'angular-flex-layout.tgz';
const {outputDir, packagesDir, projectVersion} = buildConfig;
const tarName = `angular-flex-layout-${projectVersion}.tgz`;
const distDir = join(outputDir, 'releases', 'flex-layout');
const genericTar = join(distDir, genericName);
const universalAppSource = join(packagesDir, 'apps', 'universal-app');

task('universal:serve', sequenceTask(
  'prerender',
  'prerender:run:server'
));

task('prerender', sequenceTask(
  'prerender:pre',
  'prerender:build')
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

task('prerender:deps', [], execTask(
  'npm', ['install'], {cwd: universalAppSource}
));

/**
 * The following tasks bundle Flex Layout into a tar file that can be installed
 * directly instead of linked to via sym link. When linking, there are some issues
 * that npm introduces, like Angular functionality impairment. This also has the
 * benefit of better simulating the install process for Flex Layout in a CLI app
 */
task('prerender:add:tar', [], execTask(
  'npm', ['install', genericTar], {cwd: universalAppSource}
));

task('prerender:bundle', [], execTask(
  'npm', ['pack'], {cwd: distDir}
));

task('prerender:bundle:rename', [], execTask(
  'mv', [tarName, genericName], {cwd: distDir}
));

/** Task that builds the universal-app in server mode */
task('prerender:build', execTask(
  'yarn', ['build:ssr'],
  {cwd: universalAppSource, failOnStderr: true}
));

task('prerender:run:server', execTask(
  'yarn', ['start:ssr'],
  {cwd: universalAppSource, failOnStderr: true}
));

task('prerender:clean', sequenceTask(
  'prerender:clear:deps',
  'prerender:clear:lock',
  'prerender:clear:dist'
));

task('prerender:clear:deps', [], execTask(
  'rm', ['-rf', 'node_modules'], {
    failOnStderr: true,
    cwd: universalAppSource
  }
));

task('prerender:clear:lock', [], execTask(
    'rm', ['-f', 'package-lock.json'], {
      failOnStderr: false,
      silent: true,
      cwd: universalAppSource
    }
  )
);

task('prerender:clear:dist', [], execTask(
  'rm', ['-rf', 'dist'], {
    failOnStderr: true,
    cwd: universalAppSource
  }
));

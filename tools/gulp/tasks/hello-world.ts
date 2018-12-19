import {task} from 'gulp';
import {existsSync} from 'fs';
import {join} from 'path';
import {buildConfig, sequenceTask} from 'lib-build-tools';
import {execTask} from '../util/task-helpers';

const {outputDir, packagesDir, projectVersion} = buildConfig;

/** Path to the demo-app source directory. */
const genericName = 'angular-flex-layout.tgz';
const helloWorldSource = join(packagesDir, 'apps', 'hello-world');
const tarName = `angular-flex-layout-${projectVersion}.tgz`;
const distDir = join(outputDir, 'releases', 'flex-layout');
const genericTar = join(distDir, genericName);

/** Build the hello-world app to check bundle size for regression */
task('hw:build', sequenceTask('hw:pre', 'hw:cli'));

task('hw:pre', sequenceTask(
  'clean',
  'flex-layout:build-release',
  'hw:bundle',
  'hw:bundle:rename',
  'hw:clean',
  'hw:deps',
  'hw:add:tar')
);

task('hw:deps', [], execTask(
  'npm', ['install'], {cwd: helloWorldSource}));


/**
 * The following tasks bundle Flex Layout into a tar file that can be installed
 * directly instead of linked to via sym link. When linking, there are some issues
 * that npm introduces, like Angular functionality impairment. This also has the
 * benefit of better simulating the install process for Flex Layout in a CLI app
 */
task('hw:add:tar', [], execTask(
  'npm', ['install', genericTar], {cwd: helloWorldSource}
));

task('hw:bundle', [], execTask(
  'npm', ['pack'], {cwd: distDir}
));

task('hw:bundle:rename', [], execTask(
  'mv', [tarName, genericName], {cwd: distDir}
));

task('hw:cli', execTask(
  'yarn', ['ng', 'build', '--prod'],
  {cwd: helloWorldSource, failOnStderr: true}
));

task('hw:clean', sequenceTask('hw:clear:mods', 'hw:clear:lock', 'hw:clear:dist'));

task('hw:clear:mods', [], execTask(
  'rm', ['-rf', 'node_modules'], {
    failOnStderr: true,
    cwd: helloWorldSource
  }
));

task('hw:clear:lock', [], existsSync(join(helloWorldSource, 'package-lock.json')) ?
  execTask(
    'rm', ['package-lock.json'], {
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

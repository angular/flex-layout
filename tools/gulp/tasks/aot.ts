import {task} from 'gulp';
import {existsSync} from 'fs';
import {join} from 'path';
import {buildConfig, sequenceTask} from 'lib-build-tools';
import {execTask} from '../util/task-helpers';

const {outputDir, packagesDir, projectVersion} = buildConfig;

/** Path to the demo-app source directory. */
const genericName = 'angular-flex-layout.tgz';
const demoAppSource = join(packagesDir, 'apps', 'demo-app');
const tarName = `angular-flex-layout-${projectVersion}.tgz`;
const distDir = join(outputDir, 'releases', 'flex-layout');
const genericTar = join(distDir, genericName);

/** Build the demo-app and a release to confirm that the library is AOT-compatible. */
task('aot:build', sequenceTask('aot:pre', 'aot:cli'));

task('aot:pre', sequenceTask(
  'clean',
  'flex-layout:build-release',
  'aot:bundle',
  'aot:bundle:rename',
  'aot:clean',
  'aot:deps',
  'aot:add:tar')
);

task('aot:deps', [], execTask(
  'npm', ['install'], {cwd: demoAppSource}));


/**
 * The following tasks bundle Flex Layout into a tar file that can be installed
 * directly instead of linked to via sym link. When linking, there are some issues
 * that npm introduces, like Angular functionality impairment. This also has the
 * benefit of better simulating the install process for Flex Layout in a CLI app
 */
task('aot:add:tar', [], execTask(
  'npm', ['install', genericTar], {cwd: demoAppSource}
));

task('aot:bundle', [], execTask(
  'npm', ['pack'], {cwd: distDir}
));

task('aot:bundle:rename', [], execTask(
  'mv', [tarName, genericName], {cwd: distDir}
));

task('aot:cli', execTask(
  'yarn', ['ng', 'build', '--prod'],
  {cwd: demoAppSource, failOnStderr: true}
));

task('aot:clean', sequenceTask('aot:clear:mods', 'aot:clear:lock', 'aot:clear:dist'));

task('aot:clear:mods', [], execTask(
  'rm', ['-rf', 'node_modules'], {
    failOnStderr: true,
    cwd: demoAppSource
  }
));

task('aot:clear:lock', [], existsSync(join(demoAppSource, 'package-lock.json')) ?
  execTask(
  'rm', ['package-lock.json'], {
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

import {spawn} from 'child_process';
import {existsSync, statSync} from 'fs-extra';
import {join} from 'path';
import {task} from 'gulp';
import {execTask} from '../util/task_helpers';
import {buildConfig, sequenceTask} from 'lib-build-tools';
import {yellow, green, red, grey} from 'chalk';
import * as minimist from 'minimist';

/** Packages that will be published to NPM by the release task. */
export const releasePackages = [
  'flex-layout'
];

/** Parse command-line arguments for release task. */
const argv = minimist(process.argv.slice(3));

task('publish', sequenceTask(
  ':publish:whoami',
  ':publish:build-releases',
  'validate-release:check-bundles',
  ':publish',
  ':publish:logout',
));

/** Task that builds all releases that will be published. */
task(':publish:build-releases', sequenceTask(
  'clean',
  releasePackages.map(packageName => `${packageName}:build-release`)
));

/** Make sure we're logged in. */
task(':publish:whoami', execTask('npm', ['whoami'], {
  silent: true,
  errMessage: 'You must be logged in to publish.'
}));

task(':publish:logout', execTask('npm', ['logout']));

task(':publish', async () => {
  const label = argv['tag'];
  const version = buildConfig.projectVersion;
  const currentDir = process.cwd();

  console.log('');
  if (!label) {
    console.log(yellow('You can use a label with --tag=labelName.'));
    console.log(yellow(`Publishing version ${version} using the latest tag.`));
  } else {
    console.log(yellow(`Publishing ${version} using the ${label} tag.`));
  }
  console.log('');

  if (releasePackages.length > 1) {
    console.warn(red('Warning: Multiple packages will be released if proceeding.'));
    console.warn(red('Warning: Packages to be released: ', releasePackages.join(', ')));
  }

  console.log(yellow('> Make sure to check the "angularVersion" in the build config.'));
  console.log(yellow('> The version in the config defines the peer dependency of Angular.'));
  console.log();

  // Iterate over every declared release package and publish it on NPM.
  for (const packageName of releasePackages) {
    await _execNpmPublish(label, packageName);
  }

  process.chdir(currentDir);
});

function _execNpmPublish(label: string, packageName: string): Promise<{}> | undefined {
  const packageDir = join(buildConfig.outputDir, 'releases', packageName);

  if (!statSync(packageDir).isDirectory()) {
    return;
  }

  if (!existsSync(join(packageDir, 'package.json'))) {
    throw new Error(`"${packageDir}" does not have a package.json.`);
  }

  if (!existsSync(join(packageDir, 'LICENSE'))) {
    throw new Error(`"${packageDir}" does not have a LICENSE file`);
  }

  process.chdir(packageDir);
  console.log(green(`Publishing ${packageName}...`));

  const command = 'npm';
  const args = ['publish', '--access', 'public'];

  if (label) {
    args.push('--tag', label);
  }

  return new Promise((resolve, reject) => {
    console.log(grey(`Executing: ${command} ${args.join(' ')}`));
    if (argv['dry']) {
      resolve();
      return;
    }

    const childProcess = spawn(command, args);
    childProcess.stdout.on('data', (data: Buffer) => {
      console.log(`  stdout: ${data.toString().split(/[\n\r]/g).join('\n          ')}`);
    });
    childProcess.stderr.on('data', (data: Buffer) => {
      console.error(`  stderr: ${data.toString().split(/[\n\r]/g).join('\n          ')}`);
    });

    childProcess.on('close', (code: number) => {
      if (code == 0) {
        resolve();
      } else {
        reject(new Error(`Could not publish ${packageName}, status: ${code}.`));
      }
    });
  });
}

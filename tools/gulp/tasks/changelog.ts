import {src, task, dest} from 'gulp';
import {spawnSync} from 'child_process';
import path = require('path');

import parseArgs = require('minimist');
import gulpUtils = require('gulp-util');
import fs = require('fs');
const addStream = require('add-stream');
const chalk = gulpUtils.colors;
const log = gulpUtils.log;

const changelog = require('conventional-changelog');
const semver = require('semver');
const args = parseArgs(process.argv.slice(2),{'string':["sha","SHA"]});

const SHA : string = args['sha'] || args['SHA'];
const ROOT = path.normalize(__dirname + '/../../..');
const VERSION = args['version'] || require(path.join(ROOT,'package.json')).version;

/**
 * Expected `gulp changelog --sha=ad58e11`
 */
task('changelog', function() {

  const changelogPath = path.join(ROOT, 'CHANGELOG.md');
  const previousTag = getLatestTag();
  const currentTag = 'v' + VERSION;
  const contextOptions = {
    version: VERSION,
    previousTag: previousTag.name,
    currentTag: currentTag
  };

  /* Validate different fork points for the changelog generation */
  if (previousTag.name === currentTag && !SHA) {
    log(chalk.yellow('Warning: You are generating a changelog by comparing the same versions.'));
  } else if (SHA) {
    log('Generating changelog from commit ' + getShortSha(SHA) + '...');
  } else {
    let shortSha = getShortSha(previousTag.sha);
    log('Generating changelog from tag ' + previousTag.name + ' (' + shortSha + ')');
  }

  /* Create our changelog and append the current changelog stream. */
  const inputStream = fs.createReadStream(changelogPath);
  let changelogStream = changelog(
        { preset: 'angular' },
        contextOptions,
        { from: SHA || previousTag.sha}
  ).pipe(addStream(inputStream));


  /* Wait for the changelog to be ready and overwrite it. */
  inputStream.on('end', function() {
    changelogStream.pipe(fs.createWriteStream(changelogPath));
  });


});

/**
 * Resolves the latest tag over all branches from the repository metadata.
 * @returns {{sha: string, name: string}}
 */
function getLatestTag() {
  var tagSha = spawnSync('git', ['rev-list', '--tags', '--max-count=1']).stdout.toString().trim();
  var tagName =  spawnSync('git', ['describe', '--tags', tagSha]).stdout.toString().trim();

  return {
    sha: tagSha,
    name: tagName
  }
}

/**
 * Transforms a normal SHA-1 into a 7-digit SHA.
 * @returns {string} shortened SHA
 */
function getShortSha(sha:string) {
  return sha.substring(0, 7);
}

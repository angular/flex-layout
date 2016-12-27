import {src, task, dest} from 'gulp';
import {spawnSync} from 'child_process';
import path = require('path');
import minimist = require('minimist');
import gulpUtils = require('gulp-util');

let changelog = require('gulp-conventional-changelog');

const args = minimist(process.argv.slice(2));
const chalk = gulpUtils.colors;
const log = gulpUtils.log;

const SHA = args['sha'] || args['SHA'];
const ROOT = path.normalize(__dirname + '/../../..');
const VERSION = args['version'] || require(path.join(ROOT,'package.json')).version;

/**
 * Expected `gulp changelog --sha=ad58e11`
 */
task('changelog', function() {

  var changelogPath = path.join(ROOT, 'CHANGELOG.md');
  var previousTag = getLatestTag();
  var currentTag = 'v' + VERSION;
  var contextOptions = {
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
    var shortSha = getShortSha(previousTag.sha);
    log('Generating changelog from tag ' + previousTag.name + ' (' + shortSha + ')');
  }

  return src(changelogPath, {
    buffer:false
  }).pipe(changelog({
    preset: 'angular'
  }, contextOptions, {
    from: SHA || previousTag.sha
  }).pipe(dest(ROOT)));

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
function getShortSha(sha) {
  return sha.substring(0, 7);
}

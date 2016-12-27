import {src, task, dest} from 'gulp';
import {spawnSync} from 'child_process';
import path = require('path');
import minimist = require('minimist');
import gulpUtils = require('gulp-util');

const changelog = require('gulp-conventional-changelog');
const semver = require('semver');

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

  const changelogPath = path.join(ROOT, 'CHANGELOG.md');
  const previousTag = getLatestTag();
  const currentTag = 'v' + VERSION;
  const fromSHA = SHA || previousTag.sha;
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

  return src(changelogPath)
    .pipe(changelog({ preset: 'angular' }, contextOptions, {
      from: fromSHA
    }, {}, {
      generateOn: _shouldGenerate
    }))
    .pipe(dest(ROOT));

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

/**
 * Function which determines whether the conventional-changelog should create
 * a new section in the CHANGELOG or not.
 *
 * - If a SHA is specified, the first checked SHA will be used to generate a new section.
 * - By default it just checks if the commit is tagged and if the version is valid.
 *
 * @param {Object=} commit Parsed commit from the conventional-changelog-parser.
 */
let _isGenerated = 0;
function _shouldGenerate(commit) {
  return SHA ? _isGenerated++ === 0 : semver.valid(commit.version);
}

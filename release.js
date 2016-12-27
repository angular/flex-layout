(function () {
  'use strict';

  const SOURCE_REPO  = 'flex-layout';
  const SOURCE_REPO_TITLE = 'Angular Flex-Layout';
  const BUILD_REPO   = 'flex-layout-builds';

  var colors         = require('colors');
  var strip          = require('cli-color/strip');
  var fs             = require('fs');
  var prompt         = require('prompt-sync');
  var child_process  = require('child_process');
  var pkg            = require('./package.json');
  var oldVersion     = pkg.version;
  var abortCmds      = [ 'git reset --hard', 'git checkout staging', 'rm abort push' ];
  var pushCmds       = [ 'rm abort push' ];
  var cleanupCmds    = [];
  var defaultOptions = { encoding: 'utf-8' };
  var origin         = 'git@github.com:angular/flex-layout.git';
  var lineWidth      = 80;
  var lastMajorVer   = "2.0.0.-beta.1";   //JSON.parse(exec(`curl ${URL_VERSIONS}`)).latest;
  var newVersion;
  var dryRun;

  header();
  write(`Is this a dry-run? ${"[yes/no]".cyan} `);
  dryRun = prompt() !== 'no';

  if (dryRun) {
    write(`What would you like the old version to be? (default: ${oldVersion.cyan}) `);
    oldVersion = prompt() || oldVersion;
    build();
  } else if (validate()) {
    build();
  }

  function build () {
    newVersion = getNewVersion();

    line();

    checkoutVersionBranch();
    updateVersion();
    createChangelog();
    commitChanges();
    tagRelease();
    cloneRepo(BUILD_REPO);
    generateLatestBuild();
    updateMaster();
    writeScript('abort', abortCmds.concat(cleanupCmds));
    if (!dryRun) writeScript('push', pushCmds.concat(cleanupCmds));

    line();
    log('Your repo is ready to be pushed.');
    log(`Please look over ${"CHANGELOG.md".cyan} and make any changes.`);
    log(`When you are ready, please run "${"./push".cyan}" to finish the process.`);
    log('If you would like to cancel this release, please run "./abort"');
  }

  //-- utility methods

  /** confirms that you will be able to perform the release before attempting */
  function validate () {
    if (exec('npm whoami') !== 'angularcore') {
      err('You must be authenticated with npm as "angularcore" to perform a release.');
    } else if (exec('git rev-parse --abbrev-ref HEAD') !== 'staging') {
      err('Releases can only performed from "staging" at this time.');
    } else {
      return true;
    }
    function err (msg) {
      var str = 'Error: ' + msg;
      log(str.red);
    }
  }

  /** creates the version branch and adds abort steps */
  function checkoutVersionBranch () {
    exec(`git branch -q -D release/${newVersion}`);
    exec(`git checkout -q -b release/${newVersion}`);
    abortCmds.push('git co master');
    abortCmds.push(`git branch -D release/${newVersion}`);
  }

  /** writes the new version to package.json */
  function updateVersion () {
    start(`Updating ${"package.json".cyan} version from ${oldVersion.cyan} to ${newVersion.cyan}...`);

    // Update the repo-root package.json
    pkg.version = newVersion;
    fs.writeFileSync('./package.json', JSON.stringify(pkg, null, 2));

    // update the package.json deploy to npm
    let npmPackagePath = './tools/scripts/release/npm_assets/package.json';
    pkg = require(npmPackagePath);
    pkg.version = newVersion;
    fs.writeFileSync(npmPackagePath, JSON.stringify(pkg, null, 2));

    done();

    abortCmds.push('git checkout package.json');
    abortCmds.push(`gig checkout ${npmPackagePath}`);

    pushCmds.push('git add package.json');
    pushCmds.push(`git add ${npmPackagePath}`);
  }

  /** generates the changelog from the commits since the last release */
  function createChangelog () {
    start(`Generating changelog from ${oldVersion.cyan} to ${newVersion.cyan}...`);

    exec(`git fetch --tags ${origin}`);
    exec(`git checkout v${lastMajorVer} -- CHANGELOG.md`);
    exec(`gulp changelog --sha=$(git merge-base v${lastMajorVer} HEAD)`);

    done();

    abortCmds.push('git checkout CHANGELOG.md');
    pushCmds.push('git add CHANGELOG.md');
  }

  /** utility method for clearing the terminal */
  function clear () {
    write("\u001b[2J\u001b[0;0H");
  }

  /** prompts the user for the new version */
  function getNewVersion () {
    header();
    var options = getVersionOptions(oldVersion), key, type, version;
    log(`The current version is ${oldVersion.cyan}.`);
    log('');
    log('What should the next version be?');
    for (key in options) { log((+key + 1) + ') ' + options[ key ].cyan); }
    log('');
    write('Please select a new version: ');
    type = prompt();

    if (options[ type - 1 ]) version = options[ type - 1 ];
    else if (type.match(/^\d+\.\d+\.\d+(-rc\.?\d+)?$/)) version = type;
    else throw new Error('Your entry was invalid.');

    log('');
    log('The new version will be ' + version.cyan + '.');
    write(`Is this correct? ${"[yes/no]".cyan} `);
    return prompt() === 'yes' ? version : getNewVersion();

    function getVersionOptions (version) {
      return version.match(/-rc\.?\d+$/)
          ? [ increment(version, 'rc'), increment(version, 'minor') ]
          : [ increment(version, 'patch'), addRC(increment(version, 'minor')) ];

      function increment (versionString, type) {
        var version = parseVersion(versionString);
        if (version.rc) {
          switch (type) {
            case 'minor': version.rc = 0; break;
            case 'rc': version.rc++; break;
          }
        } else {
          version[ type ]++;
          //-- reset any version numbers lower than the one changed
          switch (type) {
            case 'minor': version.patch = 0;
            case 'patch': version.rc = 0;
          }
        }
        return getVersionString(version);

        function parseVersion (version) {
          var parts = version.split(/\-rc\.|\./g);
          return {
            string: version,
            major:  parts[ 0 ],
            minor:  parts[ 1 ],
            patch:  parts[ 2 ],
            rc:     parts[ 3 ] || 0
          };
        }

        function getVersionString (version) {
          var str = version.major + '.' + version.minor + '.' + version.patch;
          if (version.rc) str += '-rc.' + version.rc;
          return str;
        }
      }

      function addRC (str) {
        return str + '-rc.1';
      }
    }
  }

  /** adds git tag for release and pushes to github */
  function tagRelease () {
    pushCmds.push(
        `git tag v${newVersion} -f`,
        `git push ${origin} HEAD`,
        `git push --tags ${origin}`
    );
  }

  /** amends the commit to include local changes (ie. changelog) */
  function commitChanges () {
    start('Committing changes...');
    exec(`git commit -am "release: version ${newVersion}"`);
    done();
    pushCmds.push('git commit --amend --no-edit');
  }

  /** utility method for cloning github repos */
  function cloneRepo (repo) {
    start(`Cloning ${repo.cyan} from Github...`);
    exec(`rm -rf ${repo}`);
    exec(`git clone git@github.com:angular/${repo}.git --depth=1`);
    done();
    cleanupCmds.push(`rm -rf ${repo}`);
  }

  /** writes an array of commands to a bash script */
  function writeScript (name, cmds) {
    fs.writeFileSync(name, '#!/usr/bin/env bash\n\n' + cmds.join('\n'));
    exec('chmod +x ' + name);
  }

  /** updates the version for flex-layout-builds in package.json  */
  function generateLatestBuild () {
    start('Building deployed files...');
    exec([
      'rm -rf dist',
      'gulp build:release'
     ]);
    done();

    start(`Copy files into ${BUILD_REPO} repo...`);
    exec([
           'cp -Rf ../dist/* ./',
           'git add -A',
           `git commit -m "release: version ${newVersion}"`,
           'rm -rf ../dist'
         ], options);
    done();

    //-- add steps to push script
    pushCmds.push(
      comment('push to builds (master and tag) and publish to npm'),
      'cd ' + options.cwd,
      'cp ../CHANGELOG.md .',
      'git add CHANGELOG.md',
      'git commit --amend --no-edit',
      `git tag -f v${newVersion}`,
      'git pull --rebase --strategy=ours',
      'git push',
      'git push --tags',
      'npm publish',
      'cd ..'
    );
  }


  /** copies the changelog back over to master branch */
  function updateMaster () {
    pushCmds.push(
        comment('update package.json in master'),
        'git checkout master',
        `git pull --rebase ${origin} master --strategy=theirs`,
        `git checkout release/${newVersion} -- CHANGELOG.md`,
        `node -e "var newVersion = '${newVersion}'; ${stringifyFunction(buildCommand)}"`,
        'git add CHANGELOG.md',
        'git add package.json',
        `git commit -m "update version number in package.json to ${newVersion}"`,
        `git push ${origin} master`
    );

    function buildCommand () {
      require('fs').writeFileSync('package.json', JSON.stringify(getUpdatedJson(), null, 2));
      function getUpdatedJson () {
        var json = require('./package.json');
        json.version = newVersion;
        return json;
      }
    }

    function stringifyFunction (method) {
      return method
          .toString()
          .split('\n')
          .slice(1, -1)
          .map(function (line) { return line.trim(); })
          .join(' ')
          .replace(/"/g, '\\"');
    }
  }

  /** utility method to output header */
  function header () {
    clear();
    line();
    log(center(`${SOURCE_REPO_TITLE} Release v${newVersion}`));
    line();
  }

  /** outputs a centered message in the terminal */
  function center (msg) {
    msg        = ' ' + msg.trim() + ' ';
    var length = msg.length;
    var spaces = Math.floor((lineWidth - length) / 2);
    return Array(spaces + 1).join('-') + msg.green + Array(lineWidth - msg.length - spaces + 1).join('-');
  }

  /** outputs done text when a task is completed */
  function done () {
    log('done'.green);
  }

  /** utility method for executing terminal commands */
  function exec (cmd, userOptions) {
    if (cmd instanceof Array) {
      return cmd.map(function (cmd) { return exec(cmd, userOptions); });
    }
    try {
      var options = Object.create(defaultOptions);
      for (var key in userOptions) options[ key ] = userOptions[ key ];
      return child_process.execSync(cmd + ' 2> /dev/null', options).toString().trim();
    } catch (err) {
      return err;
    }
  }

  /** returns a commented message for use in bash scripts */
  function comment (msg) {
    return '\n# ' + msg + '\n';
  }

  /** prints the left side of a task while it is being performed */
  function start (msg) {
    var msgLength = strip(msg).length,
        diff      = lineWidth - 4 - msgLength;
    write(msg + Array(diff + 1).join(' '));
  }

  /** outputs to the terminal with string variable replacement */
  function log (msg) {
    msg = msg || '';
    console.log(msg);
  }

  /** writes a message without a newline */
  function write (msg) {
    process.stdout.write(msg);
  }

  /** prints a horizontal line to the terminal */
  function line () {
    log(Array(lineWidth + 1).join('-'));
  }
})();

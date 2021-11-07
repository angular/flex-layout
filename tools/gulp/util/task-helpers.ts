import child_process from 'child_process';
import gulp from 'gulp';

/* Those imports lack typings. */
const gulpClean = require('gulp-clean');

// There are no type definitions available for these imports.
const resolveBin = require('resolve-bin');


/** Creates a task that runs the TypeScript compiler */
export function tsBuildTask(tsConfigPath: string) {
  return execNodeTask('typescript', 'tsc', ['-p', tsConfigPath]);
}

/** Options that can be passed to execTask or execNodeTask. */
export interface ExecTaskOptions {
  // Whether STDOUT and STDERR messages should be printed.
  silent?: boolean;
  // Whether STDOUT messages should be printed.
  silentStdout?: boolean;
  // If an error happens, this will replace the standard error.
  errMessage?: string;
  // Environment variables being passed to the child process.
  env?: any;
  // Whether the task should fail if the process writes to STDERR.
  failOnStderr?: boolean;
  // Change the working directory if necessary
  cwd?: string;
}

/** Create a task that executes a binary as if from the command line. */
export function execTask(binPath: string, args: string[], options: ExecTaskOptions = {}) {
  return (done: (err?: string) => void) => {
    const env = {...process.env, ...options.env};
    const childProcess = child_process.spawn(binPath, args, {env, cwd: options.cwd});
    const stderrData: string[] = [];

    if (!options.silentStdout && !options.silent) {
      childProcess.stdout.on('data', (data: string) => process.stdout.write(data));
    }

    if (!options.silent || options.failOnStderr) {
      childProcess.stderr.on('data', (data: string) => {
        options.failOnStderr && !/\s/.test(data) && !data.includes('Compiling') ?
          stderrData.push(data) : process.stderr.write(data);
      });
    }

    childProcess.on('close', (code: number) => {
      if (options.failOnStderr && stderrData.length) {
        done(stderrData.join('\n'));
      } else {
        code != 0 ? done(options.errMessage || `Process failed with code ${code}`) : done();
      }
    });
  };
}

/**
 * Create a task that executes an NPM Bin, by resolving the binary path then executing it. These are
 * binaries that are normally in the `./node_modules/.bin` directory, but their name might differ
 * from the package. Examples are typescript, ngc and gulp itself.
 */
export function execNodeTask(packageName: string, executable: string | string[], args?: string[],
                             options: ExecTaskOptions = {}) {
  if (!args) {
    args = <string[]>executable;
    executable = '';
  }

  return (done: (err: any) => void) => {
    resolveBin(packageName, { executable: executable }, (err: any, binPath: string) => {
      if (err) {
        done(err);
      } else {
        // Execute the node binary within a new child process using spawn.
        // The binary needs to be `node` because on Windows the shell cannot determine the correct
        // interpreter from the shebang.
        execTask('node', [binPath].concat(args!), options)(done);
      }
    });
  };
}


/** Delete files. */
export function cleanTask(glob: string) {
  return () => gulp.src(glob, { read: false, allowEmpty: true }).pipe(gulpClean(null));
}

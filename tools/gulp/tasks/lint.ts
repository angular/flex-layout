import {task} from 'gulp';
import {execNodeTask} from '../util/task-helpers';

/** Glob that matches all SCSS or CSS files that should be linted. */
const styleGlob = 'src/lib/**/*.+(css|scss)';

/** List of flags that will passed to the different TSLint tasks. */
const tsLintBaseFlags = ['-c', 'tslint.json', '--project', './tsconfig.json'];

task('lint', ['tslint', 'stylelint']);

/** Task to lint Angular Layout's scss stylesheets. */
task('stylelint', execNodeTask(
  'stylelint', [styleGlob, '--config', 'stylelint-config.json', '--syntax', 'scss']
));

/** Task to run TSLint against the e2e/ and src/ directories. */
task('tslint', execNodeTask('tslint', tsLintBaseFlags));

/** Task that automatically fixes TSLint warnings. */
task('tslint:fix', execNodeTask('tslint', [...tsLintBaseFlags, '--fix']));

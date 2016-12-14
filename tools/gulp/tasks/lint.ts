import gulp = require('gulp');
import {execNodeTask} from '../task_helpers';


gulp.task('lint', ['tslint', 'madge']);
gulp.task('madge', ['build:release'], execNodeTask('madge', ['--circular', './dist']));
gulp.task('tslint', execNodeTask('tslint', ['-c', 'tslint.json', 'src/lib/**/*.ts']));

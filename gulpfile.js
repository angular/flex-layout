var gulp = require('gulp');
var ts = require('gulp-typescript');
var watch = require('gulp-watch');


var typescript = require('typescript');

var CONFIG = {
  srcPath: 'src/**/*.ts',
  outDir: 'dist/'
};

// Create a gulp.Typescript project allowing for incremental compilation
// which means faster builds.
var tsProject = ts.createProject('tsconfig.json', {
  module: 'commonjs',
  typescript: typescript
});

gulp.task('build-ts', function() {
  var tsCode = tsProject.src(CONFIG.srcPath)
    .pipe(ts(tsProject));

  return tsCode.pipe(gulp.dest(CONFIG.outDir));
});

gulp.task('watch', function() {
  watch(CONFIG.srcPath, function() {
    gulp.start('build-ts');
  });
});

gulp.task('default', ['watch']);

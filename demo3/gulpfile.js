var gulp = require('gulp');
var less = require('gulp-less');
var path = require('path');


var paths = {
  lessFilesFolder: 'src/less/**/*.less',
  lessMainFile: 'src/less/main.less',
  outputCssFolder: 'css'
};

gulp.task('less', function () {
  return gulp.src(paths.lessMainFile)
    .pipe(less({
      paths: [ path.join(paths.lessFilesFolder, 'less', 'includes') ]
    }))
    .on('error',  onLessError)
    .pipe(gulp.dest(paths.outputCssFolder));
});

// Rerun the task when a file changes
gulp.task('watch', function() {
  gulp.watch(paths.lessFilesFolder, ['less']);
});

gulp.task('default', ['watch', 'less']);

function onLessError (err) {
  console.log('!!! Less ERROR !!!',err);
  this.emit('end');
}
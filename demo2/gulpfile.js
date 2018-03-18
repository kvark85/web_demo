var gulp = require('gulp');
var less = require('gulp-less');
var path = require('path');


var paths = {
  lessFiles: 'src/less/**/*.less',
  lessMain: 'src/less/main.less'
};

gulp.task('less', function () {
  return gulp.src(paths.lessMain)
      .pipe(less({
        paths: [ path.join(paths.lessFiles, 'less', 'includes') ]
      }))
      .on('error',  onLessError)
      .pipe(gulp.dest('css'));
});

// Rerun the task when a file changes
gulp.task('watch', function() {
  gulp.watch(paths.lessFiles, ['less']);
});

gulp.task('default', ['watch', 'less']);

function onLessError (err) {
  console.log('!!! Less ERROR !!!',err);
  this.emit('end');
}
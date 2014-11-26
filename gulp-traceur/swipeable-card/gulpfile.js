var gulp = require('gulp');
var rename = require('gulp-rename');
var traceur = require('gulp-traceur');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var del = require('del');

gulp.task('traceur', function () {
    return gulp.src(['swipeable-card-src.js'])
         .pipe(traceur())
        .pipe(rename('swipeable-card.js'))
        .pipe(gulp.dest('.'));
});

gulp.task('clean', del.bind(null, ['swipeable-card.js'], {dot: true}));

gulp.task('default', ['clean'], function (cb) {
  runSequence('traceur', ['serve'], cb);
});

gulp.task('serve', [], function () {
  browserSync({
    notify: false,
    server: ['.']
  });

  gulp.watch(['*.js'], reload);
});
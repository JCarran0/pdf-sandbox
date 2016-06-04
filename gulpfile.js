'use strict';

const gulp = require('gulp');
const dust = require('gulp-dust');
const watch = require('gulp-watch');

gulp.task('default', ['watch']);

gulp.task('compile', () => {
  console.log('compiling')
  return gulp.src('templates/profile.html')
    .pipe(dust())
    .pipe(gulp.dest('dist'));
});

gulp.task('watch', function() {
  gulp.watch([
    './*.js',
    './templates/*.html'
    ], ['compile']);
});
'use strict';

const gulp = require('gulp');
const dust = require('gulp-dust');
const nodemon = require('gulp-nodemon');

gulp.task('default', ['watch']);

gulp.task('compile', () => {
  console.log('compiling');
  return gulp.src('templates/studentProfile.html')
    .pipe(dust())
    .pipe(gulp.dest('dist'));
});

gulp.task('watch', function () {
  console.log('watching...');
  gulp.watch([
    './*.js',
    './templates/*.html'
    ], ['compile']);
});

gulp.task('start', ['watch'], function () {
  nodemon({
    script: 'app.js',
    ext: 'js html',
    env: { 'NODE_ENV': 'development' }
  });
});

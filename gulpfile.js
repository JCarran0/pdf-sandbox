'use strict';

const gulp = require('gulp');
const dust = require('gulp-dust');
const nodemon = require('gulp-nodemon');
const render = require('./render.js');

gulp.task('default', ['watch']);

gulp.task('compile', () => {
  console.log('compiling');
  return gulp.src('templates/studentProfile.html')
    .pipe(dust())
    .pipe(gulp.dest('dist'));
});

gulp.task('watch', ['compile'], function () {
  console.log('watching...');
  gulp.watch([
    './*.js',
    './templates/*.html'
    ], ['compile']);
});

gulp.task('start', function () {
  nodemon({
    script: 'render.js',
    ext: 'js html',
    tasks: ['compile'],
    delay: '2500'
  });
});

gulp.task('render', function () {
  return render();
});

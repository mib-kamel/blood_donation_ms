'use strict';

var gulp = require('gulp');
var uglify = require("gulp-uglify");
var htmlmin = require('gulp-htmlmin');
var plumber = require('gulp-plumber');
var runSequence = require('run-sequence');
var minifyCss = require("gulp-minify-css");

gulp.task('copy_all', function () {
  return gulp.src(['./react/**/*', '!./react/src/**/*'])
    .pipe(plumber())
    .pipe(gulp.dest('./.tmp/public/'));
});

gulp.task('copy_js', function () {
  return gulp.src(['./react/**/*.js', '!./react/src/**/*'])
    .pipe(plumber())
    .pipe(uglify())
    .pipe(gulp.dest('./.tmp/public/'));
});

gulp.task('copy_bundle', function () {
  return gulp.src('./bundle.js')
    .pipe(plumber())
    .pipe(gulp.dest('./.tmp/public/'));
});

gulp.task('copy_css', function () {
  return gulp.src('./react/**/*.css')
    .pipe(plumber())
    .pipe(minifyCss({ compatibility: 'ie8' }))
    .pipe(gulp.dest('./.tmp/public/'));
});

gulp.task('copy_html', function () {
  gulp.src(['./react/index.html'])
    .pipe(plumber())
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('./.tmp/public'));
});

gulp.task('copy_fonts', function () {
  return gulp.src(['./react/**/*.ttf*', './react/**/*.woff*'])
    .pipe(plumber())
    .pipe(gulp.dest('./.tmp/public'));
});

gulp.task('build', function () {
  runSequence(
    'copy_all',
    ['copy_bundle', 'copy_js', 'copy_css', 'copy_html', 'copy_fonts']
  );
});
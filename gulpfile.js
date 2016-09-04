'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var del = require('del');
var jshint = require('gulp-jshint');
var jshintConfig  = require('./package').jshintConfig;

// Clean
gulp.task('clean', function (cb) {
  del('js/bundle.js', cb);
});

// Linter
gulp.task('lint', function() {
  return gulp.src(['./gulpfile.js', './js/index.js', './js/template.js'])
    .pipe(jshint(jshintConfig))
    .pipe(jshint.reporter('jshint-stylish'));
});

// Browserify
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var hbsfy = require('hbsfy');

var bundler = browserify({
  entries: ['./js/index.js'],
  debug: true
});

bundler.transform(hbsfy);
bundler.on('log', gutil.log);

gulp.task('build', ['clean', 'lint'], function () {
  return bundler.bundle()
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('js'));
});

// API Server
var jsonServer = require('json-server');

var apiServer = jsonServer.create();
var router = jsonServer.router('db.json');

apiServer.use(jsonServer.defaults);
apiServer.use(router);

gulp.task('serve:api', function (cb) {
  apiServer.listen(3000);
  cb();
});

// Web Server
var serve = require('gulp-serve');

gulp.task('serve:web', serve({
  root: ['.'],
  port: 8000
}));

gulp.task('serve', ['serve:api', 'serve:web']);

// Watch
gulp.task('watch', function () {
  return gulp.watch(['./js/index.js'], ['build']);
});

// Default
gulp.task('default', ['serve', 'build', 'watch']);
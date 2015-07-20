'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var del = require('del');
var jshint = require('gulp-jshint');

// Add your require statements and gulp tasks here

// Clean
gulp.task('clean', function (cb) {
  del('js/bundle.js', cb)
})


/* jshint asi: true, */
gulp.task('lint', function() {
  return gulp.src('./js/index.js')
    .pipe(jshint())
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
bundler.on('log', gutil.log); // output build logs to terminal

gulp.task('build', ['clean'], function () {
  return bundler.bundle()
    // log errors if they happen
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    // set output filename
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

gulp.task('serve', ['serve:api', 'serve:web'])

// Watch
gulp.task('watch', function () {
  return gulp.watch(['./js/index.js'], ['build'])
})

// Default
gulp.task('default', ['lint', 'serve', 'watch'])
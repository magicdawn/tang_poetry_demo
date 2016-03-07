'use strict';

const kit = require('needle-kit');
global.Promise = kit.Promise;
const co = kit.co;
const fs = kit.fs;
const gulp = require('gulp');
const gutil = require('gulp-util');
const pathFn = require('path');
const glob = require('glob');
const browserSync = require('browser-sync').create();

/**
 * rev map
 */
const rev = {};

/**
 * build Task
 */
gulp.task('build', function() {
  process.env.NODE_ENV = 'production';
  const app = require('./app');
  const rev = {};

  /* globals predator */
  // all glob with cwd `app/`

  // just do copy
  predator.buildCopy([
    '*/fonts/**/*'
  ]);

  // name_hash.ext
  predator.buildStatic([
    '*/img/**/*.*',
    '*/assets/**/*.*'
  ], rev);

  // gulp.task could return a Promise
  return co(function*() {

    // less -> css
    yield predator.buildLessAsync([
      '*/css/main/**/*.less'
    ], rev);

    // js
    yield predator.buildJsAsync([
      '*/js/main/**/*.js',
      'global/js/main/index.json'
    ], rev);

    // 其他 js css
    // 上面只处理了 带有main的
    predator.buildOtherJsCss([
      '*/js/*.*',
      '*/js/!(main)/**/*.*',
      '*/css/*.*',
      '*/css/!(main)/**/*.*'
    ], rev);

    // 替换 view, 复制到 view_build 文件夹
    predator.buildView([
      '*/view/**/*.*'
    ], rev);

    fs.writeFileSync(__dirname + '/rev.json', JSON.stringify(rev, null, '  '), 'utf8');
    gutil.log('predator', 'rev.json writed');
  });
});

/**
 * do clean stuff
 */
gulp.task('clean', ['clean-public', 'clean-view']);

/**
 * ./public
 */
gulp.task('clean-public', function() {
  fs.removeSync(__dirname + '/public');
});

/**
 * view_build
 */
gulp.task('clean-view', function() {
  const dirs = glob.sync('app/*/view_build');
  dirs.forEach(function(d) {
    fs.removeSync(__dirname + '/' + d);
  });
});

/**
 * Dev
 */
gulp.task('browser-sync', function() {
  browserSync.init({
    // browser-sync uses anymatch
    files: [
      __dirname + '/app/*/css/**/*.css',
      __dirname + '/app/*/css/**/*.less',
      __dirname + '/app/*/js/**/*.js',
      __dirname + '/app/*/view/**/*.swig',
      __dirname + '/app/*/view/**/*.html'
    ],
    proxy: 'localhost:4000'
  });
});
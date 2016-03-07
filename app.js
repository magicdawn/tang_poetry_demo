'use strict';

const kit = require('needle-kit');
global.Promise = kit.Promise;
const co = kit.co;
const app = module.exports = require('koa')();
const _ = require('lodash');
const debug = require('debug')('predator:demo');

/**
 * middlewares
 */
const favicon = require('koa-favicon');
const logger = require('koa-logger');
const serve = require('koa-static');
const Predator = require('predator-kit');
const conditional = require('koa-conditional-get');
const etag = require('koa-etag');

// cache
// dev & production
app.use(conditional());
app.use(etag());

// favicon
// app.use(favicon(__dirname + '/app/global/img/favicon.ico'));

/* globals predator */
// create predator
global.predator = Predator({
  home: __dirname,
  app: app,
  buildDir: __dirname + '/public'
});

/**
 * when
 *   - production, we use `/public` dir
 *   - otherwise, we load a bunch of middlewares
 */
if (app.env === 'production') {
  app.use(serve(predator.buildDir, {
    maxage: 365 * 86400 * 1000
  }));
} else {
  predator.startAssetsManager();
}

// logger
if (app.env !== 'test') {
  app.use(logger());
}

/**
 * 使用所有的router
 * index.js
 */
predator.loadAllRouter();

/**
 * error handle
 *
 * production 环境下, log err & 不expose error
 * development 默认环境下, log err & expose error
 * test 环境下, 不log error & expose error
 */
if (app.env !== 'production') {
  app.on('error', app.onerror); // log error when not test
  app.on('error', (err, ctx) => {
    err.expose = true;
  });
}
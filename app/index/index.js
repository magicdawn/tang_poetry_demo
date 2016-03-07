'use strict';

/**
 * module dependencies
 */
const router = module.exports = require('impress-router')();
const render = require('predator-kit').getRender(__dirname);

router.get('/', function*() {
  this.type = 'html';
  this.body = yield render('index');
});
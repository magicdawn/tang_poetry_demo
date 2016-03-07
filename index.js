'use strict';

/**
 * module dependencies
 */
const app = require('./app.js');

/**
 * here we go
 */

const port = process.env.PORT || 4000;
app.listen(port, function() {
  console.log('predator demo runing at http://localhost:%s', this.address().port);
});
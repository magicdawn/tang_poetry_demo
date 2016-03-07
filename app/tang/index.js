'use strict';

/**
 * module dependencies
 */
const router = module.exports = require('impress-router')();
const render = require('predator-kit').getRender(__dirname);
const kit = require('needle-kit');

const mysql = require('mysql');
const Connection = require('mysql/lib/Connection');
kit.Promise.promisifyAll(Connection.prototype);

const query = kit.co.wrap(function*() {
  const conn = mysql.createConnection({
    user: 'root',
    database: 'tang_poetry'
  });
  yield conn.connectAsync();

  const result = yield conn.queryAsync.apply(conn, arguments);
  yield conn.endAsync();

  return result;
});

router.get('/tang', function*() {
  this.type = 'html';
  this.body = 'this is a tang_poetry_demo';
});

router.get('/tang/poets', function*() {
  this.body = yield query('select count(*) from poetries');
});

// 写诗最多的湿人
router.get('/tang/top_poets', function*() {

  const sql = `
  -- select poets.name, t.poetry_count, t.poetry_ids, t.poet_ids
  -- from
  -- (
    SELECT poet_id, COUNT(poet_id) as poetry_count, GROUP_CONCAT(id) as poetry_ids, GROUP_CONCAT(poet_id) as poet_ids
    FROM poetries
    GROUP BY poet_id
    ORDER BY count(poet_id) DESC
    LIMIT ?,?
  -- ) as t
  -- left join poets
  -- on t.poet_id = poets.id
  `;

  const start = Number(this.query.start || 0);
  const count = Number(this.query.count || 10);
  console.log(start, count);
  this.body = yield query(sql, [start, count]);
});
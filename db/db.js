const { Pool, Client } = require('pg');
const format = require('pg-format');
const logger = require('../helpers/logger');
const forEach = require('async-foreach').forEach;
const connectionString = require('../config.json').connectionString;

const pool = new Pool({
  connectionString: connectionString,
});


pool.connect((err, client, release) => {
  if (err) {
    logger.error(err, { source: 'db-init' });
    process.exit(1);
  }
  release();
});

async function uploadSchedule({ user, date, kid, link, data }) {
  await pool.query(`INSERT INTO dbo.schedule(data, date, kid, link, "user") VALUES ($1, $2, $3, $4, $5)`, [data, date, kid, link, user]);
}

async function getSchedule() {
  let res = await pool.query('SELECT * FROM dbo.schedule');
  return res;
}

async function removeSchedule({ user, kid }) {
  await pool.query(`DELETE FROM dbo.schedule WHERE "user" = $1 and kid = $2`, [user, kid]);
}

async function uploadHistory(data) {
  forEach(data, (d) => {
    pool.query('INSERT INTO dbo.history(kursnr, state) VALUES ($1, $2)', [d.kid, d.state]);
  });
}

async function close() {
  pool.end();
}


module.exports = { client: pool, close, uploadHistory, uploadSchedule, getSchedule, removeSchedule }


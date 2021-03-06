const { Pool } = require('pg');
const logger = require('../helpers/logger');
const { connectionString } = require('../config.json');

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

async function uploadSchedule({ user, date, kid, link, sport, data }) {
  const res = await pool.query(`INSERT INTO dbo.schedule(data, date, kid, link, "user", sport) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`, [data, date, kid, link, user, sport]);
  return res.rows[0].id;
}

async function updateSchedule(id, res) {
  await pool.query(`UPDATE dbo.schedule SET result = $1 WHERE id = $2`, [res, id]);
}

async function getSports() {
  const res = await pool.query('SELECT * FROM dbo.sport');
  return res;
}

async function getSchedule() {
  const res = await pool.query('SELECT * FROM dbo.schedule');
  return res;
}

async function removeSchedule(id) {
  await pool.query(`DELETE FROM dbo.schedule WHERE id = $1`, [id]);
}

async function uploadHistory(data) {
  for (const d of data)
    await pool.query('INSERT INTO dbo.history(kursnr, state) VALUES ($1, $2)', [d.kid, d.state]);
}

async function close() {
  pool.end();
}


module.exports = { client: pool, close, uploadHistory, uploadSchedule, getSchedule, removeSchedule, updateSchedule, getSports };


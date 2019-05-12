const { Pool, Client } = require('pg');
const format = require('pg-format');
const forEach = require('async-foreach').forEach;
const connectionString = require('../config.json').connectionString;

const pool = new Pool({
  connectionString: connectionString,
});



async function uploadHistory(data) {
  forEach(data, (d) => {
    pool.query('INSERT INTO dbo.history(kursnr, state) VALUES ($1, $2)', [d.kid, d.state]);
  });
}

async function close() {
  pool.end();
}


module.exports = { client: pool, close: close, uploadHistory: uploadHistory }


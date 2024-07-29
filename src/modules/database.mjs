import config from '../config.mjs';

import mysql from 'mysql2/promise';

const pool = mysql.createPool(config.database);

async function query(sql, values) {
  return new Promise((resolve, reject) => {
    pool
      .getConnection()
      .then((connection) => {
        const result = connection.query(sql, values);
        connection.release();
        return result;
      })
      .then((result) => {
        resolve(result[0]);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

function escape(string) {
  string = string + '';
  string = string.replace(/</g, '&lt;');
  string = string.replace(/>/g, '&gt;');
  string = string.trim();
  return string;
}

export default {
  query: query,
  escape: escape,
};

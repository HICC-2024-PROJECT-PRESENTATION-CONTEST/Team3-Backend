import database from './database.mjs';
import crypto from 'node:crypto';

class Session {
  #uid;
  #data = {};
  #expire = new Date(0);
  #new = true;

  constructor(uid = crypto.randomUUID()) {
    this.#uid = uid;
  }

  async create() {
    return new Promise((resolve, reject) => {
      let sql = ``;
      sql += `INSERT INTO \`sessions\` ( `;
      sql += `uid, data, expire`;
      sql += ` ) VALUES ( `;
      sql += `?, ?, ?`;
      sql += ` );`;
      let values = [this.#uid, JSON.stringify(this.#data), this.#expire];

      database.query(sql, values).then(resolve).catch(reject);
    });
  }

  async read() {
    return new Promise((resolve, reject) => {
      let sql = ``;
      sql += `SELECT * FROM \`sessions\` `;
      sql += `WHERE \`uid\` = ? `;
      sql += `;`;
      let values = [this.#uid];

      database
        .query(sql, values)
        .then((dataArray) => {
          if (dataArray.length == 0) {
            throw 'error404';
          }
          const data = dataArray[0];
          this.#new = false;
          this.#data = JSON.parse(data.data);
          this.#expire = new Date(data.expire);
          resolve();
        })
        .catch(reject);
    });
  }

  async update() {
    return new Promise((resolve, reject) => {
      let sql = ``;
      sql += `UPDATE \`sessions\` `;
      sql += `SET \`data\` = ?`;
      sql += `;`;
      let values = [JSON.stringify(this.#data)];

      database.query(sql, values).then(resolve).catch(reject);
    });
  }

  async delete() {
    return new Promise((resolve, reject) => {
      let sql = ``;
      sql += `DELETE FROM \`sessions\` `;
      sql += `WHERE \`uid\` = ?`;
      sql += `;`;
      let values = [this.#uid];

      database.query(sql, values).then(resolve).catch(reject);
    });
  }

  get uid() {
    return this.#uid;
  }

  set data(data) {
    this.#data = data;
  }

  get data() {
    return this.#data;
  }

  get expire() {
    return this.#expire;
  }

  set expire(expire) {
    this.#expire = expire;
  }

  isNew() {
    return this.#new;
  }
}

export default Session;

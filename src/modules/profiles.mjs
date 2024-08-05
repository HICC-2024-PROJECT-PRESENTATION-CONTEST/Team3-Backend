import database from './database.mjs';

import Profile from './profile.mjs';

async function list(page = 1, size = 20, search) {
  return new Promise(async (resolve, reject) => {
    page = Math.max(1, page);
    size = Math.max(1, size);
    let sql = ``;
    let values = [];

    sql += `SELECT uid FROM \`profiles\` `;
    if (search) {
      sql += `WHERE `;
      const keys = Object.keys(search);
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        sql += `\`${key}\` LIKE ? `;
        values.push(`%${search[key]}%`);
        if (i < keys.length - 1) {
          sql += `OR `;
        }
      }
    }
    sql += `ORDER BY \`uid\` ASC `;
    sql += `LIMIT ? OFFSET ? `;
    sql += `;`;

    values.push(size);
    values.push((page - 1) * size);

    const dataArray = await database.query(sql, values).catch(reject);

    const profiles = [];
    const tasks = [];
    for (const data of dataArray) {
      const profile = new Profile(data.uid);
      profiles.push(profile);
      tasks.push(profile.read());
    }
    await Promise.all(tasks).catch(reject);

    const profilesData = [];
    for (const profile of profiles) {
      const data = profile.toJSON();
      profilesData.push(data);
    }

    resolve(profilesData);
  });
}

async function count(search) {
  return new Promise(async (resolve, reject) => {
    let sql = ``;
    let values = [];

    sql += `SELECT COUNT(uid) FROM \`profiles\` `;
    if (search) {
      sql += `WHERE `;
      const keys = Object.keys(search);
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        sql += `\`${key}\` LIKE ? `;
        values.push(`%${search[key]}%`);
        if (i < keys.length - 1) {
          sql += `OR `;
        }
      }
    }
    sql += `;`;

    const data = await database.query(sql, values).catch(reject);

    resolve(data[0]['COUNT(uid)']);
  });
}

async function ofPhone(phone) {
  return new Promise((resolve, reject) => {
    let sql = ``;
    sql += `SELECT uid FROM \`profiles\` `;
    sql += `WHERE \`phone\` = ? `;
    sql += `;`;
    let values = [phone];

    database
      .query(sql, values)
      .then((dataArray) => {
        if (dataArray.length == 0) {
          resolve(null);
        }

        const data = dataArray[0];
        const profile = new Profile(data.uid);

        profile
          .read()
          .then(() => {
            resolve(profile);
          })
          .catch(reject);
      })
      .catch(reject);
  });
}

export default {
  list: list,
  count: count,
  ofPhone: ofPhone,
};

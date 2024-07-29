import database from './database.mjs';

import Profile from './profile.mjs';

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
  ofPhone: ofPhone,
};

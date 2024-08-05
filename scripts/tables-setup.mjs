import database from '../src/modules/database.mjs';

function run() {
  return new Promise(async (resolve, reject) => {
    await (async () => {
      let sql = ``;
      sql += `DROP TABLE IF EXISTS \`profiles\`; `;
      let values = [];

      await database.query(sql, values).catch(reject);
    })();

    await (async () => {
      let sql = ``;
      sql += `CREATE TABLE \`profiles\` ( `;
      sql += `\`uid\` VARCHAR(128) COLLATE utf8mb4_unicode_ci NOT NULL, `;
      sql += `\`name\` VARCHAR(32) COLLATE utf8mb4_unicode_ci NOT NULL, `;
      sql += `\`phone\` VARCHAR(32) COLLATE utf8mb4_unicode_ci NOT NULL, `;
      sql += `\`instagram\` VARCHAR(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL, `;
      sql += `\`passhash\` VARCHAR(128) COLLATE utf8mb4_unicode_ci NOT NULL, `;
      sql += `\`gender\` VARCHAR(1) COLLATE utf8mb4_unicode_ci NOT NULL, `;
      sql += `\`birthyear\` INT COLLATE utf8mb4_unicode_ci NOT NULL, `;
      sql += `\`offset_up\` INT COLLATE utf8mb4_unicode_ci NOT NULL, `;
      sql += `\`offset_down\` INT COLLATE utf8mb4_unicode_ci NOT NULL, `;
      sql += `\`height\` INT COLLATE utf8mb4_unicode_ci DEFAULT NULL, `;
      sql += `\`major\` VARCHAR(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL, `;
      sql += `\`mbti\` VARCHAR(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL, `;
      sql += `\`looklike\` VARCHAR(128) COLLATE utf8mb4_unicode_ci NOT NULL, `;
      sql += `\`smoking\` BOOLEAN COLLATE utf8mb4_unicode_ci NOT NULL, `;
      sql += `\`choicescount\` INT COLLATE utf8mb4_unicode_ci DEFAULT 1, `;
      sql += `\`messagescount\` INT COLLATE utf8mb4_unicode_ci DEFAULT 1, `;
      sql += `PRIMARY KEY ( \`uid\` ) `;
      sql += `) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;`;
      let values = [];

      await database.query(sql, values).catch(reject);
    })();

    await (async () => {
      let sql = ``;
      sql += `DROP TABLE IF EXISTS \`sessions\`; `;
      let values = [];

      await database.query(sql, values).catch(reject);
    })();

    await (async () => {
      let sql = ``;
      sql += `CREATE TABLE \`sessions\` ( `;
      sql += `\`uid\` VARCHAR(128) COLLATE utf8mb4_unicode_ci NOT NULL, `;
      sql += `\`data\` LONGTEXT COLLATE utf8mb4_unicode_ci DEFAULT '{}', `;
      sql += `\`expire\` DATETIME COLLATE utf8mb4_unicode_ci NOT NULL, `;
      sql += `PRIMARY KEY ( \`uid\` ) `;
      sql += `) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;`;
      let values = [];

      await database.query(sql, values).catch(reject);
    })();

    await (async () => {
      let sql = ``;
      sql += `DROP TABLE IF EXISTS \`choices\`; `;
      let values = [];

      await database.query(sql, values).catch(reject);
    })();

    await (async () => {
      let sql = ``;
      sql += `CREATE TABLE \`choices\` ( `;
      sql += `\`from\` VARCHAR(128) COLLATE utf8mb4_unicode_ci NOT NULL, `;
      sql += `\`to\` VARCHAR(128) COLLATE utf8mb4_unicode_ci NOT NULL `;
      sql += `) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;`;
      let values = [];

      await database.query(sql, values).catch(reject);
    })();

    resolve();
  });
}

export default run;

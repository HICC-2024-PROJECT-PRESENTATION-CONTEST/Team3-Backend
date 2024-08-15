import database from './database.mjs';
import message from './message.mjs';
import crypto from 'node:crypto';
import seedrandom from 'seedrandom';

class Profile {
  #read = false;

  #uid;
  #name;
  #phone;
  #instagram;
  #passhash;
  #gender;
  #birthyear;
  #offset_up;
  #offset_down;
  #height;
  #major;
  #mbti;
  #looklike;
  #smoking;
  #choicescount;
  #messagescount;

  constructor(uid = crypto.randomUUID()) {
    this.#uid = uid;
  }

  async create(password) {
    this.#passhash = hash(password);

    return new Promise((resolve, reject) => {
      let sql = ``;
      sql += `INSERT INTO \`profiles\` ( `;
      sql += `uid, name, phone, instagram, passhash, gender, birthyear, offset_up, offset_down, height, major, mbti, looklike, smoking`;
      sql += ` ) VALUES ( `;
      sql += `?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?`;
      sql += ` );`;
      let values = [];
      values.push(this.#uid);
      values.push(this.#name);
      values.push(this.#phone);
      values.push(this.#instagram);
      values.push(this.#passhash);
      values.push(this.#gender);
      values.push(this.#birthyear);
      values.push(this.#offset_up);
      values.push(this.#offset_down);
      values.push(this.#height);
      values.push(this.#major);
      values.push(this.#mbti);
      values.push(this.#looklike);
      values.push(this.#smoking);

      database.query(sql, values).then(resolve).catch(reject);
    });
  }

  async read() {
    return new Promise((resolve, reject) => {
      let sql = ``;
      sql += `SELECT * FROM \`profiles\` `;
      sql += `WHERE \`uid\` = ? `;
      sql += `;`;
      let values = [this.#uid];

      database
        .query(sql, values)
        .then((dataArray) => {
          if (dataArray.length == 0) {
            throw 'profile404';
          }

          const data = dataArray[0];

          this.#read = true;

          this.#name = data.name;
          this.#phone = data.phone;
          this.#instagram = data.instagram;
          this.#passhash = data.passhash;
          this.#gender = data.gender;
          this.#birthyear = data.birthyear;
          this.#offset_up = data.offset_up;
          this.#offset_down = data.offset_down;
          this.#height = data.height;
          this.#major = data.major;
          this.#mbti = data.mbti;
          this.#looklike = data.looklike;
          this.#smoking = data.smoking;
          this.#choicescount = data.choicescount;
          this.#messagescount = data.messagescount;

          resolve();
        })
        .catch(reject);
    });
  }

  async update() {
    return new Promise((resolve, reject) => {
      let sql = ``;
      sql += `UPDATE \`profiles\` `;
      sql += `SET \`name\` = ?, `;
      sql += `\`phone\` = ?, `;
      sql += `\`instagram\` = ?, `;
      sql += `\`gender\` = ?, `;
      sql += `\`birthyear\` = ?, `;
      sql += `\`offset_up\` = ?, `;
      sql += `\`offset_down\` = ?, `;
      sql += `\`height\` = ?, `;
      sql += `\`major\` = ?, `;
      sql += `\`mbti\` = ?, `;
      sql += `\`looklike\` = ?, `;
      sql += `\`smoking\` = ?, `;
      sql += `\`choicescount\` = ?, `;
      sql += `\`messagescount\` = ? `;
      sql += `WHERE \`uid\` = ? `;
      sql += `;`;
      let values = [];
      values.push(this.#name);
      values.push(this.#phone);
      values.push(this.#instagram);
      values.push(this.#gender);
      values.push(this.#birthyear);
      values.push(this.#offset_up);
      values.push(this.#offset_down);
      values.push(this.#height);
      values.push(this.#major);
      values.push(this.#mbti);
      values.push(this.#looklike);
      values.push(this.#smoking);
      values.push(this.#choicescount);
      values.push(this.#messagescount);
      values.push(this.#uid);

      database.query(sql, values).then(resolve).catch(reject);
    });
  }

  async delete() {
    return new Promise((resolve, reject) => {
      let sql = ``;
      sql += `DELETE FROM \`profiles\` `;
      sql += `WHERE \`uid\` = ?`;
      sql += `;`;
      let values = [this.#uid];

      database.query(sql, values).then(resolve).catch(reject);
    });
  }

  check(password) {
    const h = hash(password);
    return h === this.#passhash;
  }

  get uid() {
    return this.#uid;
  }

  get name() {
    return this.#name;
  }

  set name(name) {
    name = database.escape(name);
    if (!name) {
      throw 'default400';
    }
    name = name.substring(0, 32);
    this.#name = name;
  }

  get phone() {
    return this.#phone;
  }

  set phone(phone) {
    phone = database.escape(phone);
    if (!phone) {
      throw 'default400';
    }
    phone = phone.substring(0, 32);
    this.#phone = phone;
  }

  get instagram() {
    return this.#instagram;
  }

  set instagram(instagram) {
    instagram = database.escape(instagram);
    instagram = instagram.substring(0, 32);
    this.#instagram = instagram;
  }

  get gender() {
    return this.#gender;
  }

  set gender(gender) {
    gender = database.escape(gender);
    if (!gender) {
      throw 'default400';
    }
    gender = gender.substring(0, 1);
    gender = gender.toUpperCase();
    this.#gender = gender;
  }

  get birthyear() {
    return this.#birthyear;
  }

  set birthyear(birthyear) {
    if (birthyear == undefined || birthyear == null) {
      throw 'default400';
    }
    this.#birthyear = birthyear;
  }

  get offset_up() {
    return this.#offset_up;
  }

  set offset_up(offset_up) {
    if (offset_up == undefined || offset_up == null) {
      throw 'default400';
    }
    this.#offset_up = offset_up;
  }

  get offset_down() {
    return this.#offset_down;
  }

  set offset_down(offset_down) {
    if (offset_down == undefined || offset_down == null) {
      throw 'default400';
    }
    this.#offset_down = offset_down;
  }

  get height() {
    return this.#height;
  }

  set height(height) {
    this.#height = height * 1 || 0;
  }

  get major() {
    return this.#major;
  }

  set major(major) {
    major = database.escape(major);
    major = major.substring(0, 32);
    this.#major = major;
  }

  get mbti() {
    return this.#mbti;
  }

  set mbti(mbti) {
    mbti = database.escape(mbti);
    mbti = mbti.substring(0, 32);
    this.#mbti = mbti;
  }

  get looklike() {
    return this.#looklike;
  }

  set looklike(looklike) {
    looklike = database.escape(looklike);
    if (!looklike) {
      throw 'default400';
    }
    looklike = looklike.substring(0, 32);
    this.#looklike = looklike;
  }

  get smoking() {
    return Boolean(this.#smoking);
  }

  set smoking(smoking) {
    this.#smoking = Boolean(smoking);
  }

  get choicescount() {
    return this.#choicescount;
  }

  set choicescount(choicescount) {
    this.#choicescount = choicescount;
  }

  get messagescount() {
    return this.#messagescount;
  }

  set messagescount(messagescount) {
    this.#messagescount = messagescount;
  }

  toJSON() {
    if (!this.#read) {
      return {
        uid: this.uid,
        delete: true,
      };
    } else {
      return {
        uid: this.uid,
        name: this.name,
        phone: this.phone,
        instagram: this.instagram,
        gender: this.gender,
        birthyear: this.birthyear,
        birthyear_offset: {
          plus: this.offset_up,
          minus: this.offset_down,
        },
        height: this.height,
        major: this.major,
        mbti: this.mbti,
        looklike: this.looklike,
        smoking: this.smoking,
      };
    }
  }

  async recommands(size) {
    const uids = [];
    for (const profile of await this.choices()) {
      uids.push(profile.uid);
    }

    const random = seedrandom(this.#uid + uids.length);

    for (const profile of await this.choicesFrom()) {
      uids.push(profile.uid);
    }

    return new Promise(async (resolve, reject) => {
      const quries = [
        {
          sql: `SELECT uid FROM \`profiles\` WHERE \`gender\` != ? AND \`birthyear\` <= ? AND \`birthyear\` >= ?`,
          values: [
            this.#gender,
            this.#birthyear + this.offset_up,
            this.#birthyear - this.offset_down,
          ],
        },
        {
          sql: `SELECT uid FROM \`profiles\` WHERE \`gender\` != ? AND \`birthyear\` <= ? AND \`birthyear\` >= ?`,
          values: [
            this.#gender,
            this.#birthyear + this.offset_up + 1,
            this.#birthyear - this.offset_down + 1,
          ],
        },
        {
          sql: `SELECT uid FROM \`profiles\` WHERE \`gender\` != ? AND \`birthyear\` <= ? AND \`birthyear\` >= ?`,
          values: [
            this.#gender,
            this.#birthyear + this.offset_up + 2,
            this.#birthyear - this.offset_down + 2,
          ],
        },
        {
          sql: `SELECT uid FROM \`profiles\` WHERE \`gender\` != ? AND \`birthyear\` <= ? AND \`birthyear\` >= ?`,
          values: [
            this.#gender,
            this.#birthyear + this.offset_up + 3,
            this.#birthyear - this.offset_down + 3,
          ],
        },
        {
          sql: `SELECT uid FROM \`profiles\` WHERE \`gender\` != ? AND \`birthyear\` <= ? AND \`birthyear\` >= ?`,
          values: [
            this.#gender,
            this.#birthyear + this.offset_up + 4,
            this.#birthyear - this.offset_down + 4,
          ],
        },
        {
          sql: `SELECT uid FROM \`profiles\` WHERE \`gender\` != ? AND \`birthyear\` <= ? AND \`birthyear\` >= ?`,
          values: [
            this.#gender,
            this.#birthyear + this.offset_up + 5,
            this.#birthyear - this.offset_down + 5,
          ],
        },
        {
          sql: `SELECT uid FROM \`profiles\` WHERE \`gender\` != ?`,
          values: [this.#gender],
        },
      ];

      const profiles = [];
      const tasks = [];

      loop: for (const query of quries) {
        const dataArray = await database
          .query(query.sql, query.values)
          .catch(reject);

        while (dataArray.length > 0) {
          const index = Math.floor(random() * dataArray.length);
          const data = dataArray[index];
          dataArray.splice(index, 1);

          if (!uids.includes(data.uid)) {
            const profile = new Profile(data.uid);
            profiles.push(profile);
            tasks.push(profile.read());
          }

          if (profiles.length >= size) {
            break loop;
          }
        }
      }

      await Promise.all(tasks).catch(reject);

      const profilesData = [];
      for (const profile of profiles) {
        const data = profile.toJSON();
        delete data.phone;
        delete data.birthyear_offset;
        profilesData.push(data);
      }

      resolve(profilesData);
    });
  }

  async choice(target) {
    return new Promise((resolve, reject) => {
      if (this.#choicescount <= 0) {
        reject('default409');
        return;
      }

      this.#choicescount--;
      this.update()
        .then(() => {
          let sql = ``;
          sql += `INSERT INTO \`choices\` ( `;
          sql += `\`from\`, \`to\``;
          sql += ` ) VALUES ( `;
          sql += `?, ?`;
          sql += ` );`;
          let values = [];
          values.push(this.#uid);
          values.push(target.uid);

          database.query(sql, values).then(resolve).catch(reject);

          let text = ``;
          text += `[Hi, CC!] ${this.#name}님이 당신을 선택하셨습니다.`;
          text += `지금 바로 연락해보세요!`;
          if (this.#instagram) {
            text += `@${this.#instagram}`;
          } else {
            text += `${this.#phone}`;
          }

          message.send(target.phone, text);
        })
        .catch(reject);
    });
  }

  async reject(target) {
    return new Promise((resolve, reject) => {
      let sql = ``;
      sql += `DELETE FROM \`choices\` `;
      sql += `WHERE \`from\` = ? AND \`to\` = ?`;
      sql += `;`;
      let values = [];
      values.push(this.#uid);
      values.push(target.uid);

      database.query(sql, values).then(resolve).catch(reject);
    });
  }

  async choices() {
    return new Promise(async (resolve, reject) => {
      let sql = ``;
      sql += `SELECT \`to\` FROM \`choices\` `;
      sql += `WHERE \`from\` = ?`;
      sql += `;`;
      let values = [];
      values.push(this.#uid);

      const dataArray = await database.query(sql, values).catch(reject);
      const profiles = [];
      const tasks = [];
      for (const data of dataArray) {
        const profile = new Profile(data.to);
        profiles.push(profile);
        tasks.push(profile.read());
      }
      await Promise.all(tasks).catch((error) => {
        if (error === 'profile404') {
          return null;
        } else {
          reject(error);
        }
      });

      const profilesData = [];
      for (const profile of profiles) {
        const data = profile.toJSON();
        delete data.phone;
        delete data.birthyear_offset;
        profilesData.push(data);
      }

      resolve(profilesData);
    });
  }

  async choicesFrom() {
    return new Promise(async (resolve, reject) => {
      let sql = ``;
      sql += `SELECT \`from\` FROM \`choices\` `;
      sql += `WHERE \`to\` = ?`;
      sql += `;`;
      let values = [];
      values.push(this.#uid);

      const dataArray = await database.query(sql, values).catch(reject);
      const profiles = [];
      const tasks = [];
      for (const data of dataArray) {
        const profile = new Profile(data.from);
        profiles.push(profile);
        tasks.push(profile.read());
      }
      await Promise.all(tasks).catch((error) => {
        if (error === 'profile404') {
          return null;
        } else {
          reject(error);
        }
      });

      const profilesData = [];
      for (const profile of profiles) {
        const data = profile.toJSON();
        delete data.phone;
        delete data.birthyear_offset;
        profilesData.push(data);
      }

      resolve(profilesData);
    });
  }

  async message(target, text) {
    return new Promise(async (resolve, reject) => {
      if (this.#messagescount <= 0) {
        reject('default409');
        return;
      }

      const uids = [];
      for (const profile of await this.choices()) {
        uids.push(profile.uid);
      }
      for (const profile of await this.choicesFrom()) {
        uids.push(profile.uid);
      }

      if (!uids.includes(target.uid)) {
        reject('default404');
        return;
      }

      this.#messagescount--;
      this.update()
        .then(() => {
          message.send(target.phone, text).then(resolve).catch(reject);
        })
        .catch(reject);
    });
  }
}

function hash(key, salt = '') {
  const source = crypto.createHash('sha512', salt);
  source.update(key);
  const hash = source.digest('hex');
  return hash;
}

export default Profile;

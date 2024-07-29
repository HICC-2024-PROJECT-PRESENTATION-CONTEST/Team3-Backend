import Profile from '../modules/profile.mjs';
import profiles from '../modules/profiles.mjs';

const qr = {};

function getQR() {
  const key = randomString(6);
  qr[key] = {
    datetime: Date.now(),
  };
  return key;
}

function checkQR(key) {
  if (qr[key]) {
    delete qr[key];
    return true;
  } else {
    return false;
  }
}

function randomString(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

async function login(phone, password) {
  const profile = await profiles.ofPhone(phone).catch((error) => {
    throw error;
  });

  if (profile == null) {
    throw 'profile404';
  }

  if (profile.check(password)) {
    return profile;
  } else {
    throw 'auth403';
  }
}

export default {
  getQR: getQR,
  checkQR: checkQR,
  login: login,
};

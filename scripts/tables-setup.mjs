import Profile from '../src/modules/profile.mjs';

async function createProfile(data) {
  const profile = new Profile();

  try {
    profile.name = data.name;
    profile.phone = data.phone;
    profile.gender = data.gender;
    profile.birthyear = data.birthyear;
    profile.offset_up = data.birthyear_offset?.plus;
    profile.offset_down = data.birthyear_offset?.minus;
    profile.height = data.height;
    profile.major = data.major;
    profile.mbti = data.mbti;
    profile.looklike = data.looklike;
    profile.smoking = data.smoking;
  } catch (error) {
    console.error(error);
  }

  await profile.create(data.password).catch(console.error);
}

async function run() {
  for (let i = 0; i < 100; i++) {
    await createProfile({
      name: '김익명 ' + String(i).padStart(3, '0'),
      phone: '01010000',
      password: '1234',
      gender: 'M',
      birthyear: 2000 + Math.floor(Math.random() * 10),
      birthyear_offset: {
        plus: Math.floor(Math.random() * 5),
        minus: Math.floor(Math.random() * 5),
      },
      height: 175,
      major: '자율전공',
      mbti: 'ICBM',
      looklike: 'MISSILE',
      smoking: Math.random > 0.5,
    });
  }
  for (let i = 0; i < 100; i++) {
    await createProfile({
      name: '힉익명 ' + i,
      phone: '01020000' + String(i).padStart(3, '0'),
      password: '1234',
      gender: 'F',
      birthyear: 2000 + Math.floor(Math.random() * 10),
      birthyear_offset: {
        plus: Math.floor(Math.random() * 5),
        minus: Math.floor(Math.random() * 5),
      },
      height: 165,
      major: '자율전공',
      mbti: 'ICBM',
      looklike: 'MISSILE',
      smoking: Math.random > 0.5,
    });
  }
}

export default run;

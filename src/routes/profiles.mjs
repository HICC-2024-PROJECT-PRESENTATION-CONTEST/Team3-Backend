import express from 'express';
const router = express.Router();

import { routes as check } from '../modules/middlewares/index.mjs';

import Profile from '../modules/profile.mjs';
import profiles from '../modules/profiles.mjs';

router.get('/', check.isLogin(), async (req, res) => {
  res.ok('Wanyne API');
});

router.post('/', check.isLogin(), async (req, res) => {
  // 이미 세션에 프로필 정보가 있는 경우
  if (req.session.profile) {
    res.error('default403');
    return;
  }

  const pre = await profiles.ofPhone(req.body.phone).catch(res.error);

  // 같은 전화번호의 프로필이 있는 경우
  if (pre) {
    res.error('default409');
    return;
  }

  const profile = new Profile();

  try {
    profile.name = req.body.name;
    profile.phone = req.body.phone;
    profile.gender = req.body.gender;
    profile.birthyear = req.body.birthyear;
    profile.offset_up = req.body.birthyear_offset?.plus;
    profile.offset_down = req.body.birthyear_offset?.minus;
    profile.height = req.body.height;
    profile.major = req.body.major;
    profile.mbti = req.body.mbti;
    profile.looklike = req.body.looklike;
    profile.smoking = req.body.smoking;
  } catch (error) {
    res.error(error);
  }

  await profile.create(req.body.password).catch(res.error);

  req.session.profile = profile.uid;
  await req.session.save();

  res.ok();
});

router.all('/:uid*', check.isLoginOrManager(), async (req, res, next) => {
  let uid = req.params.uid;
  if (uid == '@me') {
    uid = req.session.profile;
  }

  const profile = new Profile(uid);

  await profile.read().catch(res.error);

  req.profile = profile;
  next();
});

router.get('/:uid', check.isMeOrManager(), async (req, res) => {
  const profile = req.profile;

  res.data(profile.toJSON());
});

router.patch('/:uid', check.isMeOrManager(), async (req, res) => {
  const profile = req.profile;

  try {
    profile.name = req.body.name;
    profile.gender = req.body.gender;
    profile.birthyear = req.body.birthyear;
    profile.height = req.body.height;
    profile.major = req.body.major;
    profile.mbti = req.body.mbti;
    profile.looklike = req.body.looklike;
    profile.smoking = req.body.smoking;
  } catch (error) {
    res.error(error);
    return;
  }

  await profile.update().catch(res.error);

  res.ok();
});

router.delete('/:uid', check.isMeOrManager(), async (req, res) => {
  const profile = req.profile;

  await profile.delete().catch(res.error);

  if (req.session.profile) {
    await req.session.destroy();
  }
  res.ok();
});

router.get('/:uid/image', async (req, res) => {
  res.ok('Wanyne API');
});

router.patch('/:uid/image', check.isMeOrManager(), async (req, res) => {
  res.ok('Wanyne API');
});

router.delete('/:uid/image', check.isMeOrManager(), async (req, res) => {
  res.ok('Wanyne API');
});

router.get('/:uid/recommands', check.isMeOrManager(), async (req, res) => {
  const recommands = await req.profile.recommands(7).catch(res.error);

  res.data(recommands);
});

router.get('/:uid/choices', check.isMeOrManager(), async (req, res) => {
  const to = await req.profile.choices().catch(res.error);

  const from = await req.profile.choicesFrom().catch(res.error);

  res.data({
    to: to,
    from: from,
  });
});

router.post('/:uid/choices', check.isMeOrManager(), async (req, res) => {
  const target = new Profile(req.body.target);

  await target.read().catch(res.error);

  await req.profile.choice(target).catch(res.error);

  res.ok();
});

router.delete('/:uid/choices', check.isManager(), async (req, res) => {
  const target = new Profile(req.body.target);

  await target.read().catch(res.error);

  await req.profile.reject(target).catch(res.error);

  res.ok();
});

export default router;

import config from '../config.mjs';

import express from 'express';
const router = express.Router();

import { routes as check } from '../modules/middlewares/index.mjs';

import auth from '../modules/auth.mjs';
import Profile from '../modules/profile.mjs';

router.post('/qr', check.isManager(), (req, res) => {
  const key = auth.getQR();

  res.data({ key: key });
});

router.get('/qr/:key', async (req, res) => {
  const key = req.params.key;

  if (!auth.checkQR(key)) {
    res.error('auth403');
    return;
  }

  if (req.session.login && req.session.profile) {
    const profile = new Profile(req.session.profile);
    await profile.read().catch(res.error);
    profile.choicescount++;
    profile.messagescount++;
  } else {
    req.session.login = true;
    req.session.profile = null;
    await req.session.save().catch(res.error);
  }

  req.query.redir ? res.redirect(req.query.redir) : res.ok();
});

router.post('/login', async (req, res) => {
  const phone = req.body.phone;
  const password = req.body.password;

  const profile = await auth.login(phone, password).catch(res.error);

  req.session.login = true;
  req.session.profile = profile.uid;
  await req.session.save().catch(res.error);

  req.query.redir ? res.redirect(req.query.redir) : res.ok();
});

router.post('/logout', async (req, res) => {
  await req.session.destroy().catch(res.error);

  res.ok();
});

router.post('/manager/login', async (req, res) => {
  const key = req.params.key;

  if (!(key === config['manager-key'])) {
    res.error('auth401');
    return;
  }

  req.session.manager = true;
  await req.session.save().catch(res.error);

  res.ok();
});

export default router;

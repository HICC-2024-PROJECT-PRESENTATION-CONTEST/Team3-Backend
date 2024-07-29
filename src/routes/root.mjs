import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  res.data(
    {
      documentation:
        'https://github.com/HICC-2024-PROJECT-PRESENTATION-CONTEST/Team3/blob/main/docs/API-명세서.md',
    },
    200,
    'Team 3 (Hi, CC!) API'
  );
});

import authRouter from './auth.mjs';
router.use('/auth', authRouter);

import profilesRouter from './profiles.mjs';
router.use('/profiles', profilesRouter);

export default router;

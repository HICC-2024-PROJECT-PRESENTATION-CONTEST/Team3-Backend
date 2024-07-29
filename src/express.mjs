import config from './config.mjs';

import express from 'express';

const app = express();

app.disable('x-powered-by');

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: 104857600 }));

import middlewares from './modules/middlewares/index.mjs';

app.use(middlewares.headers(config.headers));
app.use(middlewares.cookies());
app.use(middlewares.JSONResponses());
app.use(middlewares.session(config.session));

import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import router from './routes/root.mjs';
app.use('/', router);

app.use(express.static(path.resolve(__dirname, './public')));

app.options('*', (req, res) => {
  res.status(200).end();
});
app.all('*', (req, res) => {
  res.error('default404');
});

export default app;

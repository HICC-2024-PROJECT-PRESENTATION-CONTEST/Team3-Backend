import config from '../config.mjs';

import https from 'node:https';
import FormData from 'form-data';

function send(to, text) {
  let form = new FormData();
  form.append('key', config.message.key);
  form.append('user_id', config.message.user_id);
  form.append('sender', config.message.sender);
  form.append('receiver', to);
  form.append('msg', text);

  return new Promise((resolve, reject) => {
    resolve();
    return;

    const req = https.request(
      {
        method: 'POST',
        hostname: 'apis.aligo.in',
        path: '/send/',
        headers: form.getHeaders(),
      },
      (res) => {
        res.setEncoding('utf8');

        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          resolve(data);
        });
      }
    );

    form.pipe(req);
  });
}

export default {
  send: send,
};

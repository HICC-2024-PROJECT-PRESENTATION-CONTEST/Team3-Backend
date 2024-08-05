import config from '../config.mjs';

import fs from 'fs';
import multer from 'multer';
import path from 'path';
import sharp from 'sharp';

let dir = config['image-storage'];

fs.existsSync(dir) ? null : fs.mkdirSync(dir, { recursive: true });

async function upload(req, res) {
  return new Promise((resolve, reject) => {
    multer({ storage: multer.memoryStorage() }).single('image')(
      req,
      res,
      (error) => {
        if (error) {
          reject(error);
          return;
        }

        if (
          !['image/jpeg', 'image/png', 'image/webp'].includes(req.file.mimetype)
        ) {
          reject('filemime400');
          return;
        }

        store(req).then(resolve).catch(reject);
      }
    );
  });
}

async function store(req) {
  let buffer = req.file.buffer;

  let photo = sharp(buffer, { animated: false });

  let buffer1500 = await photo
    .resize({ width: 1500, height: 1500, fit: 'inside' })
    .toFormat('jpeg')
    .jpeg({
      quality: 80,
      chromaSubsampling: '4:4:4',
      force: true,
    })
    .toBuffer();
  let buffer900 = await photo
    .resize({ width: 900, height: 900, fit: 'inside' })
    .toFormat('jpeg')
    .jpeg({
      quality: 80,
      chromaSubsampling: '4:4:4',
      force: true,
    })
    .toBuffer();
  let buffer200 = await photo
    .resize({ width: 200, height: 200, fit: 'inside' })
    .toFormat('jpeg')
    .jpeg({
      quality: 80,
      chromaSubsampling: '4:4:4',
      force: true,
    })
    .toBuffer();

  let uid = req.profile.uid;

  // fs.writeFileSync(path.resolve(dir, `${uid}_original.jpg`), buffer);
  fs.writeFileSync(path.resolve(dir, `${uid}_x1500.jpg`), buffer1500);
  fs.writeFileSync(path.resolve(dir, `${uid}_x900.jpg`), buffer900);
  fs.writeFileSync(path.resolve(dir, `${uid}_x200.jpg`), buffer200);
}

function get(uid, size) {
  return path.resolve(dir, `${uid}_x${size}.jpg`);
}

function del(uid) {
  // fs.unlinkSync(path.resolve(dir, `${uid}_original.jpg`));
  fs.unlinkSync(path.resolve(dir, `${uid}_x1500.jpg`));
  fs.unlinkSync(path.resolve(dir, `${uid}_x900.jpg`));
  fs.unlinkSync(path.resolve(dir, `${uid}_x200.jpg`));
}

export default {
  upload: upload,
  get: get,
  del: del,
};

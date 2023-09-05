import multer from 'multer';
import shortid from 'shortid';
import { AWS as AWS_KEYS } from '../config/keys';
import path from 'path';
import s3 from '../utils/s3';

const s3Storage = require('multer-s3');

export default multer({
  storage: s3Storage({
    s3: s3,
    bucket: AWS_KEYS.BUCKET,
    acl: 'public-read',
    key: function (request, file, cb) {
      let prefix = 'uploads/';
      let subpath =
        request?.user?.workspace?.identifier + '/' ||
        `${new Date().toLocaleDateString().split('/').reverse().join('/')}/`;
      let transformerPrefix = 'row/';
      cb(
        null,
        prefix +
          subpath +
          transformerPrefix +
          shortid() +
          path.extname(file.originalname)
      );
    },
    contentType: function (request, file, cb) {
      cb(null, file.mimetype);
    },
  }),
  limits: {
    fileSize: 1024 * 1024 * 25, // 25MB
  },
});

// .array('_file', 200)
// .single('_file',)

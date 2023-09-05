import multer from '../middlewares/multer';
import validate from 'express-validation';
import { AWS as AWS_KEYS } from '../config/keys';
import shortid from 'shortid';
import { unlock } from '../utils/locker';
import { File } from '../models';
import Mixin, { METHOD_TYPES } from '../utils/mixin';
import Joi from '../utils/joi';
import s3 from '../utils/s3';
import logger from '../utils/logger';

const validator = Joi.object({
  filename: Joi.string().required(),
  mime: Joi.string().required(),
  size: Joi.number().required(),
  url: Joi.string().required(),
  isImage: Joi.boolean().default(false),
  uuid: Joi.string().required(),
  key: Joi.string().required(),
  workspace: Joi.objectId().required(),
  metadata: Joi.object().default({ _: 0 }),
});

const preSignedValidator = {
  body: {
    contentType: Joi.string().required(),
  },
};

const TTL = 60;

const { router } = new Mixin({
  model: File,
  middlewares: [unlock],
  validator: validator,
  populate: ['workspace'],
  methods: [
    METHOD_TYPES.LIST,
    METHOD_TYPES.READ,
    METHOD_TYPES.CREATE,
    METHOD_TYPES.UPDATE,
    METHOD_TYPES.DELETE,
  ],
  queryset: async (req) => {
    return { workspace: req.user.workspace._id };
  },
  transform: async (req) => {
    req.body.workspace = req.user.workspace._id;
    return req;
  },
});

router.get('/:id/details', [unlock], async (req, res) => {
  const data = await req.self();
  return res.json({ data });
});

router.post(
  '/upload',
  [unlock, multer.array('files', 200)],
  async (req, res, next) => {
    try {
      const { files } = req;
      const workspace = req.user.workspace;

      const uploadedFiles = files.map((file) => {
        logger.debug('file?.location', file?.location);
        if (file?.location && !file.location.startsWith('https://')) {
          file.location = `https://${file.location}`;
        }
        if (AWS_KEYS.CDN_ENDPOINT) {
          file.location = `${AWS_KEYS.CDN_ENDPOINT}/${file.key}`;
        }

        let uuid = file.key.split('/');

        uuid = uuid[uuid.length - 1].split('.')[0];

        const { value } = validator.validate({
          filename: file.originalname,
          size: file.size,
          mime: file.mimetype,
          url: file.location,
          isImage: file.mimetype.startsWith('image/'),
          uuid,
          workspace: workspace._id,
          key: file.key,
          metadata: { source: 'form-data' },
        });
        return value;
      });
      return res.reply({
        data: await File.create(uploadedFiles),
      });
    } catch (err) {
      return next(err);
    }
  }
);

router.post(
  '/upload/pre-signed',
  [unlock, validate(preSignedValidator)],
  async (req, res, next) => {
    try {
      const fileId = shortid();
      const subpath = `${req?.user?.workspace?.identifier}/` || '';
      const fileName = `uploads/${subpath}${fileId}`;
      const { contentType: fileType } = req.body;
      const fileExtension = fileType.split('/')[1];
      if (!fileExtension) {
        throw new Error('Invalid content type');
      }
      const fileNameWithExtension = `${fileName}.${fileExtension}`;
      const params = {
        Bucket: AWS_KEYS.BUCKET,
        Key: fileNameWithExtension,
        Expires: TTL,
        ContentType: fileType,
        ACL: 'public-read',
      };
      return res.reply({
        data: {
          presignedUrl: s3.getSignedUrl('putObject', params),
          key: fileNameWithExtension,
          fileId,
        },
      });
    } catch (err) {
      return next(err);
    }
  }
);

module.exports = router;

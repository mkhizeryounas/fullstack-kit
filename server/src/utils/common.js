import { SECRET } from '../config/keys';
import sha256 from 'sha256';
import Joi from 'joi';
import slugify from 'slugify';

module.exports = {
  parse: (msg) => {
    return JSON.parse(JSON.stringify(msg));
  },
  time: () => {
    return Math.floor(new Date() / 1000);
  },
  hash: (str) => {
    return sha256(str + SECRET);
  },
  toSlug: (str) => {
    return slugify(str).toLowerCase();
  },
  validate: async (obj, schema) => {
    return new Promise((resolve, reject) => {
      Joi.validate(obj || {}, schema, function (error, value) {
        if (error) {
          error.responseCode = 422; // validation error
          reject(error);
        } else {
          resolve(value);
        }
      });
    });
  },
  simplifyJoiError: (err) => {
    if (err.hasOwnProperty('errors') && Array.isArray(err.errors)) {
      err.errors = err.errors.reduce((pre, now) => {
        return [...pre, ...now.messages];
      }, []);
    }
    return err;
  },
};

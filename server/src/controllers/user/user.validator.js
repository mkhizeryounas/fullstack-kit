import Joi from '../../utils/joi';

export const ENUMS = {
  SCOPES: ['ADMIN', 'USER'],
};

export const create = {
  body: {
    name: Joi.string().required(),
    email: Joi.string().required(),
    workspace: Joi.object({
      name: Joi.string().required(),
      identifier: Joi.string().required(),
    }),
    password: Joi.string().required(),
    scope: Joi.string().valid(ENUMS.SCOPES),
  },
};

export const availabilityCheck = {
  query: {
    identifier: Joi.string().required(),
  },
};

export const signin = {
  body: {
    email: Joi.string().required(),
    password: Joi.string().required(),
    workspace: Joi.string().required(),
  },
};

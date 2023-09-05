import express from 'express';
import Joi from './joi';
import validate from 'express-validation';
import HttpStatus from 'http-status-codes';

const validators = {
  list: {
    query: {
      limit: Joi.number().min(0).max(100).default(25),
      page: Joi.number().min(1).default(1),
      filter: Joi.object().default({}),
      sort: Joi.object().default({}),
    },
  },
  single: {
    params: {
      id: Joi.objectId().required(),
    },
  },
};

class Mixin {
  constructor({
    middlewares = [],
    model,
    prefix = null,
    validator = {},
    methods = [],
    populate = [],
    queryset = () => ({}),
    transform = (req) => req,
  }) {
    this.availableMethods = ['list', 'create', 'read', 'update', 'delete'];
    this.middlewares = Array.isArray(middlewares) ? middlewares : [middlewares];
    this.populate = populate;
    this.querysetFn = queryset;

    this.middlewares.push(async (req, _, next) => {
      try {
        req.queryset = await queryset(req);
        return next();
      } catch (err) {
        return next(err);
      }
    });

    this.middlewares.push(async (req, _, next) => {
      req = await transform(req);
      return next();
    });

    this.model = model;
    this.listRoute = prefix ? `/${prefix}` : '/';
    this.singleRoute =
      this.listRoute !== '/' ? `${this.listRoute}/:id` : '/:id';
    this.validator = validator;
    this.router = express.Router({ mergeParams: true });

    this.router.use(async (req, _, next) => {
      try {
        req.self = async () => {
          const queryset = await this.querysetFn(req);
          const { id } = req.params;
          if (!id) {
            return null;
          }
          return this.getById({ id, queryset });
        };
        return next();
      } catch (err) {
        return next(err);
      }
    });

    this.register(methods);
  }
  async getById({ id, queryset }) {
    return this.model.findOne({ _id: id, ...queryset }).populate(this.populate);
  }
  list() {
    this.router.get(
      this.listRoute,
      [...this.middlewares, validate(validators.list)],
      async (req, res, next) => {
        try {
          const { queryset } = req;

          const { filter, page, limit, sort } = req.query;

          const data = await this.model.paginate(
            { ...filter, ...queryset },
            { page, limit, sort, populate: this.populate }
          );

          res.reply({ data, status: HttpStatus.OK });
        } catch (err) {
          return next(err);
        }
      }
    );
  }

  read() {
    this.router.get(
      this.singleRoute,
      [...this.middlewares, validate(validators.single)],
      async (req, res, next) => {
        try {
          const { queryset } = req;
          const { id } = req.params;
          const data = await this.getById({ id, queryset });
          if (!data) {
            throw {
              status: HttpStatus.NOT_FOUND,
            };
          }

          res.reply({ data, status: HttpStatus.OK });
        } catch (err) {
          return next(err);
        }
      }
    );
  }

  create() {
    this.router.post(
      this.listRoute,
      [...this.middlewares, validate({ body: this.validator })],
      async (req, res, next) => {
        try {
          const { queryset } = req;

          let data = new this.model({
            ...req.body,
            ...queryset,
          });
          await data.save();
          data = await this.model.populate(data, this.populate);

          res.reply({ data, status: HttpStatus.CREATED });
        } catch (err) {
          return next(err);
        }
      }
    );
  }

  update() {
    this.router.put(
      this.singleRoute,
      [
        ...this.middlewares,
        validate(validators.single),
        validate({ body: this.validator }),
      ],
      async (req, res, next) => {
        try {
          const { queryset, body } = req;
          const { id } = req.params;

          const data = await this.model
            .findOneAndUpdate(
              {
                _id: id,
                ...queryset,
              },
              { $set: body },
              { new: true }
            )
            .populate(this.populate);

          if (!data) {
            throw {
              status: HttpStatus.NOT_FOUND,
            };
          }

          res.reply({ data, status: HttpStatus.OK });
        } catch (err) {
          return next(err);
        }
      }
    );
  }

  delete() {
    this.router.delete(
      this.singleRoute,
      [...this.middlewares, validate(validators.single)],
      async (req, res, next) => {
        try {
          const { queryset } = req;
          const { id } = req.params;

          const data = await this.model.remove({ _id: id, ...queryset });
          if (!data || !data.deletedCount) {
            throw {
              status: HttpStatus.NOT_FOUND,
            };
          }

          res.reply({ data: '', status: HttpStatus.NO_CONTENT });
        } catch (err) {
          return next(err);
        }
      }
    );
  }

  register(methods = this.availableMethods) {
    methods.map((e) => {
      if (!this.availableMethods.includes(e)) {
        throw Error('Unknown method::', e);
      }
      this[e]();
    });
  }
}

export const METHOD_TYPES = {
  LIST: 'list',
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
};

export default Mixin;

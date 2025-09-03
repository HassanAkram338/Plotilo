// Central Zod validator middleware (CommonJS)
const { ZodError } = require('zod');

const pick = (obj, keys = []) =>
  keys.reduce(
    (acc, k) => (obj && obj[k] !== undefined ? ((acc[k] = obj[k]), acc) : acc),
    {}
  );

module.exports.validate = (schemas = {}) => {
  return (req, res, next) => {
    try {
      if (schemas.body) req.body = schemas.body.parse(req.body);
      if (schemas.params) req.params = schemas.params.parse(req.params);
      if (schemas.query) req.query = schemas.query.parse(req.query);
      return next();
    } catch (err) {
      next(err);
    }
  };
};

const AppError = require("./AppError");

const BadRequestError = (msg = "Bad Request") =>
  new AppError(msg, 400, "BadRequest");

const UnauthorizedError = (msg = "Unauthorized") =>
  new AppError(msg, 401, "Unauthorized");

const ForbiddenError = (msg = "Forbidden") =>
  new AppError(msg, 403, "Forbidden");

const NotFoundError = (msg = "Not Found") =>
  new AppError(msg, 404, "NotFound");

module.exports = {
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
};

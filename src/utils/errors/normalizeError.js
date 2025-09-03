const AppError = require('./AppError');
const { handleZodError } = require('./zodErrors');
const { handleAuthError } = require('./authErrors');
const { handlePrismaError } = require('./prismaErrors');

function normalizeError(err) {
  //  Handle custom AppErrors
  if (err instanceof AppError) {
    return {
      status: err.status,
      response: {
        success: false,
        error: { type: err.name, message: err.message },
      },
    };
  }

  //  Delegate to specialized handlers
  return (
    handleZodError(err) ||
    handleAuthError(err) ||
    handlePrismaError(err) || {
      status: 500,
      response: {
        success: false,
        error: {
          type: 'InternalServerError',
          message: 'Something went wrong, please try again later.',
        },
      },
    }
  );
}

module.exports = { normalizeError };

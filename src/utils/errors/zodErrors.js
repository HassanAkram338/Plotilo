const { ZodError } = require("zod");

function handleZodError(err) {
  if (!(err instanceof ZodError)) return null;

  return {
    status: 400,
    response: {
      success: false,
      error: {
        type: "ValidationError",
        message: err.issues.map((e) => ({
          path: e.path.join("."),
          message: e.message,
          code: e.code,
        })),
      },
    },
  };
}

module.exports = { handleZodError };

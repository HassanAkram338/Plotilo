function handleAuthError(err) {
  if (
    err.name === "UnauthorizedError" ||
    err.name === "JsonWebTokenError" ||
    err.name === "TokenExpiredError"
  ) {
    return {
      status: 401,
      response: {
        success: false,
        error: { type: "Unauthorized", message: err.message },
      },
    };
  }
  return null;
}

module.exports = { handleAuthError };

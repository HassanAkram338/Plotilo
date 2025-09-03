const isProduction = process.env.NODE_ENV === "production";

function handlePrismaError(err) {
  if (!err.name?.startsWith("PrismaClient")) return null;

  switch (err.name) {
    case "PrismaClientKnownRequestError": {
      let message = "Database request error.";
      if (err.code === "P2002") {
        message = isProduction
          ? "A record with this field already exists."
          : `Unique constraint failed on fields: ${err.meta?.target?.join(", ")}`;
      }
      return {
        status: 400,
        response: {
          success: false,
          error: { type: "DatabaseKnownRequestError", message, code: err.code },
        },
      };
    }

    case "PrismaClientValidationError":
      return {
        status: 400,
        response: {
          success: false,
          error: {
            type: "DatabaseValidationError",
            message: isProduction
              ? "Invalid database query parameters."
              : err.message,
          },
        },
      };

    case "PrismaClientInitializationError":
      return {
        status: 500,
        response: {
          success: false,
          error: {
            type: "DatabaseInitializationError",
            message: "Failed to initialize database connection.",
          },
        },
      };

    case "PrismaClientUnknownRequestError":
      return {
        status: 500,
        response: {
          success: false,
          error: {
            type: "DatabaseUnknownRequestError",
            message: "An unknown database error occurred.",
          },
        },
      };

    case "PrismaClientRustPanicError":
      return {
        status: 500,
        response: {
          success: false,
          error: {
            type: "DatabaseRustPanicError",
            message: "Database engine panicked. Please retry later.",
          },
        },
      };

    default:
      return null;
  }
}

module.exports = { handlePrismaError };

class AppError extends Error {
  constructor(message, status, name = "AppError") {
    super(message);
    this.status = status;
    this.name = name;
  }
}

module.exports = AppError;

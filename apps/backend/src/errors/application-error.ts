export class ApplicationError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number = 500,
    public readonly code: string = "INTERNAL_SERVER_ERROR"
  ) {
    if (!message || message.trim() === "") {
      throw new Error("Error message cannot be empty");
    }

    if (typeof statusCode !== "number") {
      throw new TypeError("Status code must be a number");
    }

    super(message);
    this.name = this.constructor.name;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }

    Object.freeze(this);
  }
}

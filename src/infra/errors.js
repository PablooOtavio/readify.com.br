export class InternalServerError extends Error {
  constructor({ cause, statusCode }) {
    super("An unexpected error occurred.", { cause });
    this.name = "InternalServerError";
    this.statusCode = statusCode || 500;
  }
  toJSON() {
    return {
      statusCode: this.statusCode,
      name: this.name,
      message: this.message,
      action: "Please, contact the support team.",
    };
  }
}
export class MethodNotAllowedError extends Error {
  constructor() {
    super("Method not allowed");
    this.name = "MethodNotAllowedError";
    this.statusCode = 405;
  }
  toJSON() {
    return {
      statusCode: this.statusCode,
      name: this.name,
      message: this.message,
      action: "Use one of the allowed methods.",
    };
  }
}

export class ServiceError extends Error {
  constructor({ cause, message }) {
    super(message || "Service currently unavailable. Please try again later", {
      cause,
    });
    this.name = "ServiceError";
    this.statusCode = 503;
  }
  toJSON() {
    return {
      statusCode: this.statusCode,
      name: this.name,
      message: this.message,
      action: "Please, contact the support team.",
    };
  }
}

export class InternalServerError extends Error {
  constructor({ cause }) {
    super("An unexpected error occurred.", { cause });
    this.name = "InternalServerError";
  }
  toJSON() {
    return {
      statusCode: 500,
      name: this.name,
      message: this.message,
      action: "Please, contact the support team.",
    };
  }
}

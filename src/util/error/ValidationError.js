import AppError from "./AppError.js";

export default class ValidationError extends AppError {
  constructor(message) {
    super(message, 400);
  }
}

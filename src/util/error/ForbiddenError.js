import AppError from "./AppError.js";

export default class ForbiddenError extends AppError {
  constructor(message = 'Acesso negado') {
    super(message, 403);
  }
}

import AppError from "./AppError.js";

export default class NotFoundError extends AppError {
    constructor(message = "Recurso") {
        super(`${message} não encontrado`, 404);
    }
}
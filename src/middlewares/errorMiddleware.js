import { logger } from "../util/logger.js";

// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
  logger.error(err);

  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      status: 'error',
      message: err.message,
      errors: err.errors || [],
    });
  }

  logger.error('ERRO INESPERAD: ', err);
  return res.status(500).json({
    status: 'error',
    message: 'Erro interno do servidor',
  });
};

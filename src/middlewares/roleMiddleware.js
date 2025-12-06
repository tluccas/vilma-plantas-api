import { UnauthorizedError, ForbiddenError } from '../util/error/index.js';

export default function roleMiddleware(...allowedRoles) {
    
  return (req, res, next) => {
    if (!req.userRole) {
      throw new UnauthorizedError('Role do usuário sem role.');
    }

    if (!allowedRoles.includes(req.userRole)) {
      throw new ForbiddenError('Acesso negado. Roles permitidas: ' + allowedRoles.join(', '));
    }

    next();
  };
}

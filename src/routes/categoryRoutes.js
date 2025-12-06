import { Router } from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import roleMiddleware from '../middlewares/roleMiddleware.js';
import CategoryController from '../controllers/CategoryController.js';

const routes = new Router();

routes.get('/', CategoryController.getAll);
routes.get('/:id', CategoryController.getById);
routes.post('/', authMiddleware, roleMiddleware('admin'), CategoryController.create);
routes.patch('/:id', authMiddleware, roleMiddleware('admin'), CategoryController.update);
routes.delete('/:id', authMiddleware, roleMiddleware('admin'), CategoryController.delete);

export default routes;
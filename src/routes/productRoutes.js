import { Router } from 'express';
import ProductController from '../controllers/ProductController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import roleMiddleware from '../middlewares/roleMiddleware.js';

const routes = new Router();

routes.get('/', ProductController.getProducts);
routes.post('/', authMiddleware, roleMiddleware('admin'), ProductController.create);
routes.delete('/:id', authMiddleware, roleMiddleware('admin'), ProductController.delete);

export default routes;

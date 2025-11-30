import { Router } from 'express';
import AuthController from '../controllers/auth/AuthController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const routes = new Router();

routes.post('/login', AuthController.create);
routes.post('/logout', AuthController.delete);
routes.get('/profile', authMiddleware, AuthController.profile);

export default routes;

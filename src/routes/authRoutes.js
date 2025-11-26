import { Router } from 'express';
import AuthController from '../controllers/auth/AuthController.js';

const routes = new Router();

routes.post('/login', AuthController.create);
routes.post('/logout', AuthController.delete);

export default routes;

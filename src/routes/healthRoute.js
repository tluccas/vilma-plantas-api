import { Router } from 'express';

const routes = new Router();

routes.get('/health', (req, res) => {
  return res.json({
    status: 'ok',
    message: 'API Vilma Plantas Online está rodando!',
  });
});


export default routes;

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import healthRoute from './routes/healthRoute.js';
import authRoutes from './routes/authRoutes.js';

class App {
  constructor() {
    this.server = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(cors({
      origin: 'http://localhost:3000',
      credentials: true,
    }));
    this.server.use(helmet());
    this.server.use(express.json());
  }

  routes() {
    this.server.use(healthRoute);
    this.server.use('/auth', authRoutes);
  }
}

export default new App().server;

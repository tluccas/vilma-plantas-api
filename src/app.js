import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import healthRoute from './routes/healthRoute.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cookieParser from 'cookie-parser';

class App {
  constructor() {
    this.server = express();
    this.middlewares();
    this.server.use(cookieParser());
    this.routes();
  }

  middlewares() {
    this.server.use(cors({
      origin: ['http://localhost:3000',
        'http://localhost:5173'
      ],
      credentials: true,
    }));
    this.server.use(helmet());
    this.server.use(express.json());
  }

  routes() {
    this.server.use(healthRoute);
    this.server.use('/auth', authRoutes);
    this.server.use('/user', userRoutes);
    this.server.use('/product', productRoutes);
  }
}

export default new App().server;

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
const cookieParser = require('cookie-parser');
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  app.use(helmet());

  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:5173'],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  const PORT: number = Number(process.env.PORT);
  await app.listen(PORT);
  console.log(`[ RODANDO ] Servidor rodando na porta: ${PORT}`);
}

bootstrap().catch((error) => {
  console.error('Erro ao iniciar o servidor:', error);
  process.exit(1);
});

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import { Logger } from 'nestjs-pino';

const isProd = process.env.NODE_ENV === 'production';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  app.use(compression());
  app.useLogger(app.get(Logger));
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.enableCors({
    origin: process.env.FRONT_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  app.use(cookieParser(process.env.COOKIE_KEY));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

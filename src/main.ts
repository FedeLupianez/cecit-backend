import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConsoleLogger, ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import compression from 'compression';

const isProd = process.env.NODE_ENV === 'production';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: new ConsoleLogger({
            prefix: 'CecitBackend',
            timestamp: true,
            logLevels: isProd ? ['log', 'error', 'warn'] : ['log', 'error', 'warn', 'debug', 'verbose'],
        }),
    });
    app.use(compression());
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

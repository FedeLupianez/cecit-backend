import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from './datasource/typeorm.module';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        TypeOrmModule,
        // Cargar la config del archivo .env para uso global
        ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env.development' }),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule { }

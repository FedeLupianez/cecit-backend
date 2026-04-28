import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from './datasource/typeorm.module';
import { ConfigModule } from '@nestjs/config';
import { CategoriesModule } from './categories/categories.module';

@Module({
    imports: [
        TypeOrmModule,
        // Cargar la config del archivo .env para uso global
        ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env.development' }),
        CategoriesModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule { }

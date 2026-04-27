import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from './datasource/typeorm.module';
import { ConfigModule } from '@nestjs/config';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';
import { BenefitsModule } from './benefits/benefits.module';
import {BenefitsService} from './benefits/benefits.service';
import { BenefitTypeModule } from './benefit_type/benefit_type.module';
import { BenefitTypeService } from './benefit_type/benefit_type.service';
@Module({
    imports: [
        TypeOrmModule,
        // Cargar la config del archivo .env para uso global
        ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env.development' }),
        UserModule,
        BenefitsModule,
        BenefitTypeModule,
    ],
    controllers: [AppController, UserController],
    providers: [AppService, UserService, BenefitTypeService],
})
export class AppModule { }

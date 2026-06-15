import { Module } from '@nestjs/common';
import { PartnersAdminsController } from './partnersadmins.controller';
import { PartnersAdminsService } from './partnersadmins.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PartnersAdminsEntity } from './partnersadmins.entity';
import { PartnersService } from '../partners/partners.service';
import { PartnersController } from '../partners/partners.controller';
import { PartnersEntity } from '../partners/partners.entity';
import { AdminGuard } from 'src/auth/admin.guard';

@Module({
    imports: [TypeOrmModule.forFeature([PartnersAdminsEntity, PartnersEntity])],
    controllers: [PartnersAdminsController, PartnersController],
    providers: [PartnersAdminsService, PartnersService, AdminGuard],
    exports: [PartnersService, PartnersAdminsService]
})
export class PartnersAdminsModule { }

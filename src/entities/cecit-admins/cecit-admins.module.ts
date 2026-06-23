import { Module } from '@nestjs/common';
import { CecitAdminsController } from './cecit-admins.controller';
import { CecitAdminsService } from './cecit-admins.service';
import { CecitAdminsEntity } from './cecit-admins.entity'
import { TypeOrmModule } from '@nestjs/typeorm';
import { CecitAdminGuard } from 'src/auth/cecitadmin.guard';

@Module({
    imports: [TypeOrmModule.forFeature([CecitAdminsEntity])],
    controllers: [CecitAdminsController],
    providers: [CecitAdminsService, CecitAdminGuard],
    exports: [CecitAdminsService, CecitAdminGuard]
})
export class CecitAdminsModule { }

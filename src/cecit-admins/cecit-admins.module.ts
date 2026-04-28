import { Module } from '@nestjs/common';
import { CecitAdminsController } from './cecit-admins.controller';
import { CecitAdminsService } from './cecit-admins.service';
import { CecitAdminsEntity } from './cecit-admins.entity'
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([CecitAdminsEntity])],
    controllers: [CecitAdminsController],
    providers: [CecitAdminsService]
})
export class CecitAdminsModule { }

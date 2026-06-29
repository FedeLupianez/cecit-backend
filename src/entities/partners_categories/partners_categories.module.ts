import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PartnersCategoriesEntity } from './partners_categories.entity';
import { PartnersCategoriesService } from './partners_categories.service';
import { PartnersCategoriesController } from './partners_categories.controller';
import { AccountsModule } from '../accounts/accounts.module';
import { PassportModule } from '@nestjs/passport';

@Module({
    imports: [TypeOrmModule.forFeature([PartnersCategoriesEntity]), AccountsModule, PassportModule],
    controllers: [PartnersCategoriesController],
    providers: [PartnersCategoriesService],
})
export class PartnersCategoriesModule { }

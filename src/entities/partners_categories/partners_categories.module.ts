import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PartnersCategoriesEntity } from './partners_categories.entity';
import { PartnersCategoriesService } from './partners_categories.service';
import { PartnersCategoriesController } from './partners_categories.controller';

@Module({
    imports: [TypeOrmModule.forFeature([PartnersCategoriesEntity])],
    controllers: [PartnersCategoriesController],
    providers: [PartnersCategoriesService],
})
export class PartnersCategoriesModule { }

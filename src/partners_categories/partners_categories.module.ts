import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PartnersCategories } from './partners_categories.entity';
import { PartnersCategoriesService } from './partners_categories.service';
import { PartnersCategoriesController } from './partners_categories.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PartnersCategories])],
  controllers: [PartnersCategoriesController],
  providers: [PartnersCategoriesService],
})
export class PartnersCategoriesModule {}
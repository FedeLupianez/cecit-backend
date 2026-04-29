import { Controller, Post, Body, Get } from '@nestjs/common';
import { PartnersCategoriesService } from './partners_categories.service';
import { CreatePartnersCategoriesDto } from './partners_categories.dto';

@Controller('partners-categories')
export class PartnersCategoriesController {

  constructor(private service: PartnersCategoriesService) {}

  @Post()
  create(@Body() body: CreatePartnersCategoriesDto) {
    return this.service.create(body);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }
}
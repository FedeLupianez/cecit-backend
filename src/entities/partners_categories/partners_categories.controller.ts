import { Controller, Post, Body, Get } from '@nestjs/common';
import { PartnersCategoriesService } from './partners_categories.service';
import { PartnersCategoriesDto } from './partners_categories.dto';

@Controller('partners-categories')
export class PartnersCategoriesController {

    constructor(private service: PartnersCategoriesService) { }

    @Post()
    async create(@Body() body: PartnersCategoriesDto) {
        return await this.service.create(body);
    }

    @Get()
    async findAll() {
        return await this.service.findAll();
    }
}

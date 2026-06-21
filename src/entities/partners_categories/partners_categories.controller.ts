import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { PartnersCategoriesService } from './partners_categories.service';
import { PartnersCategoriesDto } from './partners_categories.dto';
import { AuthGuard } from '@nestjs/passport';
import { CecitAdminGuard } from 'src/auth/cecitadmin.guard';

@Controller('partners-categories')
export class PartnersCategoriesController {

    constructor(private service: PartnersCategoriesService) { }

    @UseGuards(AuthGuard('jwt'), CecitAdminGuard)
    @Post()
    async create(@Body() body: PartnersCategoriesDto) {
        return await this.service.create(body);
    }

    @Get()
    async findAll() {
        return await this.service.findAll();
    }
}
